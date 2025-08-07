import re
from typing import Type

from dependency_injector.wiring import Provide as DependencyInjectorProvide


def transform_to_snake_case(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


class Provide:
    def __class_getitem__(cls, _class: Type) -> Type:
        provider = transform_to_snake_case(_class.__name__)
        return DependencyInjectorProvide[provider]


class Configuration:

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def __call__(self):
        return self.__dict__
