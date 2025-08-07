from datetime import datetime
from typing import Optional

from pydantic import Field

from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class AuditLogFilterSchema(BaseSchema):
    description: Optional[str] = None

    entity_type: Optional[str] = Field(None)
    start_datetime: Optional[datetime] = Field(None)
    end_datetime: Optional[datetime] = Field(None)
    find_user_id: Optional[int] = Field(None)
    log_type: Optional[str] = Field(None)
    search: Optional[str] = None

    class Config:
        alias_generator = to_camel
        validate_by_name = True
