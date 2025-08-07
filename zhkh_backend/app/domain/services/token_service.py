import uuid
from datetime import timedelta

from async_fastapi_jwt_auth import AuthJWT
from dynaconf.utils.boxing import DynaBox
from fastapi import (
    Response,
    status,
)
from starlette.responses import JSONResponse

from app.application.common.interfaces.services.token_service import ITokenService


class TokenService(ITokenService):
    TOKEN_UUID = "token_uuid"
    EMAIL = "email"

    def __init__(self, settings: DynaBox):
        self._settings = settings

    async def generate_token(self, request, user_id: int, email: str) -> Response:
        authorize = AuthJWT(request)
        user_claims = {self.TOKEN_UUID: str(uuid.uuid4()), self.EMAIL: email}

        access_token = await authorize.create_access_token(
            subject=str(user_id),
            user_claims=user_claims,
            expires_time=timedelta(days=self._settings.access_expires_days),
        )
        refresh_token = await authorize.create_refresh_token(
            subject=str(user_id),
            user_claims=user_claims,
            expires_time=timedelta(days=self._settings.access_expires_days),
        )
        response_with_cookie = JSONResponse(
            status_code=status.HTTP_200_OK,
            content=user_id,
        )

        response_with_cookie.set_cookie(
            key=self._settings.access_key,
            value=access_token,
            httponly=False,
            path="/",
            samesite="lax",
            secure=False,
            max_age=self._settings.access_token_max_age,
        )

        response_with_cookie.set_cookie(
            key=self._settings.refresh_key,
            value=refresh_token,
            httponly=True,
            samesite="lax",
            secure=False,
            path="/",
            max_age=self._settings.refresh_token_max_age,
        )

        return response_with_cookie
