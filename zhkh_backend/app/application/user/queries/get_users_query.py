from typing import Optional

from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import PaginationSchema
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)


class GetUsersQuery(IQuery, PaginationSchema):
    user_id: int
    user_type: Optional[UserTypeEnum] = None
    account_status: Optional[UserAccountStatusEnum] = None
    search: Optional[str] = None
