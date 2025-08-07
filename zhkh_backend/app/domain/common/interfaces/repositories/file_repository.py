from abc import abstractmethod
from typing import (
    Any,
    Optional,
    Sequence,
    Union,
)

from app.domain.common.interfaces.repositories.base import IRepository
from app.domain.file.aggregates.file_aggregate import FileAggregate
from app.domain.file.value_objects.filters.file_filter import FileFilter
from app.infrastructure.orm.mapping.audit_log_translator import AuditLogTranslator
from app.infrastructure.persistence.common.options import Options


class IFileRepository(IRepository):
    translator = AuditLogTranslator

    @abstractmethod
    async def create_file(self, aggregate: FileAggregate) -> FileAggregate: ...

    @abstractmethod
    async def get_file(
        self,
        filters: Optional[FileFilter] = None,
        options: Optional[Options] = None,
    ) -> Optional[Union[FileAggregate, Sequence[FileAggregate], Any]]: ...

    @abstractmethod
    async def check_file(
        self,
        filters: Optional[FileFilter] = None,
        options: Optional[Options] = None,
    ) -> bool: ...

    @abstractmethod
    async def delete_file(self, log: FileAggregate) -> None: ...
