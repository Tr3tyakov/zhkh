from abc import ABC

from fastapi import FastAPI


class IBaseApplication(ABC):
    def initialize(self) -> FastAPI: ...
