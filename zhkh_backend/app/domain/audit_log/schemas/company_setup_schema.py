from datetime import datetime

from app.domain.audit_log.schemas.base import AuditLogBaseSchema


class AuditLogSetupSchema(AuditLogBaseSchema):
    user_id: int

    created_at: datetime
