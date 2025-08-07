from typing import Optional

from pydantic import Field

from app.application.audit_log.schemas.filters import AuditLogFilterSchema
from app.application.common.interfaces.base import IContract
from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.utils import to_camel


class GetAuditLogContract(IContract, PaginationSchema, AuditLogFilterSchema):
    limit: int = Field(10, ge=1, le=100)
    offset: int = Field(0, ge=0)
    description: Optional[str] = None

    class Config:
        alias_generator = to_camel
        validate_by_name = True
