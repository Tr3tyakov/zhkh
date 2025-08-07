from abc import abstractmethod
from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.audit_log.aggregates.audit_log import AuditLogAggregate
from app.domain.audit_log.value_objects.filters.company_filter import AuditLogFilter
from app.domain.common.interfaces.repositories.base import IRepository
from app.infrastructure.persistence.common.options import Options


class IAuditLogRepository(IRepository):

    @abstractmethod
    async def create_log(self, aggregate: AuditLogAggregate) -> AuditLogAggregate: ...

    @abstractmethod
    async def get_audit_logs(
        self,
        filters: Optional[AuditLogFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[AuditLogAggregate, Sequence[AuditLogAggregate], Any]]: ...

    @abstractmethod
    async def check_existence_audit_log(
        self,
        filters: Optional[AuditLogFilter] = None,
        options: Optional[Options] = None,
    ) -> bool: ...

    @abstractmethod
    async def delete_audit_log(self, log: AuditLogAggregate) -> None: ...
