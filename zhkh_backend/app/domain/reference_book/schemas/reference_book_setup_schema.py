from typing import Optional

from app.application.reference_book.schemas.base import ReferenceBookResponseSchema


class ReferenceBookSetupSchema(ReferenceBookResponseSchema):
    reference_book_id: Optional[int] = None
