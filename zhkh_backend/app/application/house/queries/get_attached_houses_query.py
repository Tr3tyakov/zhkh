from typing import Optional

from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import PaginationSchema


class GetAttachedHousesQuery(IQuery, PaginationSchema):
    company_id: int
    limit: int
    offset: int
