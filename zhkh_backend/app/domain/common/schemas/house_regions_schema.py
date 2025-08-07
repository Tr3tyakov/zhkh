from typing import List

from app.application.house.schemas.base import HouseResponseSchema
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class GetHouseRegionsResponseSchema(BaseSchema):
    oblasts: List[str]  # области
    cities: List[str]  # города
    krais: List[str]  # края
    republics: List[str]  # края
    autonomous_areas: List[str]
    autonomous_okrugs: List[str]

    class Config:
        alias_generator = to_camel
        validate_by_name = True
