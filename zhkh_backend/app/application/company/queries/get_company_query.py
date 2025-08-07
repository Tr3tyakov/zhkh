from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import BaseSchema


class GetCompanyQuery(IQuery, BaseSchema):
    company_id: int
