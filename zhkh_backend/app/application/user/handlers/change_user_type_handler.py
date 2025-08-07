from app.application.common.interfaces.request import IRequestHandler
from app.application.user.commands.change_user_type_command import ChangeUserTypeCommand
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ChangeUserTypeHandler(IRequestHandler[ChangeUserTypeCommand, None]):
    def __init__(
        self,
        user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def handle(
        self, command: ChangeUserTypeCommand, context: PipelineContext
    ) -> None:
        user = context.user
        user.user_type = command.user_type
        await self._user_repository.update_user(user)
