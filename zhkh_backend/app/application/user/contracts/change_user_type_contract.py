from app.application.common.interfaces.base import IContract
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel
from app.infrastructure.common.enums.user import UserTypeEnum


class ChangeUserTypeContract(IContract, BaseSchema):
    user_type: UserTypeEnum

    class Config:
        alias_generator = to_camel
        validate_by_name = True
