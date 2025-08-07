from enum import Enum


class BaseEnum(str, Enum): ...


from typing import Any

from sqlalchemy import Result


class ResultStrategy(BaseEnum):
    SCALAR = "SCALAR"
    SCALARS = "SCALARS"
    SCALAR_ONE = "SCALAR_ONE"
    SCALAR_ONE_OR_NONE = "SCALAR_ONE_OR_NONE"
    SCALARS_ALL = "SCALARS_ALL"
    SCALARS_FIRST = "SCALARS_FIRST"
    FIRST = "FIRST"
    ALL = "ALL"
    ONE = "ONE"
    ONE_OR_NONE = "ONE_OR_NONE"
    ROW = "ROW"

    def apply(self, result: Result) -> Any:
        match self:
            case ResultStrategy.SCALAR:
                return result.scalar()
            case ResultStrategy.SCALARS:
                return result.scalars()
            case ResultStrategy.SCALAR_ONE:
                return result.scalar_one()
            case ResultStrategy.SCALAR_ONE_OR_NONE:
                return result.scalar_one_or_none()
            case ResultStrategy.SCALARS_ALL:
                return result.scalars().all()
            case ResultStrategy.SCALARS_FIRST:
                return result.scalars().first()
            case ResultStrategy.FIRST:
                return result.first()
            case ResultStrategy.ALL:
                return result.all()
            case ResultStrategy.ONE_OR_NONE:
                return result.one_or_none()
            case ResultStrategy.ONE:
                return result.one()
            case ResultStrategy.ROW:
                return result


class SortDirectionEnum(BaseEnum):
    ASC = "ASC"
    DESC = "DESC"
