from fastapi import (
    Depends,
    Request,
    Response,
)

from app.application.auth.commands.authorization_command import AuthorizationCommand
from app.application.auth.contracts.authorization_contract import AuthorizationContract
from app.application.common.interfaces.mediator import IMediator
from app.application.user.commands.generate_token_command import GenerateTokenCommand
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

authorization_router = LoggingRouter(prefix="/api", tags=["authorization"])


@authorization_router.post("/authorization", description="Авторизация пользователя")
@inject_session
async def authorization(
    request: Request,
    data: AuthorizationContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> Response:
    user_id, user_email = await mediator.send(AuthorizationCommand(**data.model_dump()))

    return await mediator.send(
        GenerateTokenCommand(request=request, user_id=user_id, email=user_email)
    )
