from app.application.audit_log.queries.get_audit_log_query import GetAuditLogQuery
from app.application.common.interfaces.request import IRequestHandler
from app.domain.audit_log.schemas.audit_log_response_schema import (
    AuditLogPaginationResponseSchema,
)
from app.domain.common.interfaces.repositories.queries.audit_query_repository import (
    IAuditLogQueryRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetAuditLogHandler(IRequestHandler[GetAuditLogQuery, None]):
    def __init__(
        self,
        audit_log_query_repository: IAuditLogQueryRepository = Provide[
            IAuditLogQueryRepository
        ],
    ):
        self._audit_log_query_repository = audit_log_query_repository

    async def handle(
        self, query: GetAuditLogQuery, context: PipelineContext
    ) -> AuditLogPaginationResponseSchema:
        return await self._audit_log_query_repository.get_audit_logs(query)
