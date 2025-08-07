from abc import abstractmethod
from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.company.aggregates.company import CompanyAggregate
from app.domain.company.value_objects.filters.company_filter import CompanyFilter
from app.infrastructure.orm.mapping.company_translator import CompanyTranslator
from app.infrastructure.persistence.common.options import Options


class ICompanyRepository:
    translator = CompanyTranslator

    @abstractmethod
    async def create_company(self, aggregate: CompanyAggregate) -> CompanyAggregate: ...

    @abstractmethod
    async def get_company(
        self,
        filters: Optional[CompanyFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[CompanyFilter, Sequence[CompanyFilter], Any]]: ...

    @abstractmethod
    async def check_existence_company(
        self, filters: Optional[CompanyFilter] = None, options: Optional[Options] = None
    ) -> bool: ...

    @abstractmethod
    async def update_company(self, company: CompanyAggregate) -> CompanyAggregate: ...

    @abstractmethod
    async def delete_company(self, company: CompanyAggregate) -> None: ...
