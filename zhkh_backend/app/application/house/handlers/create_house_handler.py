from app.application.common.interfaces.request import IRequestHandler
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.schemas.house_create_schema import HouseCreateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class CreateHouseHandler(IRequestHandler[CreateHouseCommand, None]):
    def __init__(self, house_repository: IHouseRepository = Provide[IHouseRepository]):
        self._house_repository = house_repository

    async def handle(
        self, command: CreateHouseCommand, context: PipelineContext
    ) -> None:
        house = HouseAggregate.create_house(
            data=HouseCreateSchema(**command.model_dump())
        )
        await self._house_repository.create_house(house)
