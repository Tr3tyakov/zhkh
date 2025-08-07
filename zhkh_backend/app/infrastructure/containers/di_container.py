from typing import (
    Any,
    List,
    Optional,
    Sequence,
    Type,
    Union,
)

from dependency_injector.containers import DynamicContainer
from dependency_injector.providers import (
    Configuration,
    Factory,
    Resource,
    Singleton,
)

from app.application.common.interfaces.container import (
    IContainer,
    IServiceProvider,
)
from app.infrastructure.containers.utils import transform_to_snake_case


class DIContainer(IContainer):
    def __init__(self):
        self._container = DynamicContainer()

    @property
    def services(self) -> IServiceProvider:
        return ServiceProvider(self._container)

    def wire(
        self,
        packages: Optional[List[str]] = None,
        modules: Optional[List[str]] = None,
    ) -> None:
        self._container.wire(packages=packages, modules=modules)

    def add_singleton(
        self,
        implementation: Type,
        interface: Optional[Type] = None,
        factory: Optional[Union[IServiceProvider, Any]] = None,
        config: Optional[Configuration] = None,
    ) -> None:
        """Регистрирует singleton провайдер"""
        interface = interface or implementation
        provider = self._wrap_provider(implementation, Singleton, factory, config)
        self._register_provider(interface, provider)

    def add_factory(
        self,
        implementation: Type,
        interface: Type,
        config: Optional[Configuration] = None,
    ) -> None:
        """Регистрирует factory провайдер"""
        provider = self._wrap_provider(implementation, Factory, None, config)
        self._register_provider(interface, provider)

    def add_scoped(
        self,
        implementation: Type,
        interface: Type,
        config: Optional[Configuration] = None,
    ) -> None:
        """Регистрирует scoped провайдер"""
        provider = self._wrap_provider(implementation, Resource, None, config)
        self._register_provider(interface, provider)

    def _wrap_provider(
        self,
        implementation: Type,
        provider_cls: Union[Type[Singleton], Type[Factory], Type[Resource]],
        factory: Optional[Union[IServiceProvider, Any]] = None,
        config: Optional[Configuration] = None,
    ) -> Union[Singleton, Factory, Resource]:
        config = config() if config is not None else {}
        if factory is not None:
            return provider_cls(lambda: factory(self.services, **config))
        return provider_cls(implementation, **config)

    def _register_provider(
        self,
        interface: Type,
        provider: Union[Singleton, Factory, Resource],
    ) -> None:
        provider_name = transform_to_snake_case(interface.__name__)
        self._container.set_provider(provider_name, provider)


class ServiceProvider(IServiceProvider):
    def __init__(self, container: DynamicContainer):
        self._container = container

    def resolve(self, type_name: Union[Type, str], call_provider: bool = True) -> Any:
        """Разрешает зависимость по типу или имени"""
        provider_name = (
            type_name
            if isinstance(type_name, str)
            else transform_to_snake_case(type_name.__name__)
        )

        provider = self._container.providers.get(provider_name)
        if provider is None:
            return None

        return provider() if call_provider else provider

    def resolve_all(self, type_names: Sequence[Union[Type, str]]) -> Any:
        return [self.resolve(type_name) for type_name in type_names if type_name]
