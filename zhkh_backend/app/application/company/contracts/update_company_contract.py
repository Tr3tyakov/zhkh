from app.application.common.interfaces.base import IContract
from app.application.company.schemas.base import CompanyBaseSchema


class UpdateCompanyContract(IContract, CompanyBaseSchema): ...
