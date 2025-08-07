from typing import Optional

from app.application.reference_book_value.schemas.base import (
    ReferenceBookValueResponseSchema,
)


class ReferenceBookValueSetupSchema(ReferenceBookValueResponseSchema):
    reference_book_id: Optional[int] = None
