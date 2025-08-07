from app.application.common.interfaces.base import IContract
from app.domain.common.utils import to_camel
from app.domain.user.schemas.user_update_schema import UserUpdateSchema


class UpdateUserInformationContract(IContract, UserUpdateSchema):
    class Config:
        alias_generator = to_camel
        validate_by_name = True
