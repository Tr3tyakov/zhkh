from typing import Optional

from sqlalchemy import select

from app.application.company.schemas.base import CompanyResponseSchema
from app.domain.common.interfaces.repositories.queries.company_query_repository import (
    ICompanyQueryRepository,
)
from app.domain.company.schemas.company_response_schema import GetCompanyResponseSchema
from app.infrastructure.orm.models import Company
from app.infrastructure.persistence.base import BaseRepository


class CompanyQueryRepository(BaseRepository, ICompanyQueryRepository):

    async def get_companies(
        self, limit: int, offset: int, search: Optional[str] = None
    ) -> GetCompanyResponseSchema:
        stmt = select(Company).order_by(Company.id)

        if search is not None:
            like = f"%{search}%"
            stmt = stmt.where(
                Company.name.ilike(like),
            )

        companies, count = await self.get_pagination_data(stmt, limit, offset)

        return GetCompanyResponseSchema(
            companies=[
                CompanyResponseSchema.model_validate(company) for company in companies
            ],
            total=count,
        )
