from app.domain.audit_log.schemas.base import AuditLogBaseSchema


class AuditLogCreateSchema(AuditLogBaseSchema):
    user_id: int
