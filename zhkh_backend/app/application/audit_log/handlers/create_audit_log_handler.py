from app.application.audit_log.commands.create_audit_log_command import (
    CreateAuditLogCommand,
)
from app.application.common.interfaces.request import IRequestHandler
from app.domain.audit_log.aggregates.audit_log import AuditLogAggregate
from app.domain.audit_log.schemas.audit_log_create_schema import AuditLogCreateSchema
from app.domain.common.interfaces.repositories.audit_log_repository import (
    IAuditLogRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class CreateAuditLogHandler(IRequestHandler[CreateAuditLogCommand, None]):
    def __init__(
        self, audit_log_repository: IAuditLogRepository = Provide[IAuditLogRepository]
    ):
        self._audit_log_repository = audit_log_repository

    async def handle(
        self, command: CreateAuditLogCommand, context: PipelineContext
    ) -> None:
        audit_log = AuditLogAggregate.create_log(
            data=AuditLogCreateSchema(**command.model_dump())
        )
        await self._audit_log_repository.create_log(audit_log)
