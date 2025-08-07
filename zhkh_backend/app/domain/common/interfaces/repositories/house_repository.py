from abc import abstractmethod
from typing import (
    Any,
    AsyncGenerator,
    Optional,
    Sequence,
    Union,
)

from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.value_objects.filters.house_filter import HouseFilter
from app.infrastructure.common.enums.user import FileCategoryEnum
from app.infrastructure.orm.mapping.house_translator import HouseTranslator
from app.infrastructure.persistence.common.options import Options


class IHouseRepository:
    translator = HouseTranslator

    @abstractmethod
    async def create_house(self, aggregate: HouseAggregate) -> HouseAggregate: ...

    @abstractmethod
    async def get_houses(
        self,
        filters: Optional[HouseFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[HouseFilter, Sequence[HouseFilter], Any]]: ...

    @abstractmethod
    async def check_existence_house(
        self, filters: Optional[HouseFilter] = None, options: Optional[Options] = None
    ) -> bool: ...

    @abstractmethod
    async def update_house(self, house: HouseAggregate) -> HouseAggregate: ...

    @abstractmethod
    async def delete_house(self, house: HouseAggregate) -> None: ...

    @abstractmethod
    def get_all_houses_by_chunk(
        self,
        chunk_size: int = 100,
        unique: bool = False,
    ) -> AsyncGenerator: ...

    @abstractmethod
    async def connect_file(
        self, category: FileCategoryEnum, house_id: int, file_id: int
    ) -> None: ...
