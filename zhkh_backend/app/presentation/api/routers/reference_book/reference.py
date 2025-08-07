from fastapi import (
    Depends,
    Request,
)

from app.application.common.interfaces.mediator import IMediator
from app.application.reference_book.queries.get_reference_books_query import (
    GetReferenceBooksQuery,
)
from app.application.reference_book.schemas.get_reference_books_schema import (
    ReferenceBookListResponseSchema,
)
from app.application.reference_book_value.commands.create_reference_book_value_command import (
    CreateReferenceBookValueCommand,
)
from app.application.reference_book_value.contracts.create_reference_book_balue_contract import (
    CreateReferenceBookValueContract,
)
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

reference_book_router = LoggingRouter(prefix="/api", tags=["reference_book"])


@reference_book_router.get(
    "/reference_books",
    description="Получение справочников",
)
@inject_session
@secure()
async def get_reference_book_value(
    request: Request,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> ReferenceBookListResponseSchema:
    return await mediator.send(GetReferenceBooksQuery())
