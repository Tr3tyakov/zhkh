from app.domain.common.schemas.base import BaseSchema


class ReferenceBookBaseSchema(BaseSchema):
    name: str


class ReferenceBookResponseSchema(ReferenceBookBaseSchema):
    id: int
