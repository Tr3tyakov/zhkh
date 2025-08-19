from app.application.common.interfaces.request import ICommand
from app.application.company.schemas.base import CompanyBaseSchema


class UpdateCompanyCommand(ICommand, CompanyBaseSchema):
    company_id: int
