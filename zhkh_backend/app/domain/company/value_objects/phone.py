import re
from dataclasses import dataclass
from typing import Optional

from fastapi import (
    HTTPException,
    status,
)

from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType

PHONE_REGEX = re.compile(r"^\+?\d{7,15}$")


@dataclass(frozen=True)
class Phone:
    value: Optional[str] = None

    def __post_init__(self):
        if not self.value:
            return

        if not PHONE_REGEX.match(self.value):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="phone",
                    value=self.value,
                    text="Введен некорректный формат телефона",
                    error=ValidationReasonType.INCORRECT_FORMAT,
                ),
            )
