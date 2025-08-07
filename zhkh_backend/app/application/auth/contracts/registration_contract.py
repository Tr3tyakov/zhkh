from pydantic import (
    EmailStr,
    Field,
)

from app.application.common.interfaces.base import IContract
from app.application.common.schemas.user import NameSchema


class RegistrationContract(IContract, NameSchema):
    email: EmailStr
    password: str = Field(
        ..., min_length=6, max_length=24, description="Пароль пользователя"
    )
