from typing import List

from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_all_cities_query import GetHouseCitiesQuery
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetHousesRegionsHandler(IRequestHandler[GetHouseCitiesQuery, None]):
    def __init__(
        self,
        house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
    ):
        self._house_query_repository = house_query_repository

    async def handle(
        self, query: GetHouseCitiesQuery, context: PipelineContext
    ) -> List[str]:
        return await self._house_query_repository.get_house_cities()
