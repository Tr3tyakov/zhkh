from typing import Optional

from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.persistence.common.types import (
    IntegerField,
    StringField,
)


class ReferenceBookValueFilter(BaseValueObjectSchema, PaginationSchema):
    id: Optional[IntegerField] = None
    value: Optional[StringField] = None
