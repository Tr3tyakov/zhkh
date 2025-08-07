from typing import Optional

from pydantic import Field

from app.application.user.schemas.base import UserBaseSchema
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)


class UserUpdateSchema(UserBaseSchema):
    file_key: Optional[str] = Field(default=None, exclude=True)
    user_type: Optional[UserTypeEnum] = Field(default=None)
    account_status: Optional[UserAccountStatusEnum] = Field(default=None)
    password: Optional[str] = None
