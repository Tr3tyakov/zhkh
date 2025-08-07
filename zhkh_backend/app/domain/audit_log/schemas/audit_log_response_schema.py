from typing import List

from app.application.user.schemas.user_information_response_schema import (
    UserTableInformationSchema,
)
from app.domain.audit_log.schemas.base import AuditLogResponseSchema
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class AuditLogResponsePaginationSchema(AuditLogResponseSchema):
    user: UserTableInformationSchema


class AuditLogPaginationResponseSchema(BaseSchema):
    total: int
    logs: List[AuditLogResponsePaginationSchema]

    class Config:
        alias_generator = to_camel
        validate_by_name = True
