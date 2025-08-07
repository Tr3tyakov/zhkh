from app.domain.common.schemas.base import BaseSchema


class HouseFieldSchema(BaseSchema):
    field: str
    description: str
