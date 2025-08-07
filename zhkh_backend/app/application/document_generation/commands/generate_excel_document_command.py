from app.application.common.interfaces.request import ICommand
from app.domain.document_generation.schemas.base import GenerateHouseFieldsSchema


class GenerateExcelDocumentCommand(ICommand, GenerateHouseFieldsSchema): ...
