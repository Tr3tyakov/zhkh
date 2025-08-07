from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.infrastructure.orm.models.base import BaseModel


class ReferenceBook(BaseModel):
    """Справочник"""

    name = Column(
        String, nullable=False, unique=True, comment="Наименование справочника"
    )

    reference_book_values = relationship(
        "ReferenceBookValue", back_populates="reference_book", uselist=True
    )


class ReferenceBookValue(BaseModel):
    """Значение справочника"""

    value = Column(String, nullable=False, comment="значение справочника")
    reference_book_id = Column(
        Integer,
        ForeignKey("reference_book.id"),
        nullable=False,
        comment="Идентификатор справочника",
    )

    reference_book = relationship(
        "ReferenceBook", back_populates="reference_book_values", uselist=False
    )
