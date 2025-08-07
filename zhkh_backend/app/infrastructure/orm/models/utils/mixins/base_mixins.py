from sqlalchemy import (
    Column,
    Integer,
)
from sqlalchemy.ext.declarative import declared_attr

from .utils import get_snake_case


class DeclareMixin:
    @declared_attr
    def __tablename__(self):
        return get_snake_case(self.__name__)

    @declared_attr
    def __table_args__(self):
        return {"comment": self.__doc__.strip()}


#


class IDMixin:
    id = Column(
        Integer,
        primary_key=True,
        nullable=False,
        autoincrement=True,
        comment="Идентификатор объекта",
    )
