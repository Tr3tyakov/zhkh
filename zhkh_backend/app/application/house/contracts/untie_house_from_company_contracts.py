from app.application.common.interfaces.base import IContract
from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class UntieHouseFromCompanyContract(IContract, BaseSchema):
    company_id: int
    house_id: int

    class Config:
        alias_generator = to_camel
        validate_by_name = True
