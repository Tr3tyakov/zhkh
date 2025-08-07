from app.application.common.interfaces.request import ICommand
from app.application.reference_book.schemas.base import ReferenceBookBaseSchema
from app.domain.common.schemas.base import BaseSchema


class CreateReferenceBookValueCommand(ICommand, BaseSchema):
    reference_book_id: int
    value: str
