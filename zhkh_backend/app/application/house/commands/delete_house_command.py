from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class DeleteHouseCommand(ICommand, BaseSchema):
    house_id: int
    user_id: int
