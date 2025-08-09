from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_unattached_houses_query import GetUnAttachedHousesQuery
from app.application.house.schemas.base import HouseResponseSchema
from app.domain.common.interfaces.repositories.queries.house_query_repository import IHouseQueryRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetUnAttachedHousesHandler(IRequestHandler[GetUnAttachedHousesQuery, None]):

    def __init__(
            self,
            house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
    ):
        self._house_query_repository = house_query_repository

    async def handle(
            self, query: GetUnAttachedHousesQuery, context: PipelineContext
    ) -> HouseResponseSchema:
        return await self._house_query_repository.get_unattached_houses(query)
