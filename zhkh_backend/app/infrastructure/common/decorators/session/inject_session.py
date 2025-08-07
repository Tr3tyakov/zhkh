from functools import wraps
from typing import (
    Any,
    Callable,
    cast,
)

from dependency_injector.wiring import (
    F,
    _fetch_reference_injections,
    _get_patched,
)
from fastapi import Request


def inject_session(fn: F) -> Callable:
    """
    Требует наличие SessionInjectorMiddleware в миддлваре
    (Открывает транзакцию сразу в начале вызова эндпоинта)
    """
    reference_injections, reference_closing = _fetch_reference_injections(fn)
    patched = _get_patched(fn, reference_injections, reference_closing)
    fn = cast(F, patched)

    @wraps(fn)
    async def wrapper(request: Request, *args, **kwargs) -> Any:
        session_manager = request.state.session_manager
        async with session_manager.setup_session():
            return await fn(request, *args, **kwargs)

    return wrapper
