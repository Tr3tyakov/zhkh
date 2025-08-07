from typing import (
    Optional,
    Union,
)

from app.domain.common.schemas.base import BaseSchema
from app.infrastructure.common.exception.validation_detail import ValidationReasonType


class ExceptionDetail(BaseSchema):
    field: Optional[str] = None
    value: Optional[Union[str, int, list]] = None
    error: ValidationReasonType
    text: Optional[str] = None

    def __new__(cls, *args, **kwargs):
        instance = super().__new__(cls)
        instance.__init__(*args, **kwargs)
        return instance.model_dump(exclude_unset=True)
