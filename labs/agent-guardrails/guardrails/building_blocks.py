"""Tool schemas and deterministic request validation."""

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .errors import RequestValidationError
from .models import ToolRequest

SYNTHETIC_RECORD_ID = re.compile(r"^SYN-[A-Z0-9-]{1,64}$")
SAFE_FIXTURE_PATH = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/-]{0,255}$")
STATE_CHANGING_TOOLS = frozenset({"delete_records"})


def is_safe_fixture_path(path: str) -> bool:
    """Allow only plain relative paths: no dot segments, escapes or odd bytes."""
    if not SAFE_FIXTURE_PATH.fullmatch(path):
        return False
    return not any(
        part in {"", ".", ".."} or part.startswith(".")
        for part in path.split("/")
    )


@dataclass(frozen=True)
class ToolSchema:
    parameter_types: tuple[tuple[str, type], ...]

    @property
    def fields(self) -> frozenset[str]:
        return frozenset(name for name, _ in self.parameter_types)


TOOL_SCHEMAS = {
    "read_fixture": ToolSchema((("path", str),)),
    "validate_schema": ToolSchema((("document", dict),)),
    "delete_records": ToolSchema((("record_ids", list),)),
}


def validate_request_schema(request: ToolRequest) -> None:
    schema = TOOL_SCHEMAS.get(request.tool)
    if schema is None:
        raise RequestValidationError(f"Unknown tool: {request.tool}")

    parameters = request.parameters
    if frozenset(parameters) != schema.fields:
        raise RequestValidationError(
            f"Parameters for {request.tool} must be exactly {sorted(schema.fields)}"
        )
    for name, expected_type in schema.parameter_types:
        if not isinstance(parameters[name], expected_type):
            raise RequestValidationError(
                f"Parameter {name} for {request.tool} must be {expected_type.__name__}"
            )

    if request.tool == "read_fixture":
        path_value: str = parameters["path"]
        if Path(path_value).is_absolute() or not is_safe_fixture_path(path_value):
            raise RequestValidationError(
                "Fixture path must be a safe relative path without dot segments"
            )
    elif request.tool == "delete_records":
        record_ids: list[Any] = parameters["record_ids"]
        if not record_ids or len(record_ids) > 100:
            raise RequestValidationError("record_ids must contain 1 to 100 items")
        if any(
            not isinstance(record_id, str)
            or not SYNTHETIC_RECORD_ID.fullmatch(record_id)
            for record_id in record_ids
        ):
            raise RequestValidationError(
                "delete_records accepts synthetic SYN-* identifiers only"
            )
        if len(set(record_ids)) != len(record_ids):
            raise RequestValidationError("record_ids must not contain duplicates")
