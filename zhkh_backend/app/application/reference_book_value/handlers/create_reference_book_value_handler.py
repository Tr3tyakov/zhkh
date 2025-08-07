from app.application.common.interfaces.request import IRequestHandler
from app.application.reference_book_value.commands.create_reference_book_value_command import (
    CreateReferenceBookValueCommand,
)
from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.domain.reference_book_value.aggregates.reference_book_value import (
    ReferenceBookValueAggregate,
)
from app.domain.reference_book_value.schemas.reference_book_value_create_schema import (
    ReferenceBookValueCreateSchema,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class CreateReferenceBookValueHandler(
    IRequestHandler[CreateReferenceBookValueCommand, None]
):
    def __init__(
        self,
        reference_book_value_repository: IReferenceBookValueRepository = Provide[
            IReferenceBookValueRepository
        ],
    ):
        self._reference_book_value_repository = reference_book_value_repository

    async def handle(
        self, command: CreateReferenceBookValueCommand, context: PipelineContext
    ) -> None:

        reference_book_value = ReferenceBookValueAggregate.create(
            data=ReferenceBookValueCreateSchema(**command.model_dump())
        )

        await self._reference_book_value_repository.create_reference_book_value(
            reference_book_value
        )
