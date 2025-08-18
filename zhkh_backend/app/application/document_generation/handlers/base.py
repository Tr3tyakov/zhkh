from datetime import datetime
from typing import (
    Any,
    Dict,
)

from app.domain.common.interfaces.repositories.reference_book_value_repository import (
    IReferenceBookValueRepository,
)
from app.infrastructure.common.enums.base import ResultStrategy
from app.infrastructure.persistence.common.options import Options


class HouseDataMapper:
    def __init__(self, reference_book_value_repository: IReferenceBookValueRepository):
        self._reference_book_value_repository = reference_book_value_repository

    async def get_reference_values_map(self) -> Dict[int, str]:
        """Загружает все справочные значения в словарь id -> value"""
        book_values = (
            await self._reference_book_value_repository.get_reference_book_values(
                options=Options(strategy=ResultStrategy.SCALARS_ALL)
            )
        )
        return {book_value.id: book_value.value for book_value in book_values}

    async def map_house_fields(self, house) -> Dict[str, Any]:
        """Преобразует поля дома с ref_id в строки и форматирует даты"""
        ref_map = await self.get_reference_values_map()
        data = {}

        for column in house.__table__.columns:
            val = getattr(house, column.name)
            if (
                hasattr(column, "foreign_keys")
                and column.foreign_keys
                and isinstance(val, int)
                and val in ref_map
            ):
                data[column.name] = ref_map[val]
            elif isinstance(val, datetime):
                data[column.name] = val.strftime("%d.%m.%Y")
            else:
                data[column.name] = val
        return data
