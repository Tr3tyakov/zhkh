from fastapi import (
    HTTPException,
    status,
)
from pydantic import model_validator

from app.application.common.interfaces.request import ICommand
from app.application.user.schemas.validation.check_user_ids import UserIdsSchema
from app.infrastructure.common.enums.user import UserAccountStatusEnum
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType


class ChangeAccountStatusCommand(ICommand, UserIdsSchema):
    account_status: UserAccountStatusEnum

    @model_validator(mode="after")
    def check_ids_are_different(self) -> "ChangeAccountStatusCommand":
        if self.user_id == self.current_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(error=ValidationReasonType.ENTITY_IS_EQUAL),
            )
        return self
