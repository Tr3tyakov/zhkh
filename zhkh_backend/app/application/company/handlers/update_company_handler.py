from app.application.common.interfaces.request import IRequestHandler
from app.application.company.commands.update_company_command import UpdateCompanyCommand
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.application.house.commands.update_house_command import UpdateHouseCommand
from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.company.schemas.company_update_schema import CompanyUpdateSchema
from app.domain.house.schemas.house_update_schema import HouseUpdateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class UpdateCompanyHandler(IRequestHandler[UpdateCompanyCommand, None]):
    def __init__(
        self, company_repository: ICompanyRepository = Provide[ICompanyRepository]
    ):
        self._company_repository = company_repository

    async def handle(
        self, command: UpdateCompanyCommand, context: PipelineContext
    ) -> None:
        company = context.company
        company.update_company(data=CompanyUpdateSchema(**command.model_dump()))
        await self._company_repository.update_company(company)
