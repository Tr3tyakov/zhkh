from app.application.common.interfaces.request import IRequestHandler
from app.application.user.commands.change_account_status_command import (
    ChangeAccountStatusCommand,
)
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ChangeAccountStatusHandler(IRequestHandler[ChangeAccountStatusCommand, None]):
    def __init__(
        self,
        user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def handle(
        self, command: ChangeAccountStatusCommand, context: PipelineContext
    ) -> None:
        user = context.user
        user.account_status = command.account_status
        await self._user_repository.update_user(user)
