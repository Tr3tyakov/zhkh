from typing import Optional

from app.application.common.interfaces.container import IContainer
from app.application.common.interfaces.injectors import (
    IDependencyInjector,
    InjectorFunction,
)


class BaseDependencyInjector(IDependencyInjector):
    services_implementer: Optional[InjectorFunction] = None
    repositories_implementer: Optional[InjectorFunction] = None
    infrastructures_implementer: Optional[InjectorFunction] = None

    def __init__(self, container: IContainer):
        self._container = container

    def inject(self) -> None:
        for adder in (
            self._add_repositories,
            self._add_services,
            self._add_infrastructures,
        ):
            adder()

    def _add_repositories(self) -> IDependencyInjector:
        return self._add_dependency(self.repositories_implementer)

    def _add_services(self) -> IDependencyInjector:
        return self._add_dependency(self.services_implementer)

    def _add_infrastructures(self) -> IDependencyInjector:
        return self._add_dependency(self.infrastructures_implementer)

    def _add_dependency(
        self, implementer: Optional[InjectorFunction]
    ) -> IDependencyInjector:
        if implementer:
            implementer(self._container)
        return self
