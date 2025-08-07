from fastapi import (
    Depends,
    Request,
)

from app.application.common.interfaces.mediator import IMediator
from app.application.reference_book_value.commands.create_reference_book_value_command import (
    CreateReferenceBookValueCommand,
)
from app.application.reference_book_value.commands.delete_reference_book_value_command import (
    DeleteReferenceBookValueCommand,
)
from app.application.reference_book_value.commands.update_reference_book_value_command import (
    UpdateReferenceBookValueCommand,
)
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

reference_book_value_router = LoggingRouter(
    prefix="/api", tags=["reference_book_value"]
)


@reference_book_value_router.post(
    "/reference_books/{reference_book_id}/value/{reference_book_value}",
    description="Создание значения для справочника",
)
@inject_session
@secure()
async def create_reference_book_value(
    request: Request,
    reference_book_id: str,
    reference_book_value: str,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        CreateReferenceBookValueCommand(
            reference_book_id=reference_book_id, value=reference_book_value
        )
    )


@reference_book_value_router.put(
    "/reference_books/{reference_book_value_id}/value/{reference_book_value}",
    description="Обновление значения для справочника",
)
@inject_session
@secure()
async def update_reference_book_value(
    request: Request,
    reference_book_value_id: str,
    reference_book_value: str,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        UpdateReferenceBookValueCommand(
            reference_book_value_id=reference_book_value_id, value=reference_book_value
        )
    )


@reference_book_value_router.delete(
    "/reference_book_values/{reference_book_value_id}",
    description="Удаление значения справочника",
)
@inject_session
@secure()
async def delete_reference_book_value(
    request: Request,
    reference_book_value_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        DeleteReferenceBookValueCommand(reference_book_value_id=reference_book_value_id)
    )
