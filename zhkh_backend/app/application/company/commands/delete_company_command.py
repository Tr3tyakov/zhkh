from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class DeleteCompanyCommand(ICommand, BaseSchema):
    company_id: int
    user_id: int
