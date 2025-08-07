from abc import (
    ABC,
    abstractmethod,
)
from types import ModuleType
from typing import Callable

from app.application.common.interfaces.container import IContainer

InjectorFunction = Callable[[IContainer], None]


class IDependencyInjector(ABC):
    @abstractmethod
    def inject(self) -> None: ...


class IMediatorInjector(ABC):

    @abstractmethod
    def inject(self, handler_module: ModuleType) -> None: ...
