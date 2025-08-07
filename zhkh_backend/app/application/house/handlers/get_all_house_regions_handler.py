from typing import List

from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_all_house_regions_query import (
    GetHouseRegionsQuery,
)
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetHousesRegionsHandler(IRequestHandler[GetHouseRegionsQuery, None]):
    def __init__(
        self,
        house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
    ):
        self._house_query_repository = house_query_repository

    async def handle(
        self, query: GetHouseRegionsQuery, context: PipelineContext
    ) -> List[str]:
        return await self._house_query_repository.get_house_regions()
