from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.domain.house.aggregates.house import HouseAggregate
from app.domain.house.schemas.house_setup_schema import HouseSetupSchema
from app.infrastructure.orm.models.house import House


class HouseTranslator(IPersistenceTranslator):
    orm_model = House
    aggregate = HouseAggregate

    @classmethod
    def to_domain(cls, model: House) -> HouseAggregate:
        return cls.aggregate.setup_house(data=HouseSetupSchema(**model.__dict__))

    @classmethod
    def to_orm(cls, aggregate: HouseAggregate) -> House:
        return cls.orm_model(**aggregate.dump())
