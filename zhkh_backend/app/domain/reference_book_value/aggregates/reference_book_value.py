from dataclasses import dataclass
from typing import (
    Optional,
    Set,
)

from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.reference_book.schemas.reference_book_update_schema import (
    ReferenceBookUpdateSchema,
)
from app.domain.reference_book_value.schemas.reference_book_value_create_schema import (
    ReferenceBookValueCreateSchema,
)
from app.domain.reference_book_value.schemas.reference_book_value_setup_schema import (
    ReferenceBookValueSetupSchema,
)


@dataclass
class ReferenceBookValueAggregate(IAggregate):
    value: str
    id: Optional[int] = None
    reference_book_id: Optional[int] = None

    @classmethod
    def create(
        cls, data: ReferenceBookValueCreateSchema
    ) -> "ReferenceBookValueAggregate":
        return cls(**data.model_dump())

    @classmethod
    def setup(
        cls, data: ReferenceBookValueSetupSchema
    ) -> "ReferenceBookValueAggregate":
        return cls(**data.model_dump())

    def update(self, data: ReferenceBookUpdateSchema) -> None:
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(self, field, value)

    def dump(self, exclude: Optional[Set[str]] = None) -> dict:
        result = {}
        for field in self.__dataclass_fields__:
            if exclude and field in exclude:
                continue
            result[field] = getattr(self, field)
        return result
