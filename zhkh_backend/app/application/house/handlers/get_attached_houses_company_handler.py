from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_attached_houses_query import (
    GetAttachedHousesQuery,
)
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.domain.common.schemas.house_response_schema import GetHouseResponseSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetAttachedHousesToCompanyHandler(IRequestHandler[GetAttachedHousesQuery, None]):
    def __init__(
        self,
        house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
    ):
        self._house_query_repository = house_query_repository

    async def handle(
        self, query: GetAttachedHousesQuery, context: PipelineContext
    ) -> GetHouseResponseSchema:
        return await self._house_query_repository.get_houses(**query.model_dump())
