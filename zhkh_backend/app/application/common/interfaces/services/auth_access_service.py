from abc import abstractmethod

from async_fastapi_jwt_auth import AuthJWT

from app.application.common.interfaces.base import IService


class IAuthAccessService(IService):
    @abstractmethod
    async def check_security(self) -> str: ...
    @abstractmethod
    async def is_token_expired(self, authorize: AuthJWT) -> str: ...
