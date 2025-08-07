from typing import Optional

from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.persistence.common.types import (
    BooleanField,
    DatetimeField,
    FloatField,
    IntegerField,
    StringField,
)


class CompanyFilter(BaseValueObjectSchema, PaginationSchema):
    id: Optional[IntegerField] = None
    user_id: Optional[IntegerField] = None

    name: Optional[StringField] = None
    legal_form: Optional[StringField] = None
    inn: Optional[StringField] = None
    address: Optional[StringField] = None

    phone: Optional[StringField] = None
    email: Optional[StringField] = None
    website: Optional[StringField] = None

    created_at: Optional[DatetimeField] = None
    updated_at: Optional[DatetimeField] = None
