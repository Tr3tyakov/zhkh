from fastapi import (
    Depends,
    Request,
)

from app.application.common.interfaces.mediator import IMediator
from app.application.document_generation.commands.generate_excel_document_command import (
    GenerateExcelDocumentCommand,
)
from app.application.document_generation.commands.generate_pdf_document_command import (
    GeneratePDFDocumentCommand,
)
from app.application.document_generation.contracts.generate_excel_document_contract import (
    GenerateExcelDocumentContract,
)
from app.application.document_generation.contracts.generate_pdf_document_contract import (
    GeneratePDFDocumentContract,
)
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

generate_document_router = LoggingRouter(prefix="/api", tags=["generate_documents"])


@generate_document_router.post(
    "/generate/pdf",
    description="Генерация PDF файла",
)
@inject_session
@secure()
async def generate_pdf_document(
    request: Request,
    data: GeneratePDFDocumentContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> str:
    return await mediator.send(GeneratePDFDocumentCommand(**data.model_dump()))


@generate_document_router.post(
    "/generate/excel",
    description="Генерация PDF файла",
)
@inject_session
@secure()
async def generate_excel_document(
    request: Request,
    data: GenerateExcelDocumentContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> str:
    return await mediator.send(GenerateExcelDocumentCommand(**data.model_dump()))
