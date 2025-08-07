from datetime import date
from typing import Optional

from pydantic import Field

from app.application.common.interfaces.base import IContract
from app.application.company.schemas.base import CompanyBaseSchema
from app.application.house.schemas.base import HouseBaseSchema
from app.domain.common.utils import to_camel


class CreateCompanyContract(IContract, CompanyBaseSchema):
    class Config:
        alias_generator = to_camel
        validate_by_name = True
