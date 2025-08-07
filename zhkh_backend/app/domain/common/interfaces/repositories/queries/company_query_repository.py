from abc import abstractmethod
from typing import Optional

from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.company.schemas.company_response_schema import GetCompanyResponseSchema


class ICompanyQueryRepository(IRepository):

    @abstractmethod
    async def get_companies(
        self, limit: int, offset: int, search: Optional[str] = None
    ) -> GetCompanyResponseSchema: ...
