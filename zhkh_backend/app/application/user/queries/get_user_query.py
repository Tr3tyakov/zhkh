from app.application.common.interfaces.request import IQuery
from app.domain.common.schemas.base import BaseSchema


class GetUserQuery(IQuery, BaseSchema):
    user_id: int
