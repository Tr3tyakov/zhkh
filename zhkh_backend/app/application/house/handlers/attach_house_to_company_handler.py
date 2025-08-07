from app.application.common.interfaces.request import IRequestHandler
from app.application.house.commands.attach_house_to_company_command import (
    AttachHouseToCompanyCommand,
)
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.schemas.house_create_schema import HouseCreateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class AttachHouseToCompanyHandler(IRequestHandler[AttachHouseToCompanyCommand, None]):
    def __init__(self, house_repository: IHouseRepository = Provide[IHouseRepository]):
        self._house_repository = house_repository

    async def handle(
        self, command: AttachHouseToCompanyCommand, context: PipelineContext
    ) -> None:
        house = context.house
        house.company_id = command.company_id
        await self._house_repository.update_house(house)
