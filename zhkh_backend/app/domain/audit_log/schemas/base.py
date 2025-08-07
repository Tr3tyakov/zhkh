from datetime import datetime
from typing import Optional

from pydantic import Field

from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel
from app.infrastructure.common.enums.log import (
    EntityTypeEnum,
    LogTypeEnum,
)


class AuditLogBaseSchema(BaseSchema):
    log_type: LogTypeEnum = Field(
        ..., description="Тип действия (например, login, update, delete)"
    )
    entity_type: EntityTypeEnum = Field(..., description="Тип сущности системы")

    object_id: Optional[int] = Field(
        None, description="Идентификатор объекта действия (если применимо)"
    )
    description: Optional[str] = Field(None, description="Подробности действия")

    ip_address: Optional[str] = Field(
        None, description="IP-адрес, с которого выполнено действие"
    )
    user_agent: Optional[str] = Field(None, description="User-Agent клиента")

    action_result: Optional[str] = Field(
        None, description="Результат действия (успешно, ошибка и т.п.)"
    )
    log_metadata: Optional[str] = Field(
        None, description="Дополнительные данные в виде текста или JSON"
    )

    class Config:
        alias_generator = to_camel
        validate_by_name = True


class AuditLogResponseSchema(AuditLogBaseSchema):
    id: int = Field(..., description="Идентификатор записи в журнале")
    user_id: int = Field(
        ..., description="Идентификатор пользователя, выполнившего действие"
    )
    created_at: datetime = Field(..., description="Дата и время действия (в UTC)")

    class Config:
        json_encoders = {
            datetime: lambda v: v.strftime("%d.%m.%y %H:%M:%S")  # нужный формат
        }
        alias_generator = to_camel
        validate_by_name = True
