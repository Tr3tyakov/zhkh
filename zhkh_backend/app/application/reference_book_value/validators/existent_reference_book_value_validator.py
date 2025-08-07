from operator import eq
from typing import Any

from fastapi import status

from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.reference_book_value.commands.create_reference_book_value_command import (
    CreateReferenceBookValueCommand,
)
from app.application.reference_book_value.commands.delete_reference_book_value_command import (
    DeleteReferenceBookValueCommand,
)
from app.application.reference_book_value.commands.update_reference_book_value_command import (
    UpdateReferenceBookValueCommand,
)
from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.domain.reference_book_value.value_objects.filters.reference_book_value_filter import (
    ReferenceBookValueFilter,
)
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ExistentReferenceBookValueByIdIdValidator(IValidator):
    SUPPORTED = (DeleteReferenceBookValueCommand, UpdateReferenceBookValueCommand)

    def __init__(
        self,
        reference_book_value_repository: IReferenceBookValueRepository = Provide[
            IReferenceBookValueRepository
        ],
    ):
        self._reference_book_value_repository = reference_book_value_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        reference_book_value = (
            await self._reference_book_value_repository.get_reference_book_values(
                filters=ReferenceBookValueFilter(id=(eq, data.reference_book_value_id))
            )
        )

        if reference_book_value is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="reference_book_value_id",
                    value=data.reference_book_value_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                ),
            )

        context.reference_book_value = reference_book_value
