from typing import Optional

from fastapi import (
    Depends,
    File,
    Query,
    Request,
    UploadFile,
)

from app.application.common.interfaces.mediator import IMediator
from app.application.user.commands.change_account_status_command import (
    ChangeAccountStatusCommand,
)
from app.application.user.commands.change_user_avatar_command import (
    ChangeUserAvatarCommand,
)
from app.application.user.commands.change_user_type_command import ChangeUserTypeCommand
from app.application.user.commands.delete_user_command import DeleteUserCommand
from app.application.user.commands.update_user_information_command import (
    UpdateUserInformationCommand,
)
from app.application.user.contracts.change_account_status_contracct import (
    ChangeAccountStatusContract,
)
from app.application.user.contracts.change_user_type_contract import (
    ChangeUserTypeContract,
)
from app.application.user.contracts.update_user_contract import (
    UpdateUserInformationContract,
)
from app.application.user.queries.get_current_user_query import GetCurrentUserQuery
from app.application.user.queries.get_user_query import GetUserQuery
from app.application.user.queries.get_users_query import GetUsersQuery
from app.application.user.schemas.user_information_response_schema import (
    UserInformationResponseSchema,
    UserListResponseSchema,
)
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.common.enums.user import (
    UserAccountStatusEnum,
    UserTypeEnum,
)
from app.infrastructure.containers.utils import Provide
from app.presentation.api.routers.utils import LoggingRouter

user_router = LoggingRouter(prefix="/api", tags=["users"])


@user_router.get(
    "/user",
    description="Получение информации об аккаунте пользователя",
    response_model_exclude={"file_key"},
)
@inject_session
@secure(setup_user=True)
async def get_user(
    request: Request,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> UserInformationResponseSchema:
    return await mediator.send(GetUserQuery(user_id=request.state.user_id))


@user_router.get(
    "/users/{user_id}",
    description="Получение информации об аккаунте пользователя",
    response_model_exclude={"file_key"},
)
@inject_session
@secure()
async def get_current_user(
    request: Request,
    user_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> UserInformationResponseSchema:
    return await mediator.send(GetCurrentUserQuery(user_id=user_id))


@user_router.get(
    "/users",
    description="Получение пользователей системы",
)
@inject_session
@secure(setup_user=True)
async def get_users(
    request: Request,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None, title="Поиск", alias="searchValue"),
    user_type: Optional[UserTypeEnum] = Query(
        None, title="Тип пользователя", alias="userType"
    ),
    account_status: Optional[UserAccountStatusEnum] = Query(
        None, title="Статус аккаунта", alias="accountStatus"
    ),
    mediator: IMediator = Depends(Provide[IMediator]),
) -> UserListResponseSchema:
    return await mediator.send(
        GetUsersQuery(
            user_id=request.state.user_id,
            limit=limit,
            offset=offset,
            user_type=user_type,
            search=search,
            account_status=account_status,
        )
    )


@user_router.put(
    "/user",
    description="Обновление информации об аккаунте пользователя",
)
@inject_session
@secure(setup_user=True)
async def update_user_information(
    request: Request,
    data: UpdateUserInformationContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        UpdateUserInformationCommand(**data.model_dump(), user_id=request.state.user_id)
    )


@user_router.put(
    "/user/{user_id}",
    description="Обновление информации об аккаунте пользователя",
)
@inject_session
@secure()
async def update_user_information(
    request: Request,
    user_id: int,
    data: UpdateUserInformationContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        UpdateUserInformationCommand(**data.model_dump(), user_id=user_id)
    )


@user_router.patch(
    "/users/{user_id}/avatar", description="Обновление аватара пользователя"
)
@inject_session
@secure()
async def change_user_avatar(
    request: Request,
    user_id: int,
    file: UploadFile = File(...),
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(ChangeUserAvatarCommand(user_id=user_id, file=file))


@user_router.delete("/users/{user_id}", description="Удаление пользователя")
@inject_session
@secure(setup_user=True)
async def delete_user(
    request: Request,
    user_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        DeleteUserCommand(user_id=user_id, current_user_id=request.state.user_id)
    )


@user_router.post(
    "/users/{user_id}/user_type", description="Изменение типа пользователя"
)
@inject_session
@secure(setup_user=True)
async def change_user_type(
    request: Request,
    user_id: int,
    data: ChangeUserTypeContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        ChangeUserTypeCommand(
            user_id=user_id, current_user_id=request.state.user_id, **data.model_dump()
        )
    )


@user_router.post(
    "/users/{user_id}/account_status", description="Изменение статуса пользователя"
)
@inject_session
@secure(setup_user=True)
async def change_user_type(
    request: Request,
    user_id: int,
    data: ChangeAccountStatusContract,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        ChangeAccountStatusCommand(
            user_id=user_id, current_user_id=request.state.user_id, **data.model_dump()
        )
    )
