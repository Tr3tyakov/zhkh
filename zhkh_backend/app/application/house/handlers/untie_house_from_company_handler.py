from app.application.common.interfaces.request import IRequestHandler
from app.application.house.commands.untie_house_from_company_command import (
    UntieHouseToCompanyCommand,
)
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class UntieHouseFromCompanyHandler(IRequestHandler[UntieHouseToCompanyCommand, None]):
    def __init__(self, house_repository: IHouseRepository = Provide[IHouseRepository]):
        self._house_repository = house_repository

    async def handle(
        self, command: UntieHouseToCompanyCommand, context: PipelineContext
    ) -> None:
        house = context.house
        house.company_id = None
        await self._house_repository.update_house(house)
