from abc import (
    ABC,
    abstractmethod,
)
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession


class ISessionManager(ABC):

    @asynccontextmanager
    @abstractmethod
    async def setup_session(
        self,
    ) -> AsyncGenerator[None, None]: ...

    @abstractmethod
    def get_session(self) -> AsyncSession: ...

    @abstractmethod
    def reset_session(self, token) -> None: ...
