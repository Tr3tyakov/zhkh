from typing import Optional

from pydantic import Field

from app.application.common.interfaces.request import ICommand
from app.domain.user.schemas.user_update_schema import UserUpdateSchema


class UpdateUserInformationCommand(ICommand, UserUpdateSchema):
    file_key: Optional[str] = Field(default=None, exclude=True)
    user_id: int
    password: Optional[str] = Field(None, description="Пароль пользователя")
