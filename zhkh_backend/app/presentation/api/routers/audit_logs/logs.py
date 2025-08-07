from fastapi import (
    Depends,
    Request,
)

from app.application.audit_log.commands.create_audit_log_command import (
    CreateAuditLogCommand,
)
from app.application.audit_log.contracts.create_audit_log_contract import (
    CreateAuditLogContract,
)
from app.application.audit_log.contracts.get_audit_log_contract import (
    GetAuditLogContract,
)
from app.application.audit_log.queries.get_audit_log_query import GetAuditLogQuery
from app.application.common.interfaces.mediator import IMediator
from app.domain.audit_log.schemas.audit_log_response_schema import (
    AuditLogPaginationResponseSchema,
)
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

audit_log_router = LoggingRouter(prefix="/api", tags=["audit_logs"])


@audit_log_router.post("/audit_log", description="Создание лога")
@inject_session
@secure(setup_user=True)
async def create_audit_log(
    request: Request,
    data: CreateAuditLogContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    await mediator.send(
        CreateAuditLogCommand(user_id=request.state.user_id, **data.model_dump())
    )


@audit_log_router.get("/audit_log", description="Получение логов")
@inject_session
@secure(setup_user=True)
async def get_audit_log(
    request: Request,
    data: GetAuditLogContract = Depends(),
    mediator: IMediator = Depends(Provide[IMediator]),
) -> AuditLogPaginationResponseSchema:
    return await mediator.send(
        GetAuditLogQuery(user_id=request.state.user_id, **data.model_dump())
    )
