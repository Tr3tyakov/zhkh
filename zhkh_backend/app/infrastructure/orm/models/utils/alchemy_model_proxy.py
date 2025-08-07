from typing import Type

from app.application.common.interfaces.session_manager import ISessionManager
from app.infrastructure.containers.utils import Provide


class SQLAlchemyModelProxy:

    def __init__(self, session_manager: ISessionManager = Provide[ISessionManager]):
        self._session_manager = session_manager

    async def __call__(self, instance: Type, name: str) -> None:
        """
        Загрузка связанных данных
        @param instance: Экземпляр модели, к которому загружаются данные
        @param name: Наименование поля, которое требуется загрузить
        """
        session = self._session_manager.get_session()
        await session.refresh(instance, attribute_names=[name])
