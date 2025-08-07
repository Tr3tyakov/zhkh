from app.application.common.interfaces.request import IRequestHandler
from app.application.house.queries.get_house_query import GetHouseQuery
from app.application.house.schemas.base import HouseResponseSchema
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetHouseHandler(IRequestHandler[GetHouseQuery, None]):

    async def handle(
        self, query: GetHouseQuery, context: PipelineContext
    ) -> HouseResponseSchema:
        return HouseResponseSchema.model_validate(context.house)
