from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    String,
)

from app.infrastructure.orm.models.base import BaseModel


class File(BaseModel):
    """Файл"""

    file_name = Column(String, nullable=False, comment="Имя файла")
    file_key = Column(String, nullable=False, unique=True, comment="Ключ S3")
    content_type = Column(String, nullable=False)
    extension = Column(String, nullable=False, comment="Расширение файла")

    created_at = Column(
        DateTime, nullable=False, default=datetime.now, comment="Дата создания"
    )
