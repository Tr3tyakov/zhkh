from dataclasses import dataclass
from datetime import datetime
from typing import (
    Optional,
    Set,
)

from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.file.schemas.file_create_schema import FileCreateSchema
from app.domain.file.schemas.file_setup_schema import FileSetupSchema


@dataclass
class FileAggregate(IAggregate):
    file_name: str
    file_key: str
    extension: str
    content_type: str

    id: Optional[int] = None
    created_at: Optional[datetime] = None

    @classmethod
    def create(cls, data: FileCreateSchema) -> "FileAggregate":
        return cls(**data.model_dump())

    @classmethod
    def setup(cls, data: FileSetupSchema) -> "FileAggregate":
        return cls(**data.model_dump())

    def dump(self, exclude: Optional[Set[str]] = None) -> dict:
        result = {}
        for field in self.__dataclass_fields__:
            if exclude and field in exclude:
                continue
            result[field] = getattr(self, field)
        return result
