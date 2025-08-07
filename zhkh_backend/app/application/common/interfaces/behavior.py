from abc import (
    ABC,
    abstractmethod,
)
from typing import (
    Any,
    List,
    Tuple,
    Type,
)

from app.application.common.interfaces.request import (
    ICommand,
    IRequest,
)
from app.infrastructure.mediator.pipline_context import PipelineContext


class IValidator(ABC):
    SUPPORTED: Tuple[ICommand]

    @abstractmethod
    def validate(self, command: ICommand, context: PipelineContext): ...


class IValidationProvider(ABC):

    @abstractmethod
    def resolve(self, command: ICommand) -> Tuple[IValidator]: ...


class IValidationContainer(ABC):

    @property
    @abstractmethod
    def services(self) -> IValidationProvider: ...

    @abstractmethod
    def register_validator(
        self, command: ICommand, validators: List[Type[IValidator]]
    ) -> None: ...


class IPipelineBehavior(ABC):

    @abstractmethod
    async def handle(self, request: IRequest, context: PipelineContext) -> Any: ...
