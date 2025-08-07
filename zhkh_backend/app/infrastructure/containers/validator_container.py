from typing import (
    Callable,
    Dict,
    Optional,
    Tuple,
    Type,
)

from app.application.common.interfaces.behavior import (
    IValidationContainer,
    IValidationProvider,
    IValidator,
)
from app.application.common.interfaces.injectors import IDependencyInjector
from app.application.common.interfaces.request import ICommand
from app.infrastructure.containers.utils import transform_to_snake_case

VALIDATORS_TYPE = Dict[str, Tuple[IValidator]]


class ValidationProvider(IValidationProvider):

    def __init__(self, validators: VALIDATORS_TYPE):
        self._validators = validators

    def resolve(self, command: ICommand) -> Tuple[IValidator]:
        class_name = transform_to_snake_case(command.__class__.__name__)
        return self._validators.get(class_name)


class ValidationContainer(IValidationContainer):
    def __init__(self):
        self._validators: VALIDATORS_TYPE = {}

    @property
    def services(self) -> ValidationProvider:
        return ValidationProvider(self._validators)

    def register_validator(
        self, command: Type[ICommand], validators: Tuple[IValidator]
    ) -> None:
        class_name = transform_to_snake_case(command.__name__)
        self._validators[class_name] = validators


class BaseValidationInjector(IDependencyInjector):
    validations_implementer: Optional[Callable] = None

    def __init__(self, container: IValidationContainer):
        self._container = container

    def inject(self):
        self._add_validations()

    def _add_validations(self) -> "BaseValidationInjector":
        return self._add_dependency(self.validations_implementer)
