from sqlalchemy import (
    TIMESTAMP,
    Column,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.infrastructure.common.enums.log import (
    EntityTypeEnum,
    LogTypeEnum,
)
from app.infrastructure.orm.models.base import BaseModel


class AuditLog(BaseModel):
    """Лог"""

    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=True)

    log_type = Column(
        Enum(LogTypeEnum),
        nullable=False,
        comment="Тип лога",
    )
    entity_type = Column(
        Enum(EntityTypeEnum),
        nullable=False,
        comment="Тип сущности",
    )
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    object_id = Column(Integer, nullable=True, comment="Идентификатор объекта действия")
    description = Column(Text, nullable=True, comment="Детали действия")
    ip_address = Column(String(45), nullable=True, comment="IP-адрес пользователя")
    user_agent = Column(Text, nullable=True, comment="User-Agent пользователя")

    action_result = Column(
        String,
        nullable=True,
        comment="Результат действия (например, 'успешно', 'ошибка')",
    )
    log_metadata = Column(
        Text,
        nullable=True,
        comment="Дополнительные метаданные в JSON или текстовом формате",
    )

    user = relationship("User", uselist=False)
