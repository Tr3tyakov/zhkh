from app.application.user.schemas.base import UserBaseSchema


class UserCreateSchema(UserBaseSchema):
    password: str
