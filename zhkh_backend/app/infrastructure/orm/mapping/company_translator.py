from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.domain.company.aggregates.company import CompanyAggregate
from app.domain.company.schemas.company_setup_schema import CompanySetupSchema
from app.infrastructure.orm.models.company import Company


class CompanyTranslator(IPersistenceTranslator):
    orm_model = Company
    aggregate = CompanyAggregate

    @classmethod
    def to_domain(cls, model: Company) -> CompanyAggregate:
        return cls.aggregate.setup_company(data=CompanySetupSchema(**model.__dict__))

    @classmethod
    def to_orm(cls, aggregate: CompanyAggregate) -> Company:
        return cls.orm_model(**aggregate.dump())
