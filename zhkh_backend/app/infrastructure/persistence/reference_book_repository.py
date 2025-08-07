from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.reference_book_repository import (
    IReferenceBookRepository,
)
from app.domain.reference_book.aggregates.reference_book import ReferenceBookAggregate
from app.domain.reference_book.value_objects.filters.reference_book_filter import (
    ReferenceBookFilter,
)
from app.domain.reference_book_value.value_objects.filters.reference_book_value_filter import (
    ReferenceBookValueFilter,
)
from app.infrastructure.orm.mapping.reference_book_translator import (
    ReferenceBookTranslator,
)
from app.infrastructure.orm.mapping.reference_book_value_translator import (
    ReferenceBookValueTranslator,
)
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class ReferenceBookRepository(BaseRepository, IReferenceBookRepository):
    translator = ReferenceBookTranslator

    async def create_reference_book(
        self, aggregate: ReferenceBookAggregate
    ) -> ReferenceBookAggregate:
        return await self.create_instance(aggregate)

    async def get_reference_books(
        self,
        filters: Optional[ReferenceBookValueFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[ReferenceBookAggregate, Sequence[ReferenceBookAggregate], Any]]:
        return await self.get(filters, options)

    async def check_existence_reference_book(
        self,
        filters: Optional[ReferenceBookFilter] = None,
        options: Optional[Options] = None,
    ) -> bool:
        return await self.check_existence(filters, options)

    async def delete_reference_book(
        self, reference_book_value: ReferenceBookAggregate
    ) -> None:
        return await self.delete_instances(ids=[reference_book_value.id])
