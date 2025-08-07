from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.domain.user.aggregates.user import UserAggregate
from app.domain.user.value_objects.filters.user_filter import UserFilter
from app.infrastructure.orm.mapping.user_translator import UserTranslator
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class UserRepository(BaseRepository, IUserRepository):
    translator = UserTranslator

    async def create_user(self, aggregate: UserAggregate) -> UserAggregate:
        return await self.create_instance(aggregate)

    async def get_user(
        self,
        filters: Optional[UserFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[UserAggregate, Sequence[UserAggregate], Any]]:
        return await self.get(filters, options)

    async def check_existence_user(
        self, filters: Optional[UserFilter] = None, options: Optional[Options] = None
    ) -> bool:
        return await self.check_existence(filters, options)

    async def update_user(self, user: UserAggregate) -> UserAggregate:
        return await self.update_instance(**user.dump(exclude={"file_path"}))

    async def delete_user(self, user: UserAggregate) -> None:
        return await self.delete_instances(ids=[user.id])
