from typing import (
    Any,
    Awaitable,
    Union,
)

from sqlalchemy.exc import MissingGreenlet
from sqlalchemy.ext.declarative import declarative_base

from app.infrastructure.orm.meta import (
    RELATIONSHIP_PROXIES,
    RelationshipProxyMeta,
)
from app.infrastructure.orm.models.utils.alchemy_model_proxy import SQLAlchemyModelProxy
from app.infrastructure.orm.models.utils.mixins.base_mixins import (
    DeclareMixin,
    IDMixin,
)

Base = declarative_base()


class BaseModel(Base, IDMixin, DeclareMixin, metaclass=RelationshipProxyMeta):
    __abstract__ = True

    def __getattribute__(self, name: str) -> Union[Awaitable[Any], Any]:
        if RelationshipProxyMeta._is_loaded(name):
            return super().__getattribute__(name[1:])

        if name == RELATIONSHIP_PROXIES:
            return super().__getattribute__(name)

        unprotected_name = RelationshipProxyMeta._create_protected_name(name)
        if unprotected_name in self.__relationship_proxies__:
            try:
                value = self.__getattribute__(
                    RelationshipProxyMeta._mark_as_loaded(name)
                )

                return value

            except MissingGreenlet:
                return self._fetch_attribute(name=name)

        return super().__getattribute__(name)

    def __repr__(self):
        return f"{self.__tablename__}_{self.id}"

    async def _fetch_attribute(self, name: str) -> Awaitable[Any]:
        proxy = SQLAlchemyModelProxy()
        await proxy(self, name)

        return self.__getattribute__(RelationshipProxyMeta._mark_as_loaded(name))
