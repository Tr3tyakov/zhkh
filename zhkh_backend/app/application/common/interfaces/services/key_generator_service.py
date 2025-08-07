from abc import abstractmethod

from fastapi import UploadFile

from app.application.common.interfaces.base import IService


class IKeyGeneratorService(IService):

    @abstractmethod
    def generate_file_key(self, main_name: str, file: UploadFile) -> str: ...
    @abstractmethod
    def generate_key(self, main_name: str, file_name: str, type: str) -> str: ...
