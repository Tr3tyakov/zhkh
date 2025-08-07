from abc import abstractmethod
from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.reference_book.aggregates.reference_book import ReferenceBookAggregate
from app.domain.reference_book.value_objects.filters.reference_book_filter import (
    ReferenceBookFilter,
)
from app.domain.reference_book_value.value_objects.filters.reference_book_value_filter import (
    ReferenceBookValueFilter,
)
from app.infrastructure.orm.mapping.reference_book_value_translator import (
    ReferenceBookValueTranslator,
)
from app.infrastructure.persistence.common.options import Options


class IReferenceBookRepository(IRepository):
    translator = ReferenceBookValueTranslator

    @abstractmethod
    async def create_reference_book(
        self, aggregate: ReferenceBookAggregate
    ) -> ReferenceBookAggregate: ...

    @abstractmethod
    async def get_reference_books(
        self,
        filters: Optional[ReferenceBookFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[
        Union[ReferenceBookAggregate, Sequence[ReferenceBookAggregate], Any]
    ]: ...

    @abstractmethod
    async def check_existence_reference_book(
        self,
        filters: Optional[ReferenceBookFilter] = None,
        options: Optional[Options] = None,
    ) -> bool: ...

    @abstractmethod
    async def delete_reference_book(
        self, reference_book_value: ReferenceBookAggregate
    ) -> None: ...
