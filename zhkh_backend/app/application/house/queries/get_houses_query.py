from app.application.common.interfaces.request import IQuery
from app.application.house.contracts.get_houses_contract import HouseQueryParams


class GetHousesQuery(IQuery, HouseQueryParams):
    user_id: int
