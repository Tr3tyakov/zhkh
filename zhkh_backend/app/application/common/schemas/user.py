from typing import Optional

from pydantic import (
    AliasChoices,
    Field,
)

from app.domain.common.schemas.base import BaseSchema


class FirstNameClientSchema(BaseSchema):
    first_name: Optional[str] = Field(
        None,
        validation_alias=AliasChoices("firstName", "first_name"),
        description="Имя пользователя",
    )


class MiddleNameClientSchema(BaseSchema):
    middle_name: Optional[str] = Field(
        None,
        validation_alias=AliasChoices("middleName", "middle_name"),
        description="Фамилия пользователя",
    )


class LastNameClientSchema(BaseSchema):
    last_name: Optional[str] = Field(
        None,
        validation_alias=AliasChoices("lastName", "last_name"),
        description="Отчество пользователя",
    )


class NameSchema(FirstNameClientSchema, MiddleNameClientSchema, LastNameClientSchema):

    def get_full_name(self) -> str:
        name = ""
        if self.last_name is not None:
            name += self.last_name

        if self.first_name is not None:
            name += f" {self.first_name}"

        if self.middle_name is not None:
            name += f" {self.middle_name}"

        return name
