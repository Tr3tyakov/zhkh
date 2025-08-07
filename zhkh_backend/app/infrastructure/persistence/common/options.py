from typing import (
    Any,
    Optional,
    Tuple,
)

from app.domain.common.value_objects.base import BaseValueObjectSchema
from app.infrastructure.common.enums.base import (
    ResultStrategy,
    SortDirectionEnum,
)
from app.infrastructure.persistence.common.types import OptionsType


class Options(BaseValueObjectSchema):
    load_options: Optional[OptionsType] = None
    current_attributes: Optional[Tuple[str, ...]] = None
    strategy: Optional[ResultStrategy] = None
    order_by: Optional[Tuple[Any, SortDirectionEnum]] = None


class BaseFilter(BaseValueObjectSchema):
    limit: Optional[int] = None
    offset: Optional[int] = None
