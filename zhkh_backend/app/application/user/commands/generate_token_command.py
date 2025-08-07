from fastapi import Request

from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class GenerateTokenCommand(ICommand, BaseSchema):
    request: Request
    user_id: int
    email: str
