from operator import eq
from typing import Any

from fastapi import status

from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.company.commands.delete_company_command import DeleteCompanyCommand
from app.application.user.commands.change_account_status_command import (
    ChangeAccountStatusCommand,
)
from app.application.user.commands.change_user_type_command import ChangeUserTypeCommand
from app.application.user.commands.delete_user_command import DeleteUserCommand
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.domain.user.value_objects.filters.user_filter import UserFilter
from app.infrastructure.common.enums.user import UserTypeEnum
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class CheckIsAdminUserValidator(IValidator):
    SUPPORTED = (
        DeleteUserCommand,
        ChangeUserTypeCommand,
        ChangeAccountStatusCommand,
    )

    def __init__(
        self,
        user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._user_repository = user_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        user_admin = await self._user_repository.get_user(
            filters=UserFilter(id=(eq, data.current_user_id))
        )

        if user_admin is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="user_id",
                    value=data.user_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                ),
            )

        if user_admin.user_type != UserTypeEnum.ADMIN:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="user_type",
                    value=user_admin.user_type,
                    error=ValidationReasonType.ACCESS_UNAVAILABLE,
                ),
            )

        context.user_admin = user_admin
