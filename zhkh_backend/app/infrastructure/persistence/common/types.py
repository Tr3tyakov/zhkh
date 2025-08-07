import operator
from datetime import datetime
from operator import (
    is_,
    is_not,
)
from typing import (
    Any,
    Optional,
    Sequence,
    Tuple,
    Union,
)

from sqlalchemy import (
    CompoundSelect,
    Delete,
    Insert,
    Select,
    UnaryExpression,
    Update,
)
from sqlalchemy.orm import (
    joinedload,
    noload,
    selectinload,
)

OperatorType: Optional[Union[Tuple[Union[is_not, is_, operator], Any], Any]] = None
OrderByType: Optional[UnaryExpression] = None
IntegerField = Tuple[operator, Union[int, Sequence[int]]]
StringField = Tuple[operator, Union[str, Sequence[str]]]
BooleanField = Tuple[operator, Union[bool, Sequence[bool]]]
FloatField = Tuple[operator, Union[float, Sequence[float]]]
DatetimeField = Tuple[operator, Union[datetime, Sequence[datetime]]]

StatementType = Union[Update, Select, Delete, Insert, CompoundSelect]
OptionsType: Optional[Sequence[Union[joinedload, selectinload, noload]]] = None
