from dataclasses import dataclass
from datetime import (
    date,
    datetime,
)
from typing import (
    Optional,
    Set,
)

from app.domain.common.interfaces.aggregates import IAggregate
from app.domain.company.schemas.company_create_schema import CompanyCreateSchema
from app.domain.company.schemas.company_setup_schema import CompanySetupSchema
from app.domain.company.schemas.company_update_schema import CompanyUpdateSchema
from app.domain.company.value_objects.inn import INN
from app.domain.company.value_objects.phone import Phone
from app.domain.company.value_objects.website import Website
from app.domain.user.value_objects.email import Email


@dataclass
class CompanyAggregate(IAggregate):
    name: str
    id: Optional[int] = None
    user_id: Optional[int] = None
    legal_form: Optional[str] = None
    inn: Optional[INN] = None
    address: Optional[str] = None

    phone: Optional[Phone] = None
    email: Optional[Email] = None
    website: Optional[Website] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def create_company(cls, data: CompanyCreateSchema) -> "CompanyAggregate":
        return cls(
            **data.model_dump(exclude={"email", "phone", "website", "inn"}),
            email=Email(data.email),
            phone=Phone(data.phone),
            website=Website(data.website),
            inn=INN(data.inn),
        )

    @classmethod
    def setup_company(cls, data: CompanySetupSchema) -> "CompanyAggregate":
        return cls(**data.model_dump())

    def update_company(self, data: CompanyUpdateSchema) -> None:
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(self, field, value)

    def dump(self, exclude: Optional[Set[str]] = None) -> dict:
        serializers = {
            Email: lambda v: v.value,
            Phone: lambda v: v.value,
            Website: lambda v: v.value,
            INN: lambda v: v.value,
        }

        result = {}
        for field in self.__dataclass_fields__:
            if exclude and field in exclude:
                continue

            value = getattr(self, field)
            for typ, func in serializers.items():
                if isinstance(value, typ):
                    value = func(value)
                    break

            result[field] = value

        return result
