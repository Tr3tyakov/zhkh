from starlette.middleware.base import (
    BaseHTTPMiddleware,
    RequestResponseEndpoint,
)
from starlette.requests import Request
from starlette.responses import Response

from app.application.common.interfaces.session_manager import ISessionManager
from app.infrastructure.containers.utils import Provide


class SessionInjectorMiddleware(BaseHTTPMiddleware):

    async def dispatch(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
        session_manager: ISessionManager = Provide[ISessionManager],
    ) -> Response:
        request.state.session_manager = session_manager

        return await call_next(request)
