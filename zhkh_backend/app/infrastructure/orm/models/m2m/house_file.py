from sqlalchemy import (
    Column,
    Enum,
    ForeignKey,
    Integer,
)

from app.infrastructure.common.enums.user import FileCategoryEnum
from app.infrastructure.orm.models.base import BaseModel


class HouseFileM2M(BaseModel):
    "M2m таблица дома и файла"

    category = Column(Enum(FileCategoryEnum), nullable=False, comment="Категория файла")
    house_id = Column(
        Integer, ForeignKey("house.id", ondelete="CASCADE"), nullable=False
    )
    file_id = Column(Integer, ForeignKey("file.id", ondelete="CASCADE"), nullable=False)
