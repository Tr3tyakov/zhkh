from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel
from app.infrastructure.common.enums.user import UserAccountStatusEnum


class ChangeAccountStatusContract(BaseSchema):
    account_status: UserAccountStatusEnum

    class Config:
        alias_generator = to_camel
        validate_by_name = True
