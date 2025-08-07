import logging
from contextlib import asynccontextmanager
from typing import (
    AsyncGenerator,
    Optional,
)

from dynaconf.utils.boxing import DynaBox
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
)
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from app.application.common.interfaces.postgres import IDatabase


class Database(IDatabase):

    def __init__(self, settings: DynaBox, db_url: str) -> None:
        self._settings = settings
        self._db_url = db_url
        self._async_session = None
        self._async_engine = None

    def connect(self, test_db_url: Optional[str] = None) -> None:
        logging.info("Открытие подключения к базе данных %s", self.__class__.__name__)
        self._async_engine = create_async_engine(
            self._db_url,
            echo=self._settings.echo,
            echo_pool=self._settings.echo_pool,
            future=True,
            pool_pre_ping=self._settings.pool_pre_ping,
            pool_recycle=self._settings.pool_recycle,
            poolclass=NullPool,
        )
        self._async_session = sessionmaker(
            bind=self._async_engine,
            expire_on_commit=False,
            autoflush=False,
            autocommit=False,
            class_=AsyncSession,
        )

    async def close(self) -> None:
        logging.info("Асинхронное закрытие подключения к базе данных")
        if self._async_engine:
            await self._async_engine.dispose()

    @asynccontextmanager
    async def async_context(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Контекстный менеджер асинхронной сессии
        """

        async_session = self._async_session()
        try:
            yield async_session
            await async_session.commit()
        except Exception as exc:
            logging.exception(
                "Необработанное исключение при работе с БД асинхронной сессией: %s", exc
            )
            await async_session.rollback()
            raise
        finally:
            await async_session.close()
