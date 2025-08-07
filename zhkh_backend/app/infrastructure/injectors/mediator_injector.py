import importlib
import inspect
import os
from collections import defaultdict
from types import ModuleType
from typing import (
    Dict,
    List,
    Tuple,
    Type,
    Union,
    get_args,
)

from app.application.common.behaviors.validation_behavior import ValidationBehavior
from app.application.common.interfaces.behavior import (
    IValidationContainer,
    IValidator,
)
from app.application.common.interfaces.container import IContainer
from app.application.common.interfaces.injectors import IMediatorInjector
from app.application.common.interfaces.mediator import IMediator
from app.application.common.interfaces.request import (
    ICommand,
    INotificationHandler,
    IQuery,
    IRequestHandler,
)
from app.infrastructure.containers.utils import Configuration
from app.infrastructure.mediator.mediator import Mediator

CollectedHandlersType = Dict[Type[IRequestHandler], Union[ICommand, IQuery]]
CollectedValidatorsType = Dict[ICommand, List[Type[IValidator]]]


class MediatorInjector(IMediatorInjector):
    def __init__(
        self, container: IContainer, validation_container: IValidationContainer
    ):
        self._container = container
        self._validation_container = validation_container
        self._behaviors = []

    def inject(self, application_modules: Tuple[ModuleType]) -> None:
        collected_handlers, collected_validators, validator_classes = (
            self._collect_parts(application_modules)
        )

        # Регистрируем обработчики
        for handler, action in collected_handlers.items():
            self._container.add_singleton(implementation=handler, interface=action)

        # Регистрируем валидаторы
        for validator in validator_classes:
            self._container.add_singleton(implementation=validator, interface=validator)

        # Привязываем команды к валидаторам
        for command, classes in collected_validators.items():
            self._validation_container.register_validator(
                command=command,
                validators=classes,
            )

        self._behaviors.append(
            ValidationBehavior(
                validation_provider=self._validation_container.services,
                service_provider=self._container.services,
            )
        )

        self._container.add_singleton(
            implementation=Mediator,
            interface=IMediator,
            config=Configuration(
                service_provider=self._container.services, behaviors=self._behaviors
            ),
        )

    def _collect_parts(
        self, application_modules: Tuple[ModuleType]
    ) -> Tuple[CollectedHandlersType, CollectedValidatorsType, List[Type[IValidator]]]:
        """
        Проходит по модулям и собирает словари вида:
        CollectedHandlersType | CollectedValidatorsType, где
        ключ –> класс обработчик,
        значение -> команда или квери
        """
        collected_handlers: CollectedHandlersType = {}
        collected_validators: CollectedValidatorsType = defaultdict(list)
        validator_classes = []
        for application_module in application_modules:
            for root, dirs, files in os.walk(application_module.__path__[0]):
                for file in files:
                    if file.endswith("handler.py"):
                        module = self._get_module(root, file, application_module)

                        for name, cls in inspect.getmembers(module, inspect.isclass):
                            if cls.__module__ != module.__name__ or not issubclass(
                                cls, (IRequestHandler, INotificationHandler)
                            ):
                                continue

                            request = get_args(cls.__orig_bases__[0])[0]
                            collected_handlers[cls] = request

                    if file.endswith("validator.py"):
                        module = self._get_module(root, file, application_module)
                        for name, cls in inspect.getmembers(module, inspect.isclass):
                            if not issubclass(cls, IValidator) or cls is IValidator:
                                continue

                            validator_classes.append(cls)
                            for command in cls.SUPPORTED:
                                collected_validators[command].append(cls)

        return collected_handlers, collected_validators, validator_classes

    def _get_module(
        self, root: str, file: str, handler_module: ModuleType
    ) -> ModuleType:
        base_module, base_path = handler_module.__name__, handler_module.__path__[0]
        full_path = os.path.join(root, file)
        rel_path = os.path.relpath(full_path, base_path)
        module_path = rel_path.replace(os.sep, ".").removesuffix(".py")

        return importlib.import_module(name=f"{base_module}.{module_path}")
