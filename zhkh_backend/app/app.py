import logging
import tomllib
from contextlib import asynccontextmanager
from logging.config import dictConfig
from types import ModuleType
from typing import (
    List,
    T,
    Tuple,
    Type,
)

from async_fastapi_jwt_auth import AuthJWT
from async_fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi import (
    FastAPI,
    HTTPException,
)
from starlette.middleware.cors import CORSMiddleware

from app import application as application_module
from app.application.common.interfaces.postgres import IDatabase
from app.application.common.interfaces.redis import IRedis
from app.config import settings
from app.domain.common.schemas.base import BaseSchema
from app.infrastructure.base_application import IBaseApplication
from app.infrastructure.common.exception.http_exceptions import (
    auth_exception_handler,
    logging_http_exception_handler,
)
from app.infrastructure.common.middlewares.session_injector_middleware import (
    SessionInjectorMiddleware,
)
from app.infrastructure.common.secure.env_settings import ENVSettings
from app.infrastructure.containers.di_container import DIContainer
from app.infrastructure.containers.validator_container import ValidationContainer
from app.infrastructure.injectors.dependency_injector import BaseDependencyInjector
from app.infrastructure.injectors.mediator_injector import MediatorInjector
from app.injectors import DependencyInjector
from app.presentation.api import ROUTERS
from app.presentation.api.routers.utils import LoggingRouter


class App(IBaseApplication):
    TITLE: str = "API"
    PACKAGES = ["app"]

    def __init__(
        self,
        container: DIContainer,
        validation_container: ValidationContainer,
        modules: Tuple[ModuleType],
        env_settings: Type[BaseSchema],
        dependency_injector: Type[BaseDependencyInjector],
        routers: List[LoggingRouter],
    ):
        self._env_settings = env_settings
        self._routers = routers
        self._modules = modules
        self._dependency_injector = dependency_injector
        self._di_container = container
        self._validation_container = validation_container

        self._set_versions()
        self._app = FastAPI(
            lifespan=self.lifespan,
            title=self.TITLE,
            version=self.SERVICE_VERSION,
        )
        self._init_containers()

    @asynccontextmanager
    async def lifespan(self, _):
        database = self._get_provider(IDatabase)
        redis = self._get_provider(IRedis)
        database.connect()
        await redis.connect()
        yield
        await database.close()
        await redis.close()

    def _init_containers(self) -> None:
        """
        Инициализация контейнеров
        """
        # Добавляем инфраструктуру в контейнер
        self._dependency_injector(self._di_container).inject()
        MediatorInjector(self._di_container, self._validation_container).inject(
            self._modules
        )
        # Проводим пакеты, содержащие файлы, в которых требуется инъекция
        self._di_container.wire(packages=self.PACKAGES)

    def _add_middlewares(self) -> None:
        """
        Добавление посредников
        """
        self._app.add_middleware(
            CORSMiddleware,
            allow_origins=[
                "http://frontend:5173",
                "http://frontend:3000",
                "http://localhost:3000",
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ],
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allow_headers=["*"],
        )
        self._app.add_middleware(SessionInjectorMiddleware)

    def _set_versions(self) -> None:
        """
        Получение версии из pyproject.toml
        """
        with open("pyproject.toml", "rb") as f:
            data = tomllib.load(f)
            poetry = data["tool"]["poetry"]

            self.SERVICE_VERSION = poetry["version"]

    def _add_exception_handlers(self) -> None:
        self._app.add_exception_handler(AuthJWTException, auth_exception_handler)
        self._app.add_exception_handler(HTTPException, logging_http_exception_handler)

    def _add_routers(self) -> None:
        """
        Добавление роутеров
        """
        for router in self._routers:
            self._app.include_router(router)

    def _get_provider(self, provider_type: Type[T]) -> T:
        return self._di_container.services.resolve(provider_type)

    def _load_env_config(self):
        """
        Загрузка env конфига
        """
        AuthJWT.load_config(self._env_settings)

    def initialize(self) -> FastAPI:
        """
        Инициализация зависимостей
        """
        self._add_routers()
        self._add_middlewares()
        self._load_env_config()
        self._add_exception_handlers()
        dictConfig(settings.LOGGING)
        logging.info(
            "Сервис запущен, версия сервиса: %s",
            self.SERVICE_VERSION,
        )

        return self._app


def start_app() -> FastAPI:
    return App(
        container=DIContainer(),
        validation_container=ValidationContainer(),
        modules=(application_module,),
        env_settings=ENVSettings,
        dependency_injector=DependencyInjector,
        routers=ROUTERS,
    ).initialize()
