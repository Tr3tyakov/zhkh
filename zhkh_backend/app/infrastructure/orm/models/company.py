from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)

from app.infrastructure.orm.models.base import BaseModel


class Company(BaseModel):
    """Компания"""

    # Реквизиты организации
    name = Column(String(255), nullable=False, comment="Название УК")
    legal_form = Column(
        String(100), nullable=True, comment="Форма организации (ООО, АО)"
    )
    inn = Column(String(12), nullable=True, unique=True, comment="ИНН")
    address = Column(Text, nullable=True, comment="# Юридический адрес")

    # Контактные данные
    phone = Column(String(50), nullable=True, comment="Телефон")
    email = Column(String(255), nullable=True, comment="Почта")
    website = Column(String(255), nullable=True, comment="Сайт")

    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)

    created_at = Column(
        DateTime, nullable=False, default=datetime.now(), comment="Дата создания"
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.now(),
        onupdate=datetime.now(),
        comment="Дата обновления",
    )
