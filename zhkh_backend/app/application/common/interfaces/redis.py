from abc import (
    ABC,
    abstractmethod,
)
from typing import (
    Any,
    Optional,
)


class IRedis(ABC):
    @abstractmethod
    async def get(self, key: str) -> Any: ...

    @abstractmethod
    async def ttl(self, key: str) -> Optional[int]: ...

    @abstractmethod
    async def set(self, key: str, value, time_live: Optional[int] = None) -> None: ...

    @abstractmethod
    async def delete(self, key: Any) -> None: ...

    @abstractmethod
    def connect(self): ...

    @abstractmethod
    async def close(self): ...
