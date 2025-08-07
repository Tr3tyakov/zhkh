from typing import Optional

from app.application.common.interfaces.request import IQuery
from app.application.house.contracts.get_houses_contract import HouseQueryParams
from app.domain.common.schemas.base import PaginationSchema


class GetHousesQuery(IQuery, HouseQueryParams): ...
