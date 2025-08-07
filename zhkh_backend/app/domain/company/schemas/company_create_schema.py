from typing import Optional

from app.application.company.schemas.base import CompanyBaseSchema
from app.application.house.schemas.base import HouseBaseSchema


class CompanyCreateSchema(CompanyBaseSchema):
    user_id: int
