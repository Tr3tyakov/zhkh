from operator import eq
from typing import Any

from fastapi import status

from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.reference_book_value.commands.create_reference_book_value_command import (
    CreateReferenceBookValueCommand,
)
from app.domain.common.interfaces.repositories.reference_book_repository import (
    IReferenceBookRepository,
)
from app.domain.reference_book.value_objects.filters.reference_book_filter import (
    ReferenceBookFilter,
)
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ExistentReferenceBookByIdValidator(IValidator):
    SUPPORTED = (CreateReferenceBookValueCommand,)

    def __init__(
        self,
        reference_book_repository: IReferenceBookRepository = Provide[
            IReferenceBookRepository
        ],
    ):
        self._reference_book_repository = reference_book_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        reference_book = await self._reference_book_repository.get_reference_books(
            filters=ReferenceBookFilter(id=(eq, data.reference_book_id))
        )

        if reference_book is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="id",
                    value=data.reference_book_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                ),
            )

        context.reference_book = reference_book
