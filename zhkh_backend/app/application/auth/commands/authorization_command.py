from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class AuthorizationCommand(ICommand, BaseSchema):
    email: str
    password: str
