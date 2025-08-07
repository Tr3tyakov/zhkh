from fastapi import UploadFile

from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema
from app.infrastructure.common.enums.user import FileCategoryEnum


class CreateHouseFileCommand(ICommand, BaseSchema):
    house_id: int
    file: UploadFile
    category_type: FileCategoryEnum
