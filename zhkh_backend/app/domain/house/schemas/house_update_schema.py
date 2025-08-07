from typing import Optional

from app.application.house.schemas.base import HouseBaseSchema


class HouseUpdateSchema(HouseBaseSchema):
    company_id: Optional[int] = None
