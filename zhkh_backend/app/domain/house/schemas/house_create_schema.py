from typing import Optional

from app.application.house.schemas.base import HouseBaseSchema


class HouseCreateSchema(HouseBaseSchema):
    user_id: int
    company_id: Optional[int] = None
