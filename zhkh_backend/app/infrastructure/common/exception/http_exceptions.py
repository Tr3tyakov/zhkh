import logging
from typing import Union

from fastapi import (
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.utils import is_body_allowed_for_status_code
from starlette.responses import JSONResponse


def auth_exception_handler(*_args, **_kwargs) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Для доступа к данной странице необходимо авторизоваться"},
    )


def logging_http_exception_handler(
    request: Request, exc: Exception
) -> Union[JSONResponse, Response]:
    logging.exception(exc)

    headers = getattr(exc, "headers", None)

    if isinstance(exc, HTTPException):
        if not is_body_allowed_for_status_code(exc.status_code):
            return Response(status_code=exc.status_code, headers=headers)

        return JSONResponse(
            {"detail": exc.detail}, status_code=exc.status_code, headers=headers
        )

    return JSONResponse(
        {"detail": exc},
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        headers=headers,
    )
