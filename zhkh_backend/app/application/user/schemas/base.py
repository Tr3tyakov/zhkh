from datetime import datetime
from typing import Optional

from app.application.common.schemas.user import NameSchema
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)


class UserBaseSchema(NameSchema):
    email: str
    user_type: UserTypeEnum
    account_status: UserAccountStatusEnum
    private_phone: Optional[str] = None
    work_phone: Optional[str] = None
    file_key: Optional[str] = None


class UserResponseSchema(UserBaseSchema):
    id: int
    last_login_date: datetime
    created_at: datetime
