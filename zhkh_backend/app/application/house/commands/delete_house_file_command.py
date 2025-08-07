from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class DeleteHouseFileCommand(ICommand, BaseSchema):
    file_id: int
