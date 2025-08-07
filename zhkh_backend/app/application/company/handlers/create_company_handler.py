from app.application.common.interfaces.request import IRequestHandler
from app.application.company.commands.create_company_command import CreateCompanyCommand
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.company.aggregates.company import CompanyAggregate
from app.domain.company.schemas.company_create_schema import CompanyCreateSchema
from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.schemas.house_create_schema import HouseCreateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class CreateCompanyHandler(IRequestHandler[CreateCompanyCommand, None]):
    def __init__(
        self, company_repository: ICompanyRepository = Provide[ICompanyRepository]
    ):
        self._company_repository = company_repository

    async def handle(
        self, command: CreateCompanyCommand, context: PipelineContext
    ) -> None:
        company = CompanyAggregate.create_company(
            data=CompanyCreateSchema(**command.model_dump())
        )
        await self._company_repository.create_company(company)
