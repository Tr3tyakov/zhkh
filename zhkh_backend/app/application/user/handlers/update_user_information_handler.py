from operator import eq

from fastapi import (
    HTTPException,
    status,
)

from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.request import IRequestHandler
from app.application.common.interfaces.services.key_generator_service import (
    IKeyGeneratorService,
)
from app.application.user.commands.update_user_information_command import (
    UpdateUserInformationCommand,
)
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.domain.user.schemas.user_update_schema import UserUpdateSchema
from app.domain.user.value_objects.filters.user_filter import UserFilter
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class UpdateUserInformationHandler(IRequestHandler[UpdateUserInformationCommand, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
        user_repository: IUserRepository = Provide[IUserRepository],
        key_generator_service: IKeyGeneratorService = Provide[IKeyGeneratorService],
    ):
        self._ceph = ceph
        self._key_generator_service = key_generator_service

        self._user_repository = user_repository

    async def handle(
        self, command: UpdateUserInformationCommand, context: PipelineContext
    ) -> None:
        user = context.user
        if user.email.value != command.email:
            await self._check_user(command.email)

        if command.password:
            user.update_password(command.password)

        user.update_user(
            data=UserUpdateSchema(**command.model_dump(exclude={"user_id", "password"}))
        )
        await self._user_repository.update_user(user)

    async def _check_user(self, email: str) -> None:
        """Проверка доступности почты"""
        if await self._user_repository.check_existence_user(
            filters=UserFilter(email=(eq, email))
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="email",
                    error=ValidationReasonType.ENTITY_ALREADY_EXISTS,
                    text="Пользователь под данной почтой уже зарегистрирован",
                ),
            )
