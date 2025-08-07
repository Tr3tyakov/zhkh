from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.domain.reference_book.aggregates.reference_book import ReferenceBookAggregate
from app.domain.reference_book.schemas.reference_book_setup_schema import (
    ReferenceBookSetupSchema,
)
from app.infrastructure.orm.models import ReferenceBook


class ReferenceBookTranslator(IPersistenceTranslator):
    orm_model = ReferenceBook
    aggregate = ReferenceBookAggregate

    @classmethod
    def to_domain(cls, model: ReferenceBook) -> ReferenceBookAggregate:
        return cls.aggregate.setup(data=ReferenceBookSetupSchema(**model.__dict__))

    @classmethod
    def to_orm(cls, aggregate: ReferenceBookAggregate) -> ReferenceBook:
        return cls.orm_model(**aggregate.dump())
