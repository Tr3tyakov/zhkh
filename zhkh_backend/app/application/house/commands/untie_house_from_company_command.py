from app.application.common.interfaces.request import ICommand
from app.domain.common.schemas.base import BaseSchema


class UntieHouseToCompanyCommand(ICommand, BaseSchema):
    company_id: int
    house_id: int
