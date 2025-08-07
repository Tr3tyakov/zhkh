from abc import abstractmethod

from app.application.reference_book.schemas.get_reference_books_schema import (
    ReferenceBookListResponseSchema,
)
from app.domain.common.interfaces.repositories.base import IRepository


class IReferenceBookQueryRepository(IRepository):

    @abstractmethod
    async def get_reference_books(self) -> ReferenceBookListResponseSchema: ...
