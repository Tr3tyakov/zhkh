from abc import (
    ABC,
    abstractmethod,
)
from contextlib import asynccontextmanager
from typing import (
    AsyncGenerator,
    Optional,
)

from sqlalchemy.ext.asyncio import AsyncSession


class IDatabase(ABC):

    @abstractmethod
    def connect(self, test_db_url: Optional[str] = None) -> None: ...

    @abstractmethod
    @asynccontextmanager
    async def async_context(self) -> AsyncGenerator[AsyncSession, None]: ...

    @abstractmethod
    async def close(self) -> None: ...
