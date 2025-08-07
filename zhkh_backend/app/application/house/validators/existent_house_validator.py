from operator import eq
from typing import Any

from fastapi import status

from app.application.common.behaviors.validation_behavior import ValidationBehaviorError
from app.application.common.interfaces.behavior import IValidator
from app.application.house.commands.attach_house_to_company_command import (
    AttachHouseToCompanyCommand,
)
from app.application.house.commands.create_house_file_command import (
    CreateHouseFileCommand,
)
from app.application.house.commands.delete_house_command import DeleteHouseCommand
from app.application.house.commands.untie_house_from_company_command import (
    UntieHouseToCompanyCommand,
)
from app.application.house.commands.update_house_command import UpdateHouseCommand
from app.application.house.queries.get_house_query import GetHouseQuery
from app.domain.common.interfaces.repositories.house_repository import IHouseRepository
from app.domain.house.value_objects.filters.house_filter import HouseFilter
from app.infrastructure.common.exception.exception_detail import ExceptionDetail
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class ExistentHouseByIdValidator(IValidator):
    SUPPORTED = (
        DeleteHouseCommand,
        UpdateHouseCommand,
        GetHouseQuery,
        AttachHouseToCompanyCommand,
        UntieHouseToCompanyCommand,
        CreateHouseFileCommand,
    )

    def __init__(
        self,
        house_repository: IHouseRepository = Provide[IHouseRepository],
    ):
        self._house_repository = house_repository

    async def validate(self, data: Any, context: PipelineContext) -> None:
        house = await self._house_repository.get_houses(
            filters=HouseFilter(id=(eq, data.house_id))
        )

        if house is None:
            raise ValidationBehaviorError(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ExceptionDetail(
                    field="id",
                    value=data.house_id,
                    error=ValidationReasonType.ENTITY_NOT_FOUND,
                ),
            )

        context.house = house
