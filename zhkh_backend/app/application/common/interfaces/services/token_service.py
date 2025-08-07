from abc import (
    ABC,
    abstractmethod,
)

from fastapi import Response


class ITokenService(ABC):
    @abstractmethod
    async def generate_token(self, request, user_id: int, email: str) -> Response: ...
