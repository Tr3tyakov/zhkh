from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.request import IRequestHandler
from app.application.house.commands.delete_house_file_command import (
    DeleteHouseFileCommand,
)
from app.domain.common.interfaces.repositories.file_repository import IFileRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class DeleteHouseFileHandler(IRequestHandler[DeleteHouseFileCommand, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
        file_repository: IFileRepository = Provide[IFileRepository],
    ):
        self._ceph = ceph
        self._file_repository = file_repository

    async def handle(
        self, command: DeleteHouseFileCommand, context: PipelineContext
    ) -> None:
        file = context.file
        await self._file_repository.delete_file(file)
        await self._ceph.delete_object(key=file.file_key)
