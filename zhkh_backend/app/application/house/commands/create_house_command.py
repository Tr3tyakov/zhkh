from typing import Optional

from app.application.common.interfaces.request import ICommand
from app.application.house.schemas.base import HouseBaseSchema


class CreateHouseCommand(ICommand, HouseBaseSchema):
    company_id: Optional[int] = None
    user_id: Optional[int] = None
