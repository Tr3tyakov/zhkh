import re
from dataclasses import dataclass
from http.client import HTTPException

INN_REGEX = re.compile(r"^\d{10}(\d{2})?$")


@dataclass(frozen=True)
class INN:
    value: str

    def __post_init__(self):
        if not INN_REGEX.match(self.value):
            raise HTTPException(f"Invalid INN: {self.value}")
