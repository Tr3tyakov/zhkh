from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class UpdateReferenceBookValueCommand(ICommand, BaseSchema):
    reference_book_value_id: int
    value: str
