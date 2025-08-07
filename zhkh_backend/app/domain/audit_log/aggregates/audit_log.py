from dataclasses import dataclass
from datetime import datetime
from typing import (
    Optional,
    Set,
)

from app.domain.audit_log.schemas.audit_log_create_schema import AuditLogCreateSchema
from app.domain.audit_log.schemas.company_setup_schema import AuditLogSetupSchema
from app.domain.common.interfaces.aggregates import IAggregate
from app.infrastructure.common.enums.log import (
    EntityTypeEnum,
    LogTypeEnum,
)


@dataclass
class AuditLogAggregate(IAggregate):
    user_id: int
    log_type: LogTypeEnum
    entity_type: EntityTypeEnum

    id: Optional[int] = None
    object_id: Optional[int] = None
    description: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    action_result: Optional[str] = None
    created_at: Optional[datetime] = None
    log_metadata: Optional[str] = None

    @classmethod
    def create_log(cls, data: AuditLogCreateSchema) -> "AuditLogAggregate":
        return cls(**data.model_dump())

    @classmethod
    def setup_log(cls, data: AuditLogSetupSchema) -> "AuditLogAggregate":
        return cls(**data.model_dump())

    def dump(self, exclude: Optional[Set[str]] = None) -> dict:
        result = {}
        for field in self.__dataclass_fields__:
            if exclude and field in exclude:
                continue
            result[field] = getattr(self, field)
        return result
