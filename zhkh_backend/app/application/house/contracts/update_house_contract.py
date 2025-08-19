from datetime import datetime
from typing import Optional

from pydantic import field_validator

from app.application.common.interfaces.base import IContract
from app.application.house.schemas.base import HouseBaseSchema
from app.domain.common.utils import to_camel


class UpdateHouseContract(IContract, HouseBaseSchema):
    company_id: Optional[int] = None

    class Config:
        alias_generator = to_camel
        validate_by_name = True

    @field_validator(
        "energy_survey_date", "building_wear_date", mode="before", check_fields=False
    )
    def parse_russian_date(cls, v):
        if isinstance(v, str):
            try:
                return datetime.strptime(v, "%d.%m.%Y").date()
            except ValueError:
                raise ValueError(f"Invalid date format: {v}")
        return v
