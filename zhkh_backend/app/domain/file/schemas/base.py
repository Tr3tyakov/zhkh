from datetime import datetime

from pydantic import (
    BaseModel,
    Field,
)

from app.domain.common.utils import to_camel


class FileBaseSchema(BaseModel):
    file_name: str = Field(..., description="Название файла")
    file_key: str = Field(..., description="Уникальный ключ или путь до файла")
    extension: str = Field(..., description="Расширение файла")
    content_type: str = Field(..., description="Тип контента")

    class Config:
        alias_generator = to_camel
        validate_by_name = True


class FileResponseSchema(FileBaseSchema):
    id: int = Field(..., description="ID файла")
    created_at: datetime = Field(..., description="Дата создания файла")

    class Config:
        json_encoders = {datetime: lambda v: v.strftime("%d.%m.%y %H:%M:%S")}
        alias_generator = to_camel
        validate_by_name = True
