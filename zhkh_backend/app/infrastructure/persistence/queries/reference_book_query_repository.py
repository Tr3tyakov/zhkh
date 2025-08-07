from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.application.reference_book.schemas.get_reference_books_schema import (
    ReferenceBookListResponseSchema,
    ReferenceBookSchema,
)
from app.domain.common.interfaces.repositories.queries.reference_book_query_repository import (
    IReferenceBookQueryRepository,
)
from app.infrastructure.common.enums.base import ResultStrategy
from app.infrastructure.orm.models import ReferenceBook
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class ReferenceBookQueryRepository(BaseRepository, IReferenceBookQueryRepository):

    async def get_reference_books(self) -> ReferenceBookListResponseSchema:
        stmt = select(ReferenceBook).options(
            selectinload(ReferenceBook.reference_book_values)
        )

        data = await self.execute(
            stmt, options=Options(strategy=ResultStrategy.SCALARS_ALL)
        )

        return ReferenceBookListResponseSchema(
            books=[ReferenceBookSchema.model_validate(item) for item in data]
        )
