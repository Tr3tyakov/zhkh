from app.application.common.interfaces.request import IRequestHandler
from app.application.user.queries.get_users_query import GetUsersQuery
from app.application.user.schemas.user_information_response_schema import (
    UserListResponseSchema,
)
from app.domain.common.interfaces.repositories.queries.user_query_repository import (
    IUserQueryRepository,
)
from app.infrastructure.containers.utils import Provide
from app.infrastructure.mediator.pipline_context import PipelineContext


class GetUsersHandler(IRequestHandler[GetUsersQuery, None]):
    def __init__(
        self,
        user_query_repository: IUserQueryRepository = Provide[IUserQueryRepository],
    ):
        self._user_query_repository = user_query_repository

    async def handle(
        self, query: GetUsersQuery, context: PipelineContext
    ) -> UserListResponseSchema:
        return await self._user_query_repository.get_users(**query.model_dump())
