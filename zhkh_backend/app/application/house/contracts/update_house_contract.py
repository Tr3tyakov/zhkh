from datetime import (
    date,
    datetime,
)
from typing import Optional

from pydantic import Field

from app.application.common.interfaces.base import IContract
from app.application.house.schemas.base import HouseBaseSchema
from app.domain.common.utils import to_camel


class UpdateHouseContract(IContract, HouseBaseSchema):

    class Config:
        alias_generator = to_camel
        validate_by_name = True
