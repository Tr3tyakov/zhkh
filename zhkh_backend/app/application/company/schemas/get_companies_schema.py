from typing import List

from app.application.company.schemas.base import CompanyResponseSchema
from app.domain.common.schemas.base import BaseSchema


class GetCompaniesSchema(BaseSchema):
    companies: List[CompanyResponseSchema]
    total: int
