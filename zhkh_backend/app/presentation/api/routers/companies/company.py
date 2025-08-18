from typing import Optional

from fastapi import (
    Depends,
    Query,
    Request,
)

from app.application.common.interfaces.mediator import IMediator
from app.application.company.commands.create_company_command import CreateCompanyCommand
from app.application.company.commands.delete_company_command import DeleteCompanyCommand
from app.application.company.commands.update_company_command import UpdateCompanyCommand
from app.application.company.contracts.create_company_contract import (
    CreateCompanyContract,
)
from app.application.company.contracts.update_company_contract import (
    UpdateCompanyContract,
)
from app.application.company.queries.get_companies_query import GetCompaniesQuery
from app.application.company.queries.get_company_query import GetCompanyQuery
from app.application.company.schemas.base import CompanyResponseSchema
from app.domain.company.schemas.company_response_schema import GetCompanyResponseSchema
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

company_router = LoggingRouter(prefix="/api", tags=["companies"])


@company_router.post(
    "/company",
    description="Создание компании",
)
@inject_session
@secure(setup_user=True)
async def create_company(
    request: Request,
    data: CreateCompanyContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        CreateCompanyCommand(user_id=request.state.user_id, **data.model_dump())
    )


@company_router.get(
    "/companies/{company_id}",
    description="Получение информации по компании",
)
@inject_session
@secure()
async def get_company_information(
    request: Request,
    company_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> CompanyResponseSchema:
    return await mediator.send(GetCompanyQuery(company_id=company_id))


@company_router.get(
    "/companies",
    description="Получение информации по компаниям",
)
@inject_session
@secure(setup_user=True)
async def get_companies_information(
    request: Request,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    mediator: IMediator = Depends(Provide[IMediator]),
) -> GetCompanyResponseSchema:
    return await mediator.send(
        GetCompaniesQuery(
            user_id=request.state.user_id, limit=limit, offset=offset, search=search
        )
    )


@company_router.put(
    "/companies/{company_id}",
    description="Обновление информации о компании",
)
@inject_session
@secure()
async def update_company(
    request: Request,
    company_id: int,
    data: UpdateCompanyContract,
    mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(
        UpdateCompanyCommand(company_id=company_id, **data.model_dump())
    )


@company_router.delete(
    "/companies/{company_id}",
    description="Удаление дома",
)
@inject_session
@secure(setup_user=True)
async def delete_company(
    request: Request,
    company_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
):
    return await mediator.send(
        DeleteCompanyCommand(user_id=request.state.user_id, company_id=company_id)
    )
