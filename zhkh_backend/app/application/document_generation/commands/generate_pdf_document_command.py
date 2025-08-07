from app.application.common.interfaces.request import ICommand
from app.domain.document_generation.schemas.base import GenerateHouseFieldsSchema
from app.infrastructure.common.enums.generation_document import GeneratePDFDocumentType


class GeneratePDFDocumentCommand(ICommand, GenerateHouseFieldsSchema):
    report_type: GeneratePDFDocumentType
