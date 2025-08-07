from app.domain.common.interfaces.orm_translator import IPersistenceTranslator
from app.domain.user.aggregates.user import UserAggregate
from app.domain.user.schemas.user_setup_schema import UserSetupSchema
from app.infrastructure.orm.models.user import User


class UserTranslator(IPersistenceTranslator):
    orm_model = User
    aggregate = UserAggregate

    @classmethod
    def to_domain(cls, model: User) -> UserAggregate:
        return cls.aggregate.setup_user(data=UserSetupSchema(**model.__dict__))

    @classmethod
    def to_orm(cls, aggregate: UserAggregate) -> User:
        return cls.orm_model(**aggregate.dump(exclude={"file_path"}))
