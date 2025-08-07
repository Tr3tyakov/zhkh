from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import BaseSchema


class GetHouseFilesQuery(IQuery, BaseSchema):
    house_id: int
