from pydantic import BaseModel

from app.domain.common.schemas.base import DefaultConfig

DEFAULT_DATE_FORMAT = "%d.%m.%Y"


class BaseValueObjectSchema(BaseModel):
    class Config(DefaultConfig):
        frozen = True
