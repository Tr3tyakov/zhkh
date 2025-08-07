from typing import Tuple

from app.application.auth.commands.authorization_command import AuthorizationCommand
from app.application.common.interfaces.request import IRequestHandler
from app.application.common.interfaces.services.token_service import ITokenService
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class AuthorizationHandler(IRequestHandler[AuthorizationCommand, None]):
    def __init__(
        self,
        token_service: ITokenService = Provide[ITokenService],
        user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._token_service = token_service
        self._user_repository = user_repository

    async def handle(
        self, command: AuthorizationCommand, context: PipelineContext
    ) -> Tuple[int, str]:
        user = context.user
        user.password.verify(command.password)

        return user.id, user.email.value
