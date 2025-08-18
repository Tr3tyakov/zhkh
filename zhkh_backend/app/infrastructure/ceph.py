import logging
from contextlib import asynccontextmanager
from typing import (
    Any,
    AsyncGenerator,
    Dict,
)

import aioboto3
from aiobotocore.client import AioBaseClient
from aiobotocore.response import StreamingBody
from botocore.config import Config
from dynaconf.utils.boxing import DynaBox

from app.application.common.interfaces.ceph import ICeph


class CephException(Exception): ...


class Ceph(ICeph):
    def __init__(self, settings: DynaBox) -> None:
        self._settings = settings
        self._session = aioboto3.Session(
            aws_access_key_id=settings.access_key,
            aws_secret_access_key=settings.secret_key,
            region_name=settings.region_name,
        )
        self._public_endpoint_url = f"{self._settings.protocol}://{self._settings.public_host}:{self._settings.port}"
        self._internal_endpoint_url = (
            f"{self._settings.protocol}://{self._settings.host}:{self._settings.port}"
        )

        self._client_params = {
            "service_name": "s3",
            "endpoint_url": self._internal_endpoint_url,
            "config": Config(
                signature_version=self._settings.version,
                retries={"max_attempts": 10, "mode": "standard"},
            ),
            "verify": self._settings.verify,
        }

    @asynccontextmanager
    async def client_creator(
        self, use_public_endpoint: bool = False
    ) -> AsyncGenerator[AioBaseClient, None]:
        params = self._client_params.copy()
        if use_public_endpoint:
            params["endpoint_url"] = self._public_endpoint_url

        async with self._session.client(**params) as s3_client:
            yield s3_client

    @asynccontextmanager
    async def get_object(
        self, bucket: str, key: str
    ) -> AsyncGenerator[StreamingBody, None]:
        logging.info("Получение объекта. Bucket: '%s'. Key: '%s'", bucket, key)
        async with self.client_creator() as client:
            file_object = await client.get_object(Bucket=bucket, Key=key)
            yield file_object["Body"]

    @asynccontextmanager
    async def get_object_with_version(
        self, bucket: str, key: str, version_id: str
    ) -> AsyncGenerator[StreamingBody, None]:
        logging.info(
            "Получение объекта. Bucket: '%s'. Key: '%s'. VersionId: '%s'",
            bucket,
            key,
            version_id,
        )
        async with self.client_creator() as client:
            file_object = await client.get_object(
                Bucket=bucket, Key=key, VersionId=version_id
            )
            yield file_object["Body"]

    async def head_object(self, bucket: str, key: str) -> Dict[str, Any]:
        logging.info("Получение информации объекта. Bucket: %s. Key: %s", bucket, key)
        async with self.client_creator() as s3_client:
            return await s3_client.head_object(Bucket=bucket, Key=key)

    async def list_objects(self, bucket: str, prefix: str) -> Dict[str, Any]:
        logging.info(
            "Получение списка объектов. Bucket: '%s'. Prefix: '%s'", bucket, prefix
        )
        async with self.client_creator() as client:
            return await client.list_objects(Bucket=bucket, Prefix=prefix)

    async def put_object(self, bucket: str, key: str, data: bytes) -> None:
        logging.info("Загрузка объекта. Bucket: '%s'. Key: '%s'", bucket, key)
        async with self.client_creator() as client:
            await client.put_object(Body=data, Bucket=bucket, Key=key)

    async def put_object_with_version(self, bucket: str, key: str, data: bytes) -> str:
        logging.info("Загрузка объекта. Bucket: '%s'. Key: '%s'", bucket, key)
        async with self.client_creator() as client:
            response = await client.put_object(Body=data, Bucket=bucket, Key=key)
            return response["VersionId"]

    async def download_file_obj(self, bucket: str, key: str, file_stream) -> None:
        logging.info("Скачивание объекта. Bucket: '%s'. Key: '%s'", bucket, key)
        async with self.client_creator() as client:
            await client.download_fileobj(Bucket=bucket, Key=key, Fileobj=file_stream)

    async def generate_presigned_url(self, bucket: str, key: str) -> str:
        logging.info(
            "Создание адреса для загрузки. Bucket: '%s'. Key: '%s'", bucket, key
        )
        async with self.client_creator(use_public_endpoint=True) as client:
            return await client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket, "Key": key},
                ExpiresIn=self._settings.expiration_time_link_object,
            )

    async def delete_object(self, key: str) -> None:
        logging.info(
            "Удаление объекта. Bucket: '%s'. Key: '%s'", self._settings.bucket, key
        )
        async with self.client_creator() as client:
            await client.delete_object(Bucket=self._settings.bucket, Key=key)
