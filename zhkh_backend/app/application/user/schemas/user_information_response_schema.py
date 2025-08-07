from datetime import datetime
from typing import (
    List,
    Optional,
)

from pydantic import field_validator

from app.application.user.schemas.base import UserResponseSchema
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.domain.user.value_objects.email import Email
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)


class UserInformationResponseSchema(BaseValueObjectSchema, UserResponseSchema):
    file_path: Optional[str] = None

    @field_validator("email", mode="before")
    @classmethod
    def translate_email(cls, email: Email) -> str:
        return email.value

    class Config:
        alias_generator = to_camel
        validate_by_name = True


class UserTableInformationSchema(BaseSchema):
    id: int
    first_name: str
    email: str
    created_at: datetime
    user_type: UserTypeEnum
    account_status: UserAccountStatusEnum

    class Config:
        alias_generator = to_camel
        validate_by_name = True


class UserListResponseSchema(BaseValueObjectSchema):
    users: List[UserTableInformationSchema]
    total: int
