from typing import Optional

from app.application.common.interfaces.request import ICommand
from app.application.company.schemas.base import CompanyBaseSchema
from app.application.house.schemas.base import HouseBaseSchema


class UpdateCompanyCommand(ICommand, CompanyBaseSchema):
    company_id: int
