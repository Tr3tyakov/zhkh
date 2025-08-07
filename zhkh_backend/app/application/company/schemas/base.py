from datetime import (
    date,
    datetime,
)
from typing import Optional

from pydantic import Field

from app.domain.common.schemas.base import BaseSchema
from app.domain.common.utils import to_camel


class CompanyBaseSchema(BaseSchema):
    name: str = Field(..., description="Название УК")
    legal_form: Optional[str] = Field(None, description="Форма организации (ООО, АО)")
    inn: Optional[str] = Field(None, description="ИНН")
    address: Optional[str] = Field(None, description="Юридический адрес")

    phone: Optional[str] = Field(None, description="Телефон")
    email: Optional[str] = Field(None, description="Почта")
    website: Optional[str] = Field(None, description="Сайт")

    class Config:
        alias_generator = to_camel
        validate_by_name = True


class CompanyResponseSchema(CompanyBaseSchema):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        alias_generator = to_camel
        validate_by_name = True
