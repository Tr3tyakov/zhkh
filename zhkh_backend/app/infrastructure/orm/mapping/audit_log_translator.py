from app.domain.audit_log.aggregates.audit_log import AuditLogAggregate
from app.domain.audit_log.schemas.company_setup_schema import AuditLogSetupSchema
from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.infrastructure.orm.models.logs import AuditLog


class AuditLogTranslator(IPersistenceTranslator):
    orm_model = AuditLog
    aggregate = AuditLogAggregate

    @classmethod
    def to_domain(cls, model: AuditLog) -> AuditLogAggregate:
        return cls.aggregate.setup_log(data=AuditLogSetupSchema.model_validate(model))

    @classmethod
    def to_orm(cls, aggregate: AuditLogAggregate) -> AuditLog:
        return cls.orm_model(**aggregate.dump())
