from abc import (
    ABC,
    abstractmethod,
)
from typing import Any

from ..interfaces.request import (
    TNotification,
    TRequest,
)


class ISender(ABC):
    @abstractmethod
    async def send(self, request: TRequest) -> Any: ...


class IPublisher(ABC):
    @abstractmethod
    async def publish(self, request: TNotification) -> Any: ...


class IMediator(ISender, IPublisher): ...
