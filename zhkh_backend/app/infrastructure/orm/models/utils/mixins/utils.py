import re
from typing import (
    List,
    Optional,
    Set,
)

from sqlalchemy import Column
from sqlalchemy.orm import DeclarativeMeta

from app.application.house.schemas.house_fields_schema import HouseFieldSchema


def get_snake_case(class_name: str) -> str:
    repl = r"\1_\2"
    name = re.sub(r"([A-Z]+)([A-Z][a-z])", repl, class_name)
    return re.sub(r"([a-z\d])([A-Z])", repl, name).lower()


def extract_model_fields(
    model: DeclarativeMeta, exclude: Optional[Set[str]] = None
) -> List[HouseFieldSchema]:
    fields = []
    for attribute_name, column in model.__table__.columns.items():
        if exclude and attribute_name in exclude:
            continue

        if isinstance(column, Column):
            fields.append(
                HouseFieldSchema(field=attribute_name, description=column.comment)
            )

    return fields
