import operator
from typing import (
    Optional,
    Sequence,
    Tuple,
    Union,
)

from app.domain.common.schemas.base import PaginationSchema
from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)
from app.infrastructure.persistence.common.types import (
    DatetimeField,
    IntegerField,
    StringField,
)


class UserFilter(BaseValueObjectSchema, PaginationSchema):
    id: Optional[IntegerField] = None
    user_type: Optional[
        Tuple[operator, Union[UserTypeEnum, Sequence[UserTypeEnum]]]
    ] = None
    account_status: Optional[
        Tuple[operator, Union[UserAccountStatusEnum, Sequence[UserAccountStatusEnum]]]
    ] = None
    first_name: Optional[StringField] = None
    middle_name: Optional[StringField] = None
    last_name: Optional[StringField] = None
    email: Optional[StringField] = None
    password: Optional[StringField] = None
    work_place: Optional[StringField] = None
    created_at: Optional[DatetimeField] = None
    file_key: Optional[StringField] = None
    last_login_date: Optional[DatetimeField] = None
    private_phone: Optional[StringField] = None
    work_phone: Optional[StringField] = None
