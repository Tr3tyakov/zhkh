from app.application.common.interfaces.request import ICommand
from app.application.common.schemas.user import NameSchema


class RegistrationCommand(ICommand, NameSchema):
    email: str
    password: str
