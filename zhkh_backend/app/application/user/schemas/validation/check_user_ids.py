from fastapi import (
    HTTPException,
    status,
)
from pydantic import (
    Field,
    model_validator,
)

from app.domain.common.schemas.base import BaseSchema
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType


class UserIdsSchema(BaseSchema):
    user_id: int = Field(..., description="Идентификатор удаляемого пользователя")
    current_user_id: int = Field(
        ..., description="Идентификатор пользователя, удаляющий другой аккаунт"
    )

    @model_validator(mode="after")
    def check_ids_are_different(self) -> "UserIdsSchema":
        if self.user_id == self.current_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(error=ValidationReasonType.ENTITY_IS_EQUAL),
            )
        return self
