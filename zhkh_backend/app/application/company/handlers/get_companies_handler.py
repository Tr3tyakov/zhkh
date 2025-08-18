from app.application.common.interfaces.request import IRequestHandler
from app.application.company.queries.get_companies_query import GetCompaniesQuery
from app.domain.common.interfaces.repositories.queries.company_query_repository import (
    ICompanyQueryRepository,
)
from app.domain.company.schemas.company_response_schema import GetCompanyResponseSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetCompaniesHandler(IRequestHandler[GetCompaniesQuery, None]):
    def __init__(
        self,
        company_query_repository: ICompanyQueryRepository = Provide[
            ICompanyQueryRepository
        ],
    ):
        self._company_query_repository = company_query_repository

    async def handle(
        self, query: GetCompaniesQuery, context: PipelineContext
    ) -> GetCompanyResponseSchema:
        return await self._company_query_repository.get_companies(
            **query.model_dump(exclude={"user_id"})
        )
