from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_houses_query import GetHousesQuery
from app.application.house.schemas.base import HouseResponseSchema
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.domain.common.schemas.house_response_schema import GetHouseResponseSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetHousesHandler(IRequestHandler[GetHousesQuery, None]):
    def __init__(
        self,
        house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
    ):
        self._house_query_repository = house_query_repository

    async def handle(
        self, query: GetHousesQuery, context: PipelineContext
    ) -> GetHouseResponseSchema:
        return await self._house_query_repository.get_houses(query)
