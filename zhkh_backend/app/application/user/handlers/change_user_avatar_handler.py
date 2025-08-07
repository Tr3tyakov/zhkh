import logging

from fastapi import UploadFile

from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.request import IRequestHandler
from app.application.common.interfaces.services.key_generator_service import (
    IKeyGeneratorService,
)
from app.application.user.commands.change_user_avatar_command import (
    ChangeUserAvatarCommand,
)
from app.config import settings
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ChangeUserAvatarHandler(IRequestHandler[ChangeUserAvatarCommand, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
        user_repository: IUserRepository = Provide[IUserRepository],
        key_generator_service: IKeyGeneratorService = Provide[IKeyGeneratorService],
    ):
        self._ceph = ceph
        self._key_generator_service = key_generator_service
        self._user_repository = user_repository

    async def handle(
        self, command: ChangeUserAvatarCommand, context: PipelineContext
    ) -> None:
        new_key = None
        user = context.user
        try:
            old_key = user.file_key
            new_key = await self._upload_file(command.file)
            user.file_key = new_key
            await self._user_repository.update_user(user)

            if new_key and old_key:
                await self._ceph.delete_object(key=old_key)
        except Exception:
            logging.exception("Ошибка при обновлении пользователя")
            if new_key:
                await self._ceph.delete_object(key=new_key)
            raise

    async def _upload_file(self, file: UploadFile) -> str:
        """Загрузка нового файла в S3"""
        new_key = self._key_generator_service.generate_file_key("users", file=file)
        await self._ceph.put_object(
            bucket=settings.S3.bucket, key=new_key, data=file.file
        )

        return new_key
