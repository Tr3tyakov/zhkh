from app.infrastructure.common.enums.base import BaseEnum


class UserTypeEnum(BaseEnum):
    USER = "USER"
    ADMIN = "ADMIN"


class UserAccountStatusEnum(BaseEnum):
    ACTIVE = "ACTIVE"
    BLOCKED = "BLOCKED"


class FileCategoryEnum(BaseEnum):
    INSPECTION_RESULT = "INSPECTION_RESULT"  # результаты обследования
    TECHNICAL_PASSPORT = "TECHNICAL_PASSPORT"  # технические паспорта
    DESIGN_DOCUMENTATION = (
        "DESIGN_DOCUMENTATION"  # проектная документация (при наличии)
    )
    CAPITAL_REPAIR_PROJECT = "CAPITAL_REPAIR_PROJECT"  # проекты капитального ремонта
