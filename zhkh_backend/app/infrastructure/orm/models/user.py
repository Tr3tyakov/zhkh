from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    String,
)

from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)
from app.infrastructure.orm.models.base import BaseModel


class User(BaseModel):
    """Пользователь"""

    first_name = Column(String, nullable=False, comment="Имя пользователя")
    middle_name = Column(String, nullable=False, comment="Фамилия пользователя")
    last_name = Column(String, nullable=False, comment="Отчество пользователя")
    email = Column(String, nullable=False, unique=True, comment="Почта пользователя")
    password = Column(String, nullable=False, comment="Пароль пользователя")
    last_login_date = Column(DateTime, nullable=False, comment="Дата последнего входа")
    user_type = Column(Enum(UserTypeEnum), nullable=False, comment="Тип пользователя")
    created_at = Column(
        DateTime, default=datetime.now(), nullable=False, comment="Дата создания"
    )
    file_key = Column(
        String, nullable=True, comment="Ключ файла аватара пользователя в S3 хранилище"
    )
    account_status = Column(
        Enum(UserAccountStatusEnum),
        nullable=False,
        default=True,
        comment="Статус аккаунта пользователя",
    )
    private_phone = Column(String, nullable=True, comment="Личный телефон")
    work_phone = Column(String, nullable=True, comment="Рабочий телефон")
