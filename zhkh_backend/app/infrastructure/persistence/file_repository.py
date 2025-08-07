from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.file_repository import IFileRepository
from app.domain.file.aggregates.file_aggregate import FileAggregate
from app.domain.file.value_objects.filters.file_filter import FileFilter
from app.infrastructure.orm.mapping.audit_log_translator import AuditLogTranslator
from app.infrastructure.orm.mapping.file_translator import FileTranslator
from app.infrastructure.persistence.base import BaseRepository
from app.infrastructure.persistence.common.options import Options


class FileRepository(BaseRepository, IFileRepository):
    translator = FileTranslator

    async def create_file(self, aggregate: FileAggregate) -> FileAggregate:
        return await self.create_instance(aggregate)

    async def get_file(
        self,
        filters: Optional[FileFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[FileAggregate, Sequence[FileAggregate], Any]]:
        return await self.get(filters, options)

    async def check_file(
        self,
        filters: Optional[FileFilter] = None,
        options: Optional[Options] = None,
    ) -> bool:
        return await self.check_existence(filters, options)

    async def delete_file(self, log: FileAggregate) -> None:
        return await self.delete_instances(ids=[log.id])
