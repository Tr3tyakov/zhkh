from abc import (
    ABC,
    abstractmethod,
)
from typing import (
    Any,
    AsyncGenerator,
    ClassVar,
    List,
    Optional,
)

from sqlalchemy import (
    Result,
    Select,
)

from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.infrastructure.persistence.common.options import (
    BaseFilter,
    Options,
)
from app.infrastructure.persistence.common.types import StatementType


class IRepository(ABC): ...


class IBaseRepository(IRepository):
    translator: ClassVar[IPersistenceTranslator]

    @abstractmethod
    async def create_instance(self, aggregate: IAggregate) -> IAggregate: ...

    @abstractmethod
    async def update_instance(self, id: int, **kwargs) -> IAggregate: ...

    @abstractmethod
    async def delete_instances(self, ids: List[int]) -> None: ...

    @abstractmethod
    async def execute(
        self,
        stmt: StatementType,
        options: Optional[Options] = None,
    ) -> Any: ...

    @abstractmethod
    async def just_execute(self, stmt: StatementType) -> Result: ...

    @abstractmethod
    async def execute_by_chunk(
        self,
        stmt: Select,
        chunk_size: int = 10,
        unique: bool = False,
    ) -> AsyncGenerator: ...

    @abstractmethod
    async def check_existence(
        self,
        filters: Optional[BaseFilter] = None,
        options: Optional[Options] = None,
    ) -> bool: ...
