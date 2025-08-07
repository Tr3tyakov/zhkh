from app.infrastructure.common.enums.base import BaseEnum


class LogTypeEnum(BaseEnum):
    EDIT = "EDIT"
    DELETE = "DELETE"
    ENTER_TO_SYSTEM = "ENTER_TO_SYSTEM"
    EXPORT_DATA = "EXPORT_DATA"
    CREATE = "CREATE"
    ATTACH = "ATTACH"
    UNTIE = "UNTIE"


class EntityTypeEnum(BaseEnum):
    HOUSE = "HOUSE"
    COMPANY = "COMPANY"
    USER = "USER"
    DATA = "DATA"
