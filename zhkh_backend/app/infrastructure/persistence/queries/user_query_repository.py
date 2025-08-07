from typing import Optional

from sqlalchemy import (
    func,
    select,
)

from app.application.user.schemas.user_information_response_schema import (
    UserListResponseSchema,
    UserTableInformationSchema,
)
from app.domain.common.interfaces.repositories.queries.user_query_repository import (
    IUserQueryRepository,
)
from app.infrastructure.common.enums.base import ResultStrategy
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)
from app.infrastructure.orm.models import User
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class UserQueryRepository(BaseRepository, IUserQueryRepository):

    async def get_users(
        self,
        limit: int,
        offset: int,
        search: Optional[str] = None,
        user_type: Optional[UserTypeEnum] = None,
        account_status: Optional[UserAccountStatusEnum] = None,
    ) -> UserListResponseSchema:
        stmt = select(User).order_by(User.id)

        if search:
            search_like = f"%{search.lower()}%"
            full_name = func.lower(
                func.concat_ws(
                    " ",
                    User.middle_name,
                    User.first_name,
                    User.last_name,
                )
            )
            stmt = stmt.where(full_name.ilike(search_like))

        if user_type:
            stmt = stmt.where(User.user_type == user_type)

        if account_status:
            stmt = stmt.where(User.account_status == account_status)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        count = await self.execute(
            count_stmt, options=Options(strategy=ResultStrategy.SCALAR)
        )

        stmt = stmt.limit(limit).offset(offset)
        users = await self.execute(
            stmt, options=Options(strategy=ResultStrategy.SCALARS_ALL)
        )

        return UserListResponseSchema(
            users=[UserTableInformationSchema.model_validate(user) for user in users],
            total=count,
        )
