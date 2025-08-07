import inspect
from types import ModuleType
from typing import (
    Any,
    Dict,
    List,
    Type,
    get_args,
    get_origin,
)

from fastapi import HTTPException

from app.application.common.interfaces.behavior import (
    IPipelineBehavior,
    IValidationProvider,
)
from app.application.common.interfaces.container import IServiceProvider
from app.application.common.interfaces.request import ICommand
from app.infrastructure.mediator.pipline_context import PipelineContext


class ValidationBehaviorError(HTTPException): ...


class ValidationBehavior(IPipelineBehavior):
    def __init__(
        self,
        validation_provider: IValidationProvider,
        service_provider: IServiceProvider,
    ):
        self._service_provider = service_provider
        self._validation_provider = validation_provider

    async def handle(self, command: ICommand, context: PipelineContext) -> Any:
        validation_interfaces = self._validation_provider.resolve(command)
        if validation_interfaces is None:
            return

        validations = self._service_provider.resolve_all(validation_interfaces)

        [await validator.validate(command, context) for validator in validations]

    def collect_validators(self, module: ModuleType) -> Dict[Type, List[Type]]:
        validators_map = {}

        for _, cls in inspect.getmembers(module, inspect.isclass):
            if not issubclass(cls, IPipelineBehavior) or cls is IPipelineBehavior:
                continue

            # Получаем тип команды из generic
            for base in getattr(cls, "__orig_bases__", []):
                origin = get_origin(base)
                if origin is IPipelineBehavior:
                    args = get_args(base)
                    if args:
                        command_type = args[0]
                        validators_map.setdefault(command_type, []).append(cls)

        return validators_map
