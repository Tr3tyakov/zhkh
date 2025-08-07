from abc import (
    ABC,
    abstractmethod,
)
from contextlib import asynccontextmanager
from io import BufferedReader
from typing import (
    Any,
    AsyncGenerator,
    BinaryIO,
    Dict,
    Union,
)

from aiobotocore.response import StreamingBody


class ICeph(ABC):

    @abstractmethod
    @asynccontextmanager
    async def get_object(
        self, bucket: str, key: str, is_temporary_bucket: bool = False
    ) -> AsyncGenerator[StreamingBody, None]: ...

    @abstractmethod
    @asynccontextmanager
    async def get_object_with_version(
        self, bucket: str, key: str, version_id: str
    ) -> AsyncGenerator[StreamingBody, None]: ...

    @abstractmethod
    async def put_object(
        self, bucket: str, key: str, data: Union[BufferedReader, BinaryIO, bytes]
    ) -> None: ...

    @abstractmethod
    async def generate_presigned_url(
        self,
        bucket: str,
        key: str,
    ) -> str: ...

    @abstractmethod
    async def head_object(self, bucket: str, key: str) -> Dict[str, Any]: ...

    @abstractmethod
    async def list_objects(self, bucket: str, prefix: str) -> Dict[str, Any]: ...

    @abstractmethod
    async def put_object_with_version(
        self, bucket: str, key: str, data: bytes
    ) -> str: ...

    @abstractmethod
    async def download_file_obj(self, bucket: str, key: str, file_stream) -> None: ...

    @abstractmethod
    async def delete_object(self, key: str) -> None: ...
