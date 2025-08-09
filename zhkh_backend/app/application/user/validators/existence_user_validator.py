from operator import eq
from typing import Any

from fastapi import status

from app.application.auth.commands.authorization_command import AuthorizationCommand
from app.application.auth.commands.registration_command import RegistrationCommand
from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.company.commands.create_company_command import CreateCompanyCommand
from app.application.company.queries.get_companies_query import GetCompaniesQuery
from app.application.house.queries.get_houses_query import GetHousesQuery
from app.application.reference_book.queries.get_reference_books_query import GetReferenceBooksQuery
from app.application.user.commands.change_account_status_command import (
    ChangeAccountStatusCommand,
)
from app.application.user.commands.change_user_avatar_command import (
    ChangeUserAvatarCommand,
)
from app.application.user.commands.change_user_type_command import ChangeUserTypeCommand
from app.application.user.commands.delete_user_command import DeleteUserCommand
from app.application.user.commands.update_user_information_command import (
    UpdateUserInformationCommand,
)
from app.application.user.queries.get_current_user_query import GetCurrentUserQuery
from app.application.user.queries.get_user_query import GetUserQuery
from app.application.user.queries.get_users_query import GetUsersQuery
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.domain.user.value_objects.filters.user_filter import UserFilter
from app.infrastructure.common.enums.user import UserAccountStatusEnum
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ExistentUserByEmailValidator(IValidator):
    SUPPORTED = (AuthorizationCommand,)

    def __init__(
            self,
            user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        user = await self._user_repository.get_user(
            filters=UserFilter(email=(eq, data.email))
        )

        if user is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="email",
                    value=data.email,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                    text="Неверный логин или пароль",
                ),
            )

        context.user = user


class NonExistentUserByEmailValidator(IValidator):
    SUPPORTED = (RegistrationCommand,)

    def __init__(
            self,
            user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        user = await self._user_repository.check_existence_user(
            filters=UserFilter(email=(eq, data.email))
        )

        if user:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="email",
                    value=data.email,
                    error=ValidationReasonType.ENTITY_ALREADY_EXISTS,
                    text="Данная почта уже зарегистрирована в системе",
                ),
            )


class ExistentUserByIdValidator(IValidator):
    SUPPORTED = (
        GetUserQuery,
        UpdateUserInformationCommand,
        ChangeUserAvatarCommand,
        DeleteUserCommand,
        ChangeUserTypeCommand,
        ChangeAccountStatusCommand,
        CreateCompanyCommand,
        GetCurrentUserQuery,
    )

    def __init__(
            self,
            user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        user = await self._user_repository.get_user(
            filters=UserFilter(id=(eq, data.user_id))
        )

        if user is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="user_id",
                    value=data.user_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                ),
            )

        context.user = user


class ExistentUserNotBannedByIdValidator(IValidator):
    SUPPORTED = (
        GetUserQuery,
        GetReferenceBooksQuery,
        GetUsersQuery,
        GetCompaniesQuery,
        GetHousesQuery
    )

    def __init__(
            self,
            user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        user = context.user
        if not user:
            user = await self._user_repository.get_user(
                filters=UserFilter(id=(eq, data.user_id))
            )

        if user.account_status == UserAccountStatusEnum.BLOCKED:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    value="Аккаунт заблокирован, обратиться к администратору",
                    error=ValidationReasonType.ACCESS_UNAVAILABLE,
                ),
            )

        context.user = user
