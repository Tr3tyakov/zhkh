from typing import List

from pydantic import Field

from app.application.house.schemas.house_fields_schema import HouseFieldSchema
from app.domain.common.schemas.base import BaseSchema


class GenerateHouseFieldsSchema(BaseSchema):
    fields: List[HouseFieldSchema] = Field(
        ..., description="Поля, которые должны войти в файл"
    )
