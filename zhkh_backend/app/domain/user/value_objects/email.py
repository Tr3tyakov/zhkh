import re
from dataclasses import dataclass

from fastapi import (
    HTTPException,
    status,
)

from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType

EMAIL_REGEX = re.compile(r"^[^@]+@[^@]+\.[^@]+$")


@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        if not self._is_valid_email(self.value):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="email",
                    value=self.value,
                    text="Введен некорректный формат почты",
                    error=ValidationReasonType.INCORRECT_FORMAT,
                ),
            )

    @staticmethod
    def _is_valid_email(value: str) -> bool:
        return EMAIL_REGEX.match(value) is not None
