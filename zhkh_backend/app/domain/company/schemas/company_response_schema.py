from typing import List

from app.application.company.schemas.base import CompanyResponseSchema
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class GetCompanyResponseSchema(BaseSchema):
    total: int
    companies: List[CompanyResponseSchema]

    class Config:
        alias_generator = to_camel
        validate_by_name = True
