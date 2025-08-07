from operator import eq
from typing import Any

from fastapi import status

from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.house.commands.delete_house_file_command import (
    DeleteHouseFileCommand,
)
from app.domain.common.interfaces.repositories.file_repository import IFileRepository
from app.domain.file.value_objects.filters.file_filter import FileFilter
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ExistentFileByIdValidator(IValidator):
    SUPPORTED = (DeleteHouseFileCommand,)

    def __init__(
        self,
        file_repository: IFileRepository = Provide[IFileRepository],
    ):
        self._file_repository = file_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        file = await self._file_repository.get_file(
            filters=FileFilter(id=(eq, data.file_id))
        )

        if file is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="file",
                    value=data.file_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                    text="Данный файл отсутствует в системе",
                ),
            )

        context.file = file
