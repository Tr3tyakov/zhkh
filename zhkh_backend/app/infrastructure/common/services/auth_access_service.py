from async_fastapi_jwt_auth import AuthJWT
from fastapi import (
    HTTPException,
    Request,
    status,
)

from app.application.common.interfaces.redis import IRedis
from app.application.common.interfaces.services.auth_access_service import (
    IAuthAccessService,
)
from app.infrastructure.common.exception.validation_detail import ValidationReasonType
from app.infrastructure.containers.utils import Provide


class AuthAccessService(IAuthAccessService):
    def __init__(self, request: Request, redis: IRedis = Provide[IRedis]):
        self._request = request
        self._redis = redis

    async def check_security(self) -> str:
        authorize = AuthJWT(self._request)
        if await self.is_token_expired(authorize=authorize):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=ValidationReasonType.ACCESS_UNAVAILABLE,
            )

        return await self._get_user_id(authorize)

    async def is_token_expired(self, authorize: AuthJWT) -> str:
        await authorize.jwt_required()
        jwt = await authorize.get_raw_jwt()
        if not jwt.get("user_id") and not jwt.get("email"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Токен недействителен"
            )

        return await self._redis.get(jwt["token_uuid"])

    async def _get_user_id(self, authorize: AuthJWT) -> str:
        jwt = await authorize.get_raw_jwt()
        return jwt.get("sub")
