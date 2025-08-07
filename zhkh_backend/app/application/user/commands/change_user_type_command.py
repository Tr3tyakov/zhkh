from app.application.common.interfaces.request import ICommand
from app.application.user.schemas.validation.check_user_ids import UserIdsSchema
from app.infrastructure.common.enums.user import UserTypeEnum


class ChangeUserTypeCommand(ICommand, UserIdsSchema):
    user_type: UserTypeEnum
