from abc import abstractmethod
from datetime import datetime
from typing import Optional

from app.application.audit_log.queries.get_audit_log_query import GetAuditLogQuery
from app.domain.audit_log.schemas.audit_log_response_schema import (
    AuditLogPaginationResponseSchema,
)
from app.domain.common.interfaces.repositories.base import IRepository
from app.infrastructure.common.enums.log import (
    EntityTypeEnum,
    LogTypeEnum,
)


class IAuditLogQueryRepository(IRepository):

    @abstractmethod
    async def get_audit_logs(
        self, query: GetAuditLogQuery
    ) -> AuditLogPaginationResponseSchema: ...
