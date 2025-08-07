from typing import List

from app.application.house.schemas.base import HouseResponseSchema
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class GetHouseResponseSchema(BaseSchema):
    total: int
    houses: List[HouseResponseSchema]

    class Config:
        alias_generator = to_camel
        validate_by_name = True
