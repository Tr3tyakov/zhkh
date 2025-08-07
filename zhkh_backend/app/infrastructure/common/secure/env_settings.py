from app.config import settings
from app.domain.common.schemas.base import BaseSchema


class ENVSettings(BaseSchema):
    authjwt_secret_key: str = settings.TOKENS.jwt_secret_key
    secret_key: str = settings.TOKENS.secret_key
