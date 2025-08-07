from app.domain.dependency_injector import add_services
from app.infrastructure.dependency_injector import (
    add_infrastructures,
    add_repositories,
)
from app.infrastructure.injectors.dependency_injector import BaseDependencyInjector


class DependencyInjector(BaseDependencyInjector):
    repositories_implementer = add_repositories
    services_implementer = add_services
    infrastructures_implementer = add_infrastructures
