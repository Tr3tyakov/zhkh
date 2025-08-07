from app.application.common.interfaces.request import ICommand
from app.application.user.schemas.validation.check_user_ids import UserIdsSchema


class DeleteUserCommand(ICommand, UserIdsSchema): ...
