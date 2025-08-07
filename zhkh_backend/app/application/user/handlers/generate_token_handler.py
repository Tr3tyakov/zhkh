from fastapi import Response

from app.application.common.interfaces.request import IRequestHandler
from app.application.common.interfaces.services.token_service import ITokenService
from app.application.user.commands.generate_token_command import GenerateTokenCommand
from app.infrastructure.containers.utils import Provide


class GenerateTokenHandler(IRequestHandler[GenerateTokenCommand, None]):
    def __init__(self, token_service: ITokenService = Provide[ITokenService]):
        self._token_service = token_service

    async def handle(self, command: GenerateTokenCommand, _) -> Response:
        return await self._token_service.generate_token(
            command.request, command.user_id, command.email
        )
