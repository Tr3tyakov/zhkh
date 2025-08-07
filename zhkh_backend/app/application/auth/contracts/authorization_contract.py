from pydantic import EmailStr

from app.application.common.interfaces.base import IContract
from app.domain.common.schemas.base import BaseSchema


class AuthorizationContract(IContract, BaseSchema):
    email: EmailStr
    password: str
