from fastapi import (
    Depends,
    Request,
    status,
)
from starlette.responses import JSONResponse

from app.application.auth.commands.registration_command import RegistrationCommand
from app.application.auth.contracts.registration_contract import RegistrationContract
from app.application.common.interfaces.mediator import IMediator
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

registration_router = LoggingRouter(prefix="/api", tags=["registration"])


@registration_router.post("/registration", description="Регистрация пользователя")
@inject_session
async def registration(
    request: Request,
    data: RegistrationContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> JSONResponse:
    await mediator.send(RegistrationCommand(**data.model_dump()))

    return JSONResponse(
        status_code=status.HTTP_200_OK, content="Пользователь успешно зарегистрирован"
    )
