from abc import (
    ABC,
    abstractmethod,
)
from typing import (
    Type,
    TypeVar,
)

from app.domain.common.interfaces.aggregates import IAggregate
from app.infrastructure.orm.models.base import BaseModel

TModel = TypeVar("TModel", bound=BaseModel)
TAggregate = TypeVar("TAggregate", bound=IAggregate)


class IPersistenceTranslator(ABC):
    orm_model: Type[TModel]
    aggregate: Type[TAggregate]

    @abstractmethod
    def to_domain(self, model: TModel) -> TAggregate: ...

    @abstractmethod
    def to_orm(self, aggregate: TAggregate) -> TModel: ...
