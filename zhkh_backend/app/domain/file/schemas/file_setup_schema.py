from datetime import datetime

from app.domain.file.schemas.base import FileBaseSchema


class FileSetupSchema(FileBaseSchema):
    id: int
    created_at: datetime
