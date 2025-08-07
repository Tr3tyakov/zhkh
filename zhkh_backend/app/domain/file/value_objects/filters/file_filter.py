from typing import Optional

from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.persistence.common.types import (
    DatetimeField,
    IntegerField,
    StringField,
)


class FileFilter(BaseValueObjectSchema, PaginationSchema):
    id: Optional[IntegerField] = None
    file_name: Optional[StringField] = None
    file_key: Optional[StringField] = None
    extension: Optional[StringField] = None
    user_id: Optional[IntegerField] = None

    created_at: Optional[DatetimeField] = None
    updated_at: Optional[DatetimeField] = None
