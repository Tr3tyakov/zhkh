from abc import (
    ABC,
    abstractmethod,
)
from typing import (
    Generic,
    TypeVar,
)

from app.infrastructure.mediator.pipline_context import PipelineContext


class IRequest(ABC): ...


class IResponse(ABC): ...


class INotification(ABC): ...


class ICommand(IRequest): ...


class IQuery(IRequest): ...


TRequest = TypeVar("TRequest", bound=IRequest)
TResponse = TypeVar("TResponse", bound=IResponse)
TNotification = TypeVar("TNotification", bound=INotification)


class IRequestHandler(ABC, Generic[TRequest, TResponse]):

    @abstractmethod
    async def handle(
        self, request: TRequest, validation_context: PipelineContext
    ) -> TResponse: ...


class INotificationHandler(ABC, Generic[TNotification]):

    @abstractmethod
    async def handle(self, notification: TNotification) -> TResponse: ...
