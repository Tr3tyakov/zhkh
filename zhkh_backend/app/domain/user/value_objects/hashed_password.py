from dataclasses import dataclass

import bcrypt
from fastapi import (
    HTTPException,
    status,
)

from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType


@dataclass(frozen=True)
class HashedPassword:
    """Value Object для хешированного пароля с солью"""

    hash: str
    salt: str

    @classmethod
    def from_plain(cls, plain_password: str) -> "HashedPassword":
        """Создаёт хеш из чистого пароля"""
        if len(plain_password.strip()) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="password",
                    value=plain_password,
                    text="Длина пароля меньше 8 символов",
                    error=ValidationReasonType.MIN_VALUE_EXCEEDED,
                ),
            )

        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(plain_password.encode(), salt)
        return cls(hash=hashed.decode(), salt=salt.decode())

    def verify(self, plain_password: str) -> None:
        """Проверяет пароль"""
        if not bcrypt.checkpw(plain_password.encode(), self.hash.encode()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    error=ValidationReasonType.LOGIN_OR_PASSWORD_IS_INCORRECT
                ),
            )

    @property
    def combined(self) -> str:
        """Возвращает комбинированную строку (хеш + соль) для хранения"""
        return f"{self.hash}::{self.salt}"
