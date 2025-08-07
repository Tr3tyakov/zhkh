from functools import wraps
from typing import (
    Any,
    Callable,
)

from fastapi import Request

from app.infrastructure.common.services.auth_access_service import AuthAccessService


def secure(setup_user: bool = False) -> Callable:
    def decorator(fn: Callable) -> Callable:
        @wraps(fn)
        async def wrapper(request: Request, *args, **kwargs) -> Any:
            user_id = await AuthAccessService(request).check_security()
            if setup_user:
                request.state.user_id = user_id

            return await fn(request=request, *args, **kwargs)

        return wrapper

    return decorator
