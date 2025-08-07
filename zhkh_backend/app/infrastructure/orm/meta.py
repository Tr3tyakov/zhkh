from typing import (
    Any,
    Dict,
)

from sqlalchemy.orm import DeclarativeMeta
from sqlalchemy.orm.relationships import _RelationshipDeclared

RELATIONSHIP_PROXIES = "__relationship_proxies__"
PROXY_LAZY_RELATIONSHIPS = {"select", "selectin"}
MARKER, UNDERLINE = "@", "_"


class RelationshipProxyMeta(DeclarativeMeta):
    """
    Метакласс, ищущий все атрибуты с relationship(lazy="select") и добавляя их в __relationship_proxies__
    """

    def __new__(cls, name: str, bases: Any, dct: Dict[str, Any]):
        if RELATIONSHIP_PROXIES not in dct:
            dct[RELATIONSHIP_PROXIES] = set()

        for attribute_name, attribute_value in dct.items():
            if (
                isinstance(attribute_value, _RelationshipDeclared)
                and attribute_value.lazy in PROXY_LAZY_RELATIONSHIPS
            ):
                dct[RELATIONSHIP_PROXIES].add(
                    cls._create_protected_name(attribute_name)
                )

        return super().__new__(cls, name, bases, dct)

    @classmethod
    def _create_protected_name(cls, field_name: str) -> str:
        return UNDERLINE + field_name

    @classmethod
    def _mark_as_loaded(cls, field_name: str) -> str:
        return MARKER + field_name

    @classmethod
    def _is_loaded(cls, field_name: str) -> bool:
        return field_name.startswith(MARKER)
