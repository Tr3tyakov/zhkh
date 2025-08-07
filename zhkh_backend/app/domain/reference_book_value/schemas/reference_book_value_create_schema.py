from app.application.reference_book.schemas.base import ReferenceBookBaseSchema
from app.application.reference_book_value.schemas.base import (
    ReferenceBookValueBaseSchema,
)


class ReferenceBookValueCreateSchema(ReferenceBookValueBaseSchema):
    reference_book_id: int
