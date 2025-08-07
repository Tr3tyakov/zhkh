from app.application.auth.commands.registration_command import RegistrationCommand
from app.application.common.interfaces.request import IRequestHandler
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.domain.user.aggregates.user import UserAggregate
from app.domain.user.schemas.user_create_schema import UserCreateSchema
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)
from app.infrastructure.containers.utils import Provide


class RegistrationHandler(IRequestHandler[RegistrationCommand, None]):
    def __init__(self, user_repository: IUserRepository = Provide[IUserRepository]):
        self._user_repository = user_repository

    async def handle(self, command: RegistrationCommand, _) -> None:
        account = UserAggregate.create_user(
            data=UserCreateSchema(
                **command.model_dump(),
                user_type=UserTypeEnum.USER,
                account_status=UserAccountStatusEnum.ACTIVE,
            )
        )
        await self._user_repository.create_user(account)
