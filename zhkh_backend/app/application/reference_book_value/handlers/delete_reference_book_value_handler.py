from fastapi import HTTPException, status

from app.application.common.interfaces.request import IRequestHandler
from app.application.reference_book_value.commands.delete_reference_book_value_command import (
    DeleteReferenceBookValueCommand,
)
from app.domain.common.interfaces.repositories.queries.house_query_repository import IHouseQueryRepository
from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class DeleteReferenceBookValueHandler(
    IRequestHandler[DeleteReferenceBookValueCommand, None]
):
    def __init__(
            self,
            house_query_repository: IHouseQueryRepository = Provide[IHouseQueryRepository],
            reference_book_value_repository: IReferenceBookValueRepository = Provide[
                IReferenceBookValueRepository
            ],
    ):
        self._house_query_repository = house_query_repository
        self._reference_book_value_repository = reference_book_value_repository

    async def handle(
            self, command: DeleteReferenceBookValueCommand, context: PipelineContext
    ) -> None:
        reference_book_value = context.reference_book_value
        if await self._house_query_repository.is_reference_value_used(reference_value_id=reference_book_value.id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="id",
                    value=reference_book_value.id,
                    text="Справочник уже используется в жилом фонде",
                    error=ValidationReasonType.DELETE_NOT_ALLOWED,
                ),
            )

        await self._reference_book_value_repository.delete_reference_book_value(
            reference_book_value
        )
