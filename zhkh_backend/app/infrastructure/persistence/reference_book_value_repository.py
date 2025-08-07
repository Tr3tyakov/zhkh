from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.domain.reference_book_value.aggregates.reference_book_value import (
    ReferenceBookValueAggregate,
)
from app.domain.reference_book_value.value_objects.filters.reference_book_value_filter import (
    ReferenceBookValueFilter,
)
from app.infrastructure.orm.mapping.reference_book_value_translator import (
    ReferenceBookValueTranslator,
)
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class ReferenceBookValueRepository(BaseRepository, IReferenceBookValueRepository):
    translator = ReferenceBookValueTranslator

    async def create_reference_book_value(
        self, aggregate: ReferenceBookValueAggregate
    ) -> ReferenceBookValueAggregate:
        return await self.create_instance(aggregate)

    async def update_reference_book_value(
        self, aggregate: ReferenceBookValueAggregate, **kwargs
    ) -> ReferenceBookValueAggregate:
        return await self.update_instance(**aggregate.dump())

    async def get_reference_book_values(
        self,
        filters: Optional[ReferenceBookValueFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[
        Union[ReferenceBookValueAggregate, Sequence[ReferenceBookValueAggregate], Any]
    ]:
        return await self.get(filters, options)

    async def check_existence_reference_book_value(
        self,
        filters: Optional[ReferenceBookValueFilter] = None,
        options: Optional[Options] = None,
    ) -> bool:
        return await self.check_existence(filters, options)

    async def delete_reference_book_value(
        self, reference_book_value: ReferenceBookValueAggregate
    ) -> None:
        return await self.delete_instances(ids=[reference_book_value.id])
