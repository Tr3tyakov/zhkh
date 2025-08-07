from app.application.user.schemas.base import UserResponseSchema


class UserSetupSchema(UserResponseSchema):
    password: str
