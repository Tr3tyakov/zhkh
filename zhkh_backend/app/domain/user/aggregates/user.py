from dataclasses import dataclass
from datetime import datetime
from typing import (
    Optional,
    Set,
)

from app.application.common.interfaces.ceph import ICeph
from app.config import settings
from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.user.schemas.user_create_schema import UserCreateSchema
from app.domain.user.schemas.user_setup_schema import UserSetupSchema
from app.domain.user.schemas.user_update_schema import UserUpdateSchema
from app.domain.user.value_objects.email import Email
from app.domain.user.value_objects.hashed_password import HashedPassword
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)


@dataclass
class UserAggregate(IAggregate):
    email: Email
    password: HashedPassword
    created_at: datetime
    last_login_date: datetime
    account_status: UserAccountStatusEnum
    user_type: UserTypeEnum
    id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    private_phone: Optional[str] = None
    work_phone: Optional[str] = None
    file_key: Optional[str] = None

    # Отсутствует в модели
    file_path: Optional[str] = None

    @classmethod
    def create_user(cls, data: UserCreateSchema) -> "UserAggregate":
        now = datetime.now()
        return cls(
            **data.model_dump(exclude={"email", "password"}),
            email=Email(data.email),
            password=HashedPassword.from_plain(data.password),
            last_login_date=now,
            created_at=now,
        )

    @classmethod
    def setup_user(cls, data: UserSetupSchema) -> "UserAggregate":
        hash, salt = data.password.split("::")

        return cls(
            **data.model_dump(exclude={"email", "password"}),
            email=Email(data.email),
            password=HashedPassword(hash, salt),
        )

    def update_password(self, password: str) -> None:
        self.password = HashedPassword.from_plain(password)

    async def generate_file_path(self, ceph: ICeph) -> None:
        """Генерация ссылки аватара"""
        if self.file_key is None:
            return

        self.file_path = await ceph.generate_presigned_url(
            bucket=settings.S3.bucket, key=self.file_key
        )

    def set_current_login_date(self) -> None:
        self.last_login_date = datetime.now()

    def update_user(self, data: UserUpdateSchema) -> None:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(self, field, value)

    def dump(self, exclude: Set[str]) -> dict:
        serializers = {
            Email: lambda v: v.value,
            HashedPassword: lambda v: v.combined,
        }

        result = {}
        for field in self.__dataclass_fields__:
            if exclude and field in exclude:
                continue

            value = getattr(self, field)
            for typ, func in serializers.items():
                if isinstance(value, typ):
                    value = func(value)
                    break

            result[field] = value

        return result
