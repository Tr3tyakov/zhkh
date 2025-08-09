from typing import (
    List,
    Optional,
)

from fastapi import (
    Depends,
    Request,
)
from fastapi.params import Query

from app.application.common.interfaces.mediator import IMediator
from app.application.house.commands.attach_house_to_company_command import (
    AttachHouseToCompanyCommand,
)
from app.application.house.commands.create_house_command import CreateHouseCommand
from app.application.house.commands.delete_house_command import DeleteHouseCommand
from app.application.house.commands.untie_house_from_company_command import (
    UntieHouseToCompanyCommand,
)
from app.application.house.commands.update_house_command import UpdateHouseCommand
from app.application.house.contracts.attach_house_to_company_contract import (
    AttachHouseToCompanyContract,
)
from app.application.house.contracts.create_house_contract import CreateHouseContract
from app.application.house.contracts.get_houses_contract import (
    HouseQueryParams,
    house_query_params,
)
from app.application.house.contracts.untie_house_from_company_contracts import (
    UntieHouseFromCompanyContract,
)
from app.application.house.contracts.update_house_contract import UpdateHouseContract
from app.application.house.queries.get_all_cities_query import GetHouseCitiesQuery
from app.application.house.queries.get_all_house_regions_query import (
    GetHouseRegionsQuery,
)
from app.application.house.queries.get_attached_houses_query import (
    GetAttachedHousesQuery,
)
from app.application.house.queries.get_house_query import GetHouseQuery
from app.application.house.queries.get_houses_query import GetHousesQuery
from app.application.house.queries.get_unattached_houses_query import GetUnAttachedHousesQuery
from app.application.house.schemas.base import HouseResponseSchema
from app.application.house.schemas.house_fields_schema import HouseFieldSchema
from app.domain.common.schemas.house_regions_schema import GetHouseRegionsResponseSchema
from app.domain.common.schemas.house_response_schema import GetHouseResponseSchema
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.infrastructure.orm.models import House
from app.infrastructure.orm.models.utils.mixins.utils import extract_model_fields
from app.presentation.api.routers.utils import LoggingRouter

house_router = LoggingRouter(prefix="/api", tags=["houses"])


@house_router.post(
    "/house",
    description="Создание дома",
)
@inject_session
@secure(setup_user=True)
async def create_house(
        request: Request,
        data: CreateHouseContract,
        mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(
        CreateHouseCommand(user_id=request.state.user_id, **data.model_dump())
    )


@house_router.put(
    "/houses/{house_id}",
    description="Обновление дома",
)
@inject_session
@secure(setup_user=True)
async def update_house(
        request: Request,
        house_id: int,
        data: UpdateHouseContract,
        mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(
        UpdateHouseCommand(
            user_id=request.state.user_id, house_id=house_id, **data.model_dump()
        )
    )


@house_router.post(
    "/house/attach",
    description="Присоединение дома к компании",
)
@inject_session
@secure()
async def attach_house(
        request: Request,
        data: AttachHouseToCompanyContract,
        mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(AttachHouseToCompanyCommand(**data.model_dump()))


@house_router.post(
    "/house/untie",
    description="Присоединение дома к компании",
)
@inject_session
@secure()
async def attach_house(
        request: Request,
        data: UntieHouseFromCompanyContract,
        mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(UntieHouseToCompanyCommand(**data.model_dump()))


@house_router.get(
    "/houses",
    description="Получение информации по домам",
)
@inject_session
@secure(setup_user=True)
async def get_houses_information(
        request: Request,
        data: HouseQueryParams = Depends(house_query_params),
        mediator: IMediator = Depends(Provide[IMediator]),
) -> GetHouseResponseSchema:
    return await mediator.send(GetHousesQuery(user_id=request.state.user_id, **data.model_dump()))


@house_router.get(
    "/houses/{house_id}",
    description="Получение информации по дому",
)
@inject_session
@secure()
async def get_house_information(
        request: Request,
        house_id: int,
        mediator: IMediator = Depends(Provide[IMediator]),
) -> HouseResponseSchema:
    return await mediator.send(GetHouseQuery(house_id=house_id))


@house_router.get(
    "/houses/attached/{company_id}",
    description="Получение информации по дому",
)
@inject_session
@secure(setup_user=True)
async def get_house_information(
        request: Request,
        company_id: int,
        limit: int = Query(10, ge=1, le=100),
        offset: int = Query(0, ge=0),
        search: Optional[str] = Query(None),
        mediator: IMediator = Depends(Provide[IMediator]),
) -> GetHouseResponseSchema:
    return await mediator.send(
        GetAttachedHousesQuery(
            company_id=company_id, limit=limit, offset=offset, search=search
        )
    )


@house_router.get(
    "/houses-unattached",
    description="Получение информации по дому",
)
@inject_session
@secure()
async def get_unattached_houses(
        request: Request,
        limit: int = Query(10, ge=1, le=100),
        offset: int = Query(0, ge=0),
        search: Optional[str] = Query(None),
        mediator: IMediator = Depends(Provide[IMediator]),
) -> GetHouseResponseSchema:
    return await mediator.send(
        GetUnAttachedHousesQuery(
            limit=limit, offset=offset, address=search
        )
    )


@house_router.get(
    "/regions",
    description="Получение всех существующих регионов",
)
@inject_session
@secure()
async def get_regions(
        request: Request,
        mediator: IMediator = Depends(Provide[IMediator]),
) -> GetHouseRegionsResponseSchema:
    return await mediator.send(GetHouseRegionsQuery())


@house_router.get(
    "/cities",
    description="Получение всех существующих регионов",
)
@inject_session
@secure()
async def get_cities(
        request: Request,
        mediator: IMediator = Depends(Provide[IMediator]),
) -> List[str]:
    return await mediator.send(GetHouseCitiesQuery())


@house_router.put(
    "/houses/{house_id}",
    description="Обновление информации о доме",
)
@inject_session
@secure(setup_user=True)
async def update_house(
        request: Request,
        house_id: int,
        data: UpdateHouseContract,
        mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(
        UpdateHouseCommand(
            house_id=house_id, user_id=request.state.user_id, **data.model_dump()
        )
    )


@house_router.delete(
    "/houses/{house_id}",
    description="Удаление дома",
)
@inject_session
@secure(setup_user=True)
async def delete_house(
        request: Request,
        house_id: int,
        mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(
        DeleteHouseCommand(user_id=request.state.user_id, house_id=house_id)
    )


@house_router.get("/house/fields", summary="Список полей дома")
async def get_excel_fields(request: Request) -> List[HouseFieldSchema]:
    return extract_model_fields(House, exclude={"user_id", "company_id"})
