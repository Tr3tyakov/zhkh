from typing import List

from app.application.reference_book.schemas.base import ReferenceBookResponseSchema
from app.application.reference_book_value.schemas.base import (
    ReferenceBookValueResponseSchema,
)
from app.domain.common.schemas.base import BaseSchema


class ReferenceBookSchema(ReferenceBookResponseSchema):
    reference_book_values: List[ReferenceBookValueResponseSchema]


class ReferenceBookListResponseSchema(BaseSchema):
    books: List[ReferenceBookSchema]
