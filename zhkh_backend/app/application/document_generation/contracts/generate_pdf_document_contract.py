from app.application.common.interfaces.base import IContract
from app.domain.common.utils import to_camel
from app.domain.document_generation.schemas.base import GenerateHouseFieldsSchema
from app.infrastructure.common.enums.generation_document import GeneratePDFDocumentType


class GeneratePDFDocumentContract(IContract, GenerateHouseFieldsSchema):
    report_type: GeneratePDFDocumentType

    class Config:
        alias_generator = to_camel
        validate_by_name = True
