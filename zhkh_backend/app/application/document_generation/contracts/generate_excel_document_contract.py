from app.application.common.interfaces.base import IContract
from app.domain.document_generation.schemas.base import GenerateHouseFieldsSchema


class GenerateExcelDocumentContract(IContract, GenerateHouseFieldsSchema): ...
