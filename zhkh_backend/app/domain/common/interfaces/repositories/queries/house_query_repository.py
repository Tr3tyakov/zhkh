from abc import abstractmethod
from typing import (
    List,
    Optional,
)

from app.application.house.queries.get_houses_query import GetHousesQuery
from app.application.house.schemas.get_house_files_schema import (
    GetHouseFilesResponseSchema,
)
from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.common.schemas.house_response_schema import GetHouseResponseSchema


class IHouseQueryRepository(IRepository):

    @abstractmethod
    async def get_houses(self, query: GetHousesQuery) -> GetHouseResponseSchema: ...

    @abstractmethod
    async def get_house_files(self, house_id: int) -> GetHouseFilesResponseSchema: ...

    @abstractmethod
    async def get_house_regions(self) -> List[str]: ...

    @abstractmethod
    async def get_house_cities(self) -> List[str]: ...
