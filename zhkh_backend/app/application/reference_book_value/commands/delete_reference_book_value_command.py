from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class DeleteReferenceBookValueCommand(ICommand, BaseSchema):
    reference_book_value_id: int
