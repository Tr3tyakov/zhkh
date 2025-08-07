from pydantic import Field

from app.application.common.interfaces.request import ICommand
from app.domain.audit_log.schemas.base import AuditLogBaseSchema


class CreateAuditLogCommand(ICommand, AuditLogBaseSchema):
    user_id: int = Field(
        ..., description="Идентификатор пользователя, выполнившего действие"
    )
