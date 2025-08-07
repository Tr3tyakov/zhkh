from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_house_file_query import GetHouseFilesQuery
from app.application.house.schemas.get_house_files_schema import (
    GetHouseFilesResponseSchema,
)
from app.domain.common.interfaces.repositories.queries.house_query_repository import (
    IHouseQueryRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetHouseFilesHandler(IRequestHandler[GetHouseFilesQuery, None]):
    def __init__(
        self,
        house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
    ):
        self._house_query_repository = house_query_repository

    async def handle(
        self, query: GetHouseFilesQuery, context: PipelineContext
    ) -> GetHouseFilesResponseSchema:
        return await self._house_query_repository.get_house_files(
            house_id=query.house_id
        )
