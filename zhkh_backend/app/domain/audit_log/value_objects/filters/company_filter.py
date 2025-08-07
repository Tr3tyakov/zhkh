from typing import Optional

from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.persistence.common.types import (
    DatetimeField,
    IntegerField,
    StringField,
)


class AuditLogFilter(BaseValueObjectSchema, PaginationSchema):
    id: Optional[IntegerField] = None
    user_id: Optional[IntegerField] = None

    log_type: Optional[StringField] = None
    entity_type: Optional[StringField] = None

    object_id: Optional[IntegerField] = None

    ip_address: Optional[StringField] = None
    user_agent: Optional[StringField] = None

    action_result: Optional[StringField] = None
    metadata: Optional[StringField] = None
    description: Optional[StringField] = None

    created_at: Optional[DatetimeField] = None
