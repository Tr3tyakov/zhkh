from app.domain.common.schemas.base import BaseSchema


class ReferenceBookValueBaseSchema(BaseSchema):
    value: str


class ReferenceBookValueResponseSchema(ReferenceBookValueBaseSchema):
    id: int
