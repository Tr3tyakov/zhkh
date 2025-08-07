from app.application.common.interfaces.ceph import ICeph
from app.application.common.interfaces.request import IRequestHandler
from app.application.user.queries.get_user_query import GetUserQuery
from app.application.user.schemas.user_information_response_schema import (
    UserInformationResponseSchema,
)
from app.domain.common.interfaces.repositories.user_repository import IUserRepository
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetUserHandler(IRequestHandler[GetUserQuery, None]):
    def __init__(
        self,
        ceph: ICeph = Provide[ICeph],
        user_repository: IUserRepository = Provide[IUserRepository],
    ):
        self._ceph = ceph
        self._user_repository = user_repository

    async def handle(
        self, query: GetUserQuery, context: PipelineContext
    ) -> UserInformationResponseSchema:
        user = context.user

        updated_user = await self._user_repository.update_user(user)
        await updated_user.generate_file_path(self._ceph)

        return UserInformationResponseSchema.model_validate(updated_user)
