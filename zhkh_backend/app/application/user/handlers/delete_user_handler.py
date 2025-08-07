from app.application.common.interfaces.request import IRequestHandler
from app.application.user.commands.delete_user_command import DeleteUserCommand
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class DeleteUserHandler(IRequestHandler[DeleteUserCommand, None]):
    def __init__(
        self,
        user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def handle(self, query: DeleteUserCommand, context: PipelineContext) -> None:
        user = context.user
        await self._user_repository.delete_user(user)
