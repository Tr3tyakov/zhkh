from app.application.common.interfaces.request import IRequestHandler
from app.application.company.queries.get_company_query import GetCompanyQuery
from app.application.company.schemas.base import CompanyResponseSchema
from app.application.house.queries.get_house_query import GetHouseQuery
from app.application.house.schemas.base import HouseResponseSchema
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetCompanyHandler(IRequestHandler[GetCompanyQuery, None]):

    async def handle(
        self, query: GetCompanyQuery, context: PipelineContext
    ) -> CompanyResponseSchema:
        return CompanyResponseSchema.model_validate(context.company)
