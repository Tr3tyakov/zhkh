from fastapi import UploadFile

from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class ChangeUserAvatarCommand(ICommand, BaseSchema):
    file: UploadFile
    user_id: int
