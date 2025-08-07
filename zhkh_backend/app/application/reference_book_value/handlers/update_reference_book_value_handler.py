from app.application.common.interfaces.request import IRequestHandler
from app.application.reference_book_value.commands.update_reference_book_value_command import (
    UpdateReferenceBookValueCommand,
)
from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class UpdateReferenceBookValueHandler(
    IRequestHandler[UpdateReferenceBookValueCommand, None]
):
    def __init__(
        self,
        reference_book_value_repository: IReferenceBookValueRepository = Provide[
            IReferenceBookValueRepository
        ],
    ):
        self._reference_book_value_repository = reference_book_value_repository

    async def handle(
        self, command: UpdateReferenceBookValueCommand, context: PipelineContext
    ) -> None:
        reference_book_value = context.reference_book_value
        reference_book_value.value = command.value

        await self._reference_book_value_repository.update_reference_book_value(
            reference_book_value
        )
