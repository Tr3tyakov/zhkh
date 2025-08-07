from operator import eq
from typing import Any

from fastapi import status

from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.company.commands.delete_company_command import DeleteCompanyCommand
from app.application.company.commands.update_company_command import UpdateCompanyCommand
from app.application.company.queries.get_company_query import GetCompanyQuery
from app.application.house.commands.attach_house_to_company_command import (
    AttachHouseToCompanyCommand,
)
from app.application.house.commands.untie_house_from_company_command import (
    UntieHouseToCompanyCommand,
)
from app.application.house.queries.get_attached_houses_query import (
    GetAttachedHousesQuery,
)
from app.domain.common.interfaces.repositories.company_repository import (
    ICompanyRepository,
)
from app.domain.company.value_objects.filters.company_filter import CompanyFilter
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ExistentCompanyByIdValidator(IValidator):
    SUPPORTED = (
        DeleteCompanyCommand,
        UpdateCompanyCommand,
        GetCompanyQuery,
        GetAttachedHousesQuery,
        AttachHouseToCompanyCommand,
        UntieHouseToCompanyCommand,
    )

    def __init__(
        self, company_repository: ICompanyRepository = Provide[ICompanyRepository]
    ):
        self._company_repository = company_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        company = await self._company_repository.get_company(
            filters=CompanyFilter(id=(eq, data.company_id)),
        )

        if company is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="company_id",
                    value=data.company_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                ),
            )

        context.company = company
