from fastapi import (
    Depends,
    File,
    Form,
    Request,
    UploadFile,
)

from app.application.common.interfaces.mediator import IMediator
from app.application.house.commands.create_house_file_command import (
    CreateHouseFileCommand,
)
from app.application.house.commands.delete_house_file_command import (
    DeleteHouseFileCommand,
)
from app.application.house.queries.get_house_file_query import GetHouseFilesQuery
from app.infrastructure.common.decorators.secure import secure
from app.infrastructure.common.decorators.session.inject_session import inject_session
from app.infrastructure.common.enums.user import FileCategoryEnum
from app.infrastructure.containers.utils import Provide
from app.presentation.api import house_router


@house_router.post(
    "/houses/{house_id}/house_files",
    description="Создание файла для дома",
)
@inject_session
@secure()
async def create_house_file(
    request: Request,
    house_id: int,
    category_type: FileCategoryEnum = Form(..., alias="categoryType"),
    file: UploadFile = File(...),
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        CreateHouseFileCommand(
            category_type=category_type,
            file=file,
            house_id=house_id,
        )
    )


@house_router.delete(
    "/house_files/{file_id}",
    description="Удаление файла для дома",
)
@inject_session
@secure(setup_user=True)
async def delete_house_file(
    request: Request,
    file_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(DeleteHouseFileCommand(file_id=file_id))


@house_router.get(
    "/houses/{house_id}/house_files",
    description="Получение файлов для дома",
)
@inject_session
@secure(setup_user=True)
async def get_house_files(
    request: Request,
    house_id: int,
    mediator: IMediator = Depends(Provide[IMediator]),
) -> None:
    return await mediator.send(
        GetHouseFilesQuery(
            house_id=house_id,
        )
    )
