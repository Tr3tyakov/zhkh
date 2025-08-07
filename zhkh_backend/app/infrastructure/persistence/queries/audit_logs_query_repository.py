from typing import Optional

from sqlalchemy import (
    Select,
    or_,
    select,
)
from sqlalchemy.orm import joinedload

from app.application.audit_log.queries.get_audit_log_query import GetAuditLogQuery
from app.domain.audit_log.schemas.audit_log_response_schema import (
    AuditLogPaginationResponseSchema,
    AuditLogResponsePaginationSchema,
)
from app.domain.common.interfaces.repositories.queries.audit_query_repository import (
    IAuditLogQueryRepository,
)
from app.infrastructure.common.enums.log import EntityTypeEnum
from app.infrastructure.orm.models import (
    AuditLog,
    Company,
    House,
    User,
)
from app.infrastructure.persistence.base import BaseRepository


class AuditLogQueryRepository(BaseRepository, IAuditLogQueryRepository):

    async def get_audit_logs(
        self,
        query: GetAuditLogQuery,
    ) -> AuditLogPaginationResponseSchema:
        stmt = select(AuditLog).options(joinedload(AuditLog.user)).order_by(AuditLog.id)

        if query.log_type:
            stmt = stmt.where(AuditLog.log_type == query.log_type)

        if query.entity_type:
            stmt = stmt.where(AuditLog.entity_type == query.entity_type)

        if query.find_user_id:
            stmt = stmt.where(AuditLog.user_id == query.find_user_id)

        if query.start_datetime is not None:
            stmt = stmt.where(AuditLog.created_at >= query.start_datetime)

        if query.end_datetime is not None:
            stmt = stmt.where(AuditLog.created_at <= query.end_datetime)

        logs, count = await self.get_pagination_data(stmt, query.limit, query.offset)

        return AuditLogPaginationResponseSchema(
            logs=[AuditLogResponsePaginationSchema.model_validate(log) for log in logs],
            total=count,
        )

    def _apply_audit_log_search_filter(
        self, stmt: Select, entity_type: EntityTypeEnum, search: Optional[str]
    ) -> Select:
        if not search:
            return stmt

        like = f"%{search}%"
        if entity_type == EntityTypeEnum.HOUSE:
            subquery = (
                select(House.id)
                .where(
                    or_(
                        House.street.ilike(like),
                        House.house_number.ilike(like),
                        House.city.ilike(like),
                        House.region.ilike(like),
                    )
                )
                .subquery()
            )
        elif entity_type == EntityTypeEnum.COMPANY:
            subquery = (
                select(Company.id)
                .where(
                    or_(
                        Company.name.ilike(like),
                        Company.address.ilike(like),
                        Company.website.ilike(like),
                    )
                )
                .subquery()
            )
        elif entity_type == EntityTypeEnum.USER:
            subquery = (
                select(User.id)
                .where(
                    or_(
                        User.first_name.ilike(like),
                        User.last_name.ilike(like),
                        User.middle_name.ilike(like),
                        User.email.ilike(like),
                    )
                )
                .subquery()
            )
        else:
            return stmt

        return stmt.where(
            AuditLog.entity_type == entity_type,
            AuditLog.object_id.in_(select(subquery.c.id)),
        )
