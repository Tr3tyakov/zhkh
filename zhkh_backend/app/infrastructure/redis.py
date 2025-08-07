import logging
from typing import (
    Any,
    Dict,
    Optional,
)

from dynaconf.utils.boxing import DynaBox
from orjson import orjson
from redis.asyncio import Redis as RedisClient

from app.application.common.interfaces.redis import IRedis


class Redis(IRedis):

    def __init__(self, settings: DynaBox):
        self._client = None
        self._settings = settings

    async def get(self, key: str) -> Dict[str, Any]:
        """
        Получение новых данных по ключу
        """
        value = await self._client.get(key)

        return orjson.loads(value) if value else None

    async def ttl(self, key: str) -> Optional[int]:
        """
        Получение оставшегося времени жизни ключа в секундах.
        Возвращает:
            int: количество секунд до истечения времени жизни ключа,
                 -1 если ключ существует и не имеет TTL,
                 -2 если ключ не существует.
        """
        try:
            return await self._client.ttl(key)
        except Exception as e:
            logging.exception("Ошибка при получении TTL ключа %s: %s", key, e)
            return None

    async def set(self, key: str, value, time_live: Optional[int] = None) -> None:
        """
        Добавление новых данных по ключу

        """

        if time_live is None:
            time_live = self._settings.time_live

        await self._client.set(key, value=orjson.dumps(value), ex=time_live)

    async def delete(self, key: Any) -> None:
        """
        Удаление данных по ключу
        """
        await self._client.delete(key)

    async def connect(self):
        if not self._client:
            self._client = RedisClient.from_url(
                self._get_redis_url(),
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
            )
            logging.info("Открытие подключения к Redis")
            try:
                await self._client.ping()  # Проверка подключения
            except Exception as e:
                logging.error(f"Redis connection failed: {e}")
                await self.close()
                raise

    async def close(self):
        await self._client.close()

    def _get_redis_url(self) -> str:
        return "redis://{host}:{port}/{database_number}".format(
            host=self._settings.host,
            port=self._settings.port,
            database_number=self._settings.default_database,
        )
