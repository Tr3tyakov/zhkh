from abc import abstractmethod
from typing import Optional

from app.application.user.schemas.user_information_response_schema import (
    UserListResponseSchema,
)
from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.common.schemas.house_response_schema import GetHouseResponseSchema


class IUserQueryRepository(IRepository):

    @abstractmethod
    async def get_users(
        self,
        limit: int,
        offset: int,
    ) -> UserListResponseSchema: ...
