from app.application.audit_log.schemas.filters import AuditLogFilterSchema
from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import PaginationSchema


class GetAuditLogQuery(IQuery, PaginationSchema, AuditLogFilterSchema): ...
