import logging
from contextlib import asynccontextmanager
from contextvars import ContextVar
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.application.common.interfaces.postgres import IDatabase
from app.application.common.interfaces.session_manager import ISessionManager
from app.infrastructure.containers.utils import Provide


class SessionManager(ISessionManager):
    """
    Менеджер для управления сессией
    """

    def __init__(self, database: IDatabase = Provide[IDatabase]):
        self._database = database
        self._session_context: ContextVar[AsyncSession] = ContextVar("session_context")

    @asynccontextmanager
    async def setup_session(
        self,
    ) -> AsyncGenerator[None, None]:
        """
        Установка сессии в контекст для текущего запроса
        """
        token = None
        try:
            async with self._database.async_context() as session:
                token = self._session_context.set(session)
                logging.info("Установлена сессия %s", token)
                yield
        finally:
            self.reset_session(token)

    def get_session(self) -> AsyncSession:
        """
        Возвращает сессию из контекста текущего запроса
        Если сессия не инициализирована, выбрасывает RuntimeError
        """
        try:
            return self._session_context.get()
        except LookupError:
            raise RuntimeError("Сессия не инициализирована")

    def reset_session(self, token):
        """
        Сбрасывает сессию в контексте
        """
        self._session_context.reset(token)
        logging.info("Сессия удалена %s", token)
