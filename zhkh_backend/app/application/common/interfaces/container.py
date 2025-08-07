from abc import (
    ABC,
    abstractmethod,
)
from typing import (
    Any,
    Optional,
    Sequence,
    Type,
    Union,
)

from app.application.common.interfaces.behavior import IValidator
from app.application.common.interfaces.request import (
    ICommand,
    IQuery,
)
from app.infrastructure.containers.utils import Configuration

IInterface = Optional[Union[Type, ICommand, IQuery]]


class IServiceProvider(ABC):
    @abstractmethod
    def resolve(self, type_name: Type | str, call_provider: bool = False) -> Any: ...

    @abstractmethod
    def resolve_all(self, type_names: Sequence[IValidator]) -> Any: ...


class IContainer(ABC):
    @property
    @abstractmethod
    def services(self) -> IServiceProvider: ...

    @abstractmethod
    def wire(
        self,
        packages: Optional[Sequence[str]] = None,
        modules: Optional[Sequence[str]] = None,
    ) -> None: ...

    @abstractmethod
    def add_singleton(
        self,
        implementation: Type,
        interface: IInterface,
        factory: Optional[Union[IServiceProvider, Any]] = None,
        config: Optional[Configuration] = None,
    ) -> None: ...

    @abstractmethod
    def add_factory(
        self,
        implementation: Type,
        interface: IInterface,
        config: Optional[Configuration] = None,
    ) -> None: ...

    @abstractmethod
    def add_scoped(
        self,
        implementation: Type,
        interface: IInterface,
        config: Optional[Configuration] = None,
    ) -> None: ...
