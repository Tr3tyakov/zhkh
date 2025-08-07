from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.company.aggregates.company import CompanyAggregate
from app.domain.company.value_objects.filters.company_filter import CompanyFilter
from app.infrastructure.orm.mapping.company_translator import CompanyTranslator
from app.infrastructure.orm.mapping.house_translator import HouseTranslator
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class CompanyRepository(BaseRepository, ICompanyRepository):
    translator = CompanyTranslator

    async def create_company(self, aggregate: CompanyAggregate) -> CompanyAggregate:
        return await self.create_instance(aggregate)

    async def get_company(
        self,
        filters: Optional[CompanyFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[CompanyFilter, Sequence[CompanyFilter], Any]]:
        return await self.get(filters, options)

    async def check_existence_company(
        self, filters: Optional[CompanyFilter] = None, options: Optional[Options] = None
    ) -> bool:
        return await self.check_existence(filters, options)

    async def update_company(self, company: CompanyAggregate) -> CompanyAggregate:
        return await self.update_instance(**company.dump())

    async def delete_company(self, company: CompanyAggregate) -> None:
        return await self.delete_instances(ids=[company.id])
