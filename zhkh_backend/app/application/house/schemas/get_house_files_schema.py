from datetime import datetime
from typing import List

from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class HouseFileSchema(BaseSchema):
    id: int
    file_name: str
    link: str
    created_at: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%y %H:%M:%S")}
        alias_generator = to_camel
        validate_by_name = True


class GetHouseFilesResponseSchema(BaseSchema):
    capital_repair_project: List[HouseFileSchema]
    design_documentation: List[HouseFileSchema]
    inspection_result: List[HouseFileSchema]
    technical_passport: List[HouseFileSchema]

    class Config:
        alias_generator = to_camel
        validate_by_name = True
