import uuid

from fastapi import UploadFile

from app.application.common.interfaces.services.key_generator_service import (
    IKeyGeneratorService,
)


class KeyGeneratorService(IKeyGeneratorService):

    def generate_file_key(self, main_name: str, file: UploadFile) -> str:
        filename = file.filename
        ext = ""
        if "." in filename:
            ext = filename.split(".")[-1]

        return f"{main_name}/{uuid.uuid4()}.{ext}"

    def generate_key(self, main_name: str, file_name: str, type: str) -> str:
        return f"{main_name}/{file_name}_{uuid.uuid4()}.{type}"
