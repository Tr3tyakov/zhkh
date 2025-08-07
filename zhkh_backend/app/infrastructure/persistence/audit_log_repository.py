from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.audit_log.aggregates.audit_log import AuditLogAggregate
from app.domain.audit_log.value_objects.filters.company_filter import AuditLogFilter
from app.domain.common.interfaces.repositories.audit_log_repository import (
    IAuditLogRepository,
)
from app.infrastructure.orm.mapping.audit_log_translator import AuditLogTranslator
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class AuditLogRepository(BaseRepository, IAuditLogRepository):
    translator = AuditLogTranslator

    async def create_log(self, aggregate: AuditLogAggregate) -> AuditLogAggregate:
        return await self.create_instance(aggregate)

    async def get_audit_logs(
        self,
        filters: Optional[AuditLogFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[AuditLogAggregate, Sequence[AuditLogAggregate], Any]]:
        return await self.get(filters, options)

    async def check_existence_audit_log(
        self,
        filters: Optional[AuditLogFilter] = None,
        options: Optional[Options] = None,
    ) -> bool:
        return await self.check_existence(filters, options)

    async def delete_audit_log(self, log: AuditLogAggregate) -> None:
        return await self.delete_instances(ids=[log.id])
