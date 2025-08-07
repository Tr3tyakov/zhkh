from typing import Optional

from app.application.common.interfaces.request import ICommand
from app.application.house.schemas.base import HouseBaseSchema


class UpdateHouseCommand(ICommand, HouseBaseSchema):
    house_id: int
    user_id: int
    company_id: Optional[int] = None
