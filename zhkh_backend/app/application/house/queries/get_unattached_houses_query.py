from typing import Optional

from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import PaginationSchema


class GetUnAttachedHousesQuery(IQuery, PaginationSchema):
    search: Optional[str] = None
