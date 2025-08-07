from app.application.common.interfaces.request import IRequestHandler
from app.application.house.commands.update_house_command import UpdateHouseCommand
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.house.schemas.house_update_schema import HouseUpdateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class UpdateHouseHandler(IRequestHandler[UpdateHouseCommand, None]):
    def __init__(self, house_repository: IHouseRepository = Provide[IHouseRepository]):
        self._house_repository = house_repository

    async def handle(
        self, command: UpdateHouseCommand, context: PipelineContext
    ) -> None:
        house = context.house
        house.update_house(data=HouseUpdateSchema(**command.model_dump()))
        await self._house_repository.update_house(house)
