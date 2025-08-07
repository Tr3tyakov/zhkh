from app.application.common.interfaces.request import IRequestHandler
from app.application.house.commands.delete_house_command import DeleteHouseCommand
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class DeleteHouseHandler(IRequestHandler[DeleteHouseCommand, None]):
    def __init__(self, house_repository: IHouseRepository = Provide[IHouseRepository]):
        self._house_repository = house_repository

    async def handle(
        self, command: DeleteHouseCommand, context: PipelineContext
    ) -> None:
        house = context.house
        await self._house_repository.delete_house(house)
