from app.application.common.interfaces.base import IContract
from app.domain.common.schemas.base import BaseSchema


class CreateReferenceBookValueContract(IContract, BaseSchema):
    value: str
