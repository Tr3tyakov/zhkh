from abc import abstractmethod
from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.reference_book_value.aggregates.reference_book_value import (
    ReferenceBookValueAggregate,
)
from app.domain.reference_book_value.value_objects.filters.reference_book_value_filter import (
    ReferenceBookValueFilter,
)
from app.infrastructure.persistence.common.options import Options


class IReferenceBookValueRepository(IRepository):

    @abstractmethod
    async def create_reference_book_value(
        self, aggregate: ReferenceBookValueAggregate
    ) -> ReferenceBookValueAggregate: ...

    @abstractmethod
    async def update_reference_book_value(
        self, aggregate: ReferenceBookValueAggregate
    ) -> ReferenceBookValueAggregate: ...
    @abstractmethod
    async def get_reference_book_values(
        self,
        filters: Optional[ReferenceBookValueFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[
        Union[ReferenceBookValueAggregate, Sequence[ReferenceBookValueAggregate], Any]
    ]: ...

    @abstractmethod
    async def check_existence_reference_book_value(
        self,
        filters: Optional[ReferenceBookValueFilter] = None,
        options: Optional[Options] = None,
    ) -> bool: ...

    @abstractmethod
    async def delete_reference_book_value(
        self, reference_book_value: ReferenceBookValueAggregate
    ) -> None: ...
