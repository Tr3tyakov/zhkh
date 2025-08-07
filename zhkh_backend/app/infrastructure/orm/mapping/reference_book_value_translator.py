from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.domain.reference_book_value.aggregates.reference_book_value import (
    ReferenceBookValueAggregate,
)
from app.domain.reference_book_value.schemas.reference_book_value_setup_schema import (
    ReferenceBookValueSetupSchema,
)
from app.infrastructure.orm.models import ReferenceBookValue


class ReferenceBookValueTranslator(IPersistenceTranslator):
    orm_model = ReferenceBookValue
    aggregate = ReferenceBookValueAggregate

    @classmethod
    def to_domain(cls, model: ReferenceBookValue) -> ReferenceBookValueAggregate:
        return cls.aggregate.setup(data=ReferenceBookValueSetupSchema(**model.__dict__))

    @classmethod
    def to_orm(cls, aggregate: ReferenceBookValueAggregate) -> ReferenceBookValue:
        return cls.orm_model(**aggregate.dump())
