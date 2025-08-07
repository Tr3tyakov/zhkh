from typing import (
    Any,
    AsyncGenerator,
    List,
    Optional,
    Sequence,
    Union,
)

from sqlalchemy import select

from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.value_objects.filters.house_filter import HouseFilter
from app.infrastructure.common.enums.user import FileCategoryEnum
from app.infrastructure.orm.mapping.house_translator import HouseTranslator
from app.infrastructure.orm.models import House
from app.infrastructure.orm.models.m2m.house_file import HouseFileM2M
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class HouseRepository(BaseRepository, IHouseRepository):
    translator = HouseTranslator

    async def create_house(self, aggregate: HouseAggregate) -> HouseAggregate:
        return await self.create_instance(aggregate)

    async def get_houses(
        self,
        filters: Optional[HouseFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[HouseFilter, Sequence[HouseFilter], Any]]:
        return await self.get(filters, options)

    async def check_existence_house(
        self, filters: Optional[HouseFilter] = None, options: Optional[Options] = None
    ) -> bool:
        return await self.check_existence(filters, options)

    async def update_house(self, house: HouseAggregate) -> HouseAggregate:
        return await self.update_instance(**house.dump())

    async def delete_house(self, house: HouseAggregate) -> None:
        return await self.delete_instances(ids=[house.id])

    async def get_all_houses_by_chunk(
        self,
        chunk_size: int = 100,
        unique: bool = False,
    ) -> AsyncGenerator[List[House], None]:
        stmt = select(House)
        async for chunk in self.execute_by_chunk(
            stmt, chunk_size=chunk_size, unique=unique
        ):
            yield chunk

    async def connect_file(
        self, category: FileCategoryEnum, house_id: int, file_id: int
    ) -> None:
        session = self._session_manager.get_session()

        session.add(HouseFileM2M(file_id=file_id, house_id=house_id, category=category))
        await session.flush()
