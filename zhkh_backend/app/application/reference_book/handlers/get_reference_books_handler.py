from app.application.common.interfaces.request import IRequestHandler
from app.application.company.commands.create_company_command import CreateCompanyCommand
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.application.reference_book.queries.get_reference_books_query import (
    GetReferenceBooksQuery,
)
from app.application.reference_book.schemas.get_reference_books_schema import (
    ReferenceBookListResponseSchema,
)
from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.common.interfaces.repositories.queries.reference_book_query_repository import (
    IReferenceBookQueryRepository,
)
from app.domain.company.aggregates.company import CompanyAggregate
from app.domain.company.schemas.company_create_schema import CompanyCreateSchema
from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.schemas.house_create_schema import HouseCreateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetReferenceBooksHandler(IRequestHandler[GetReferenceBooksQuery, None]):
    def __init__(
        self,
        reference_book_query_repository: IReferenceBookQueryRepository = Provide[
            IReferenceBookQueryRepository
        ],
    ):
        self._reference_book_query_repository = reference_book_query_repository

    async def handle(
        self, query: GetReferenceBooksQuery, _
    ) -> ReferenceBookListResponseSchema:
        return await self._reference_book_query_repository.get_reference_books()
