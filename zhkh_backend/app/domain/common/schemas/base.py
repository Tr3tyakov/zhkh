from datetime import datetime
from typing import Optional

from pydantic import (
    BaseModel,
    Field,
)

DEFAULT_DATE_FORMAT = "%d.%m.%Y"


class DefaultConfig:
    json_encoders = {datetime: lambda v: v.isoformat()}
    arbitrary_types_allowed = True
    from_attributes = True


class BaseSchema(BaseModel):
    class Config(DefaultConfig): ...


class PaginationSchema(BaseSchema):
    offset: Optional[int] = Field(default=None, description="Отступ")
    limit: Optional[int] = Field(
        default=None, description="Максимальное количество элементов"
    )
