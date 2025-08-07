import re
from dataclasses import dataclass
from typing import Optional

from fastapi import (
    HTTPException,
    status,
)

from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType

URL_REGEX = re.compile(r"^https?://[^\s]+$")


@dataclass(frozen=True)
class Website:
    value: Optional[str] = None

    def __post_init__(self):
        if not self.value:
            return

        if not URL_REGEX.match(self.value):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="website",
                    value=self.value,
                    text="Введен некорректный формат сайта",
                    error=ValidationReasonType.INCORRECT_FORMAT,
                ),
            )
