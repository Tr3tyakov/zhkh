from app.application.common.interfaces.request import IRequestHandler
from app.application.company.commands.delete_company_command import DeleteCompanyCommand
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.application.house.commands.delete_house_command import DeleteHouseCommand
from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.house.schemas.house_update_schema import HouseUpdateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class DeleteCompanyHandler(IRequestHandler[DeleteCompanyCommand, None]):
    def __init__(
        self, company_repository: ICompanyRepository = Provide[ICompanyRepository]
    ):
        self._company_repository = company_repository

    async def handle(
        self, command: DeleteCompanyCommand, context: PipelineContext
    ) -> None:
        company = context.company
        await self._company_repository.delete_company(company)
