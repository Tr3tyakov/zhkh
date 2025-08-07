from abc import abstractmethod
from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.user.aggregates.user import UserAggregate
from app.domain.user.value_objects.filters.user_filter import UserFilter
from app.infrastructure.persistence.common.options import Options


class IUserRepository(IRepository):

    @abstractmethod
    async def create_user(self, aggregate: UserAggregate) -> UserAggregate: ...

    @abstractmethod
    async def get_user(
        self,
        filters: Optional[UserFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[UserAggregate, Sequence[UserAggregate], Any]]: ...

    @abstractmethod
    async def check_existence_user(
        self,
        filters: Optional[UserFilter] = None,
        options: Optional[Options] = None,
    ) -> bool: ...

    @abstractmethod
    async def update_user(self, user: UserAggregate) -> UserAggregate: ...

    @abstractmethod
    async def delete_user(self, user: UserAggregate) -> None: ...
