from pathlib import Path

from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.request import IRequestHandler
from app.application.common.interfaces.services.key_generator_service import (
    IKeyGeneratorService,
)
from app.application.house.commands.create_house_file_command import (
    CreateHouseFileCommand,
)
from app.config import settings
from app.domain.common.interfaces.repositories.file_repository import IFileRepository
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.file.aggregates.file_aggregate import FileAggregate
from app.domain.file.schemas.file_create_schema import FileCreateSchema
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class CreateHouseFileHandler(IRequestHandler[CreateHouseFileCommand, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
        house_repository: IHouseRepository = Provide[IHouseRepository],
        key_generator_service: IKeyGeneratorService = Provide[IKeyGeneratorService],
        file_repository: IFileRepository = Provide[IFileRepository],
    ):
        self._house_repository = house_repository
        self._file_repository = file_repository
        self._key_generator_service = key_generator_service
        self._ceph = ceph

    async def handle(
        self, command: CreateHouseFileCommand, context: PipelineContext
    ) -> None:
        house = context.house
        file_key = self._key_generator_service.generate_file_key(
            "houses/files", file=command.file
        )
        await self._ceph.put_object(
            bucket=settings.S3.bucket, key=file_key, data=command.file.file
        )
        file = FileAggregate.create(
            data=FileCreateSchema(
                file_name=command.file.filename,
                file_key=file_key,
                extension=Path(command.file.filename).suffix.lstrip(".").lower(),
                content_type=command.file.content_type,
            )
        )
        updated_file = await self._file_repository.create_file(file)
        await self._house_repository.connect_file(
            category=command.category_type, house_id=house.id, file_id=updated_file.id
        )
