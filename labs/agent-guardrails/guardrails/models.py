"""Immutable request and capability models."""

import hashlib
import json
import re
from collections.abc import Mapping
from dataclasses import dataclass, field
from typing import Any

from .errors import RequestValidationError

IDENTIFIER = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")
REQUEST_FIELDS = frozenset({"request_id", "tool", "parameters", "provenance"})


def canonical_json(value: Any) -> str:
    """Return deterministic JSON and reject values JSON cannot safely represent."""
    try:
        return json.dumps(
            value,
            allow_nan=False,
            ensure_ascii=False,
            separators=(",", ":"),
            sort_keys=True,
        )
    except (TypeError, ValueError) as error:
        raise RequestValidationError("Request is not valid JSON data") from error


@dataclass(frozen=True)
class ToolRequest:
    request_id: str
    tool: str
    parameters_json: str = field(repr=False)
    provenance: tuple[str, ...]

    @classmethod
    def from_mapping(cls, payload: Mapping[str, Any]) -> "ToolRequest":
        if not isinstance(payload, Mapping):
            raise RequestValidationError("Request must be a JSON object")
        if any(not isinstance(field, str) for field in payload):
            raise RequestValidationError("Request field names must be strings")
        fields = frozenset(payload)
        if fields != REQUEST_FIELDS:
            missing = sorted(REQUEST_FIELDS - fields)
            unknown = sorted(fields - REQUEST_FIELDS)
            raise RequestValidationError(
                f"Request fields do not match the schema; missing={missing}, unknown={unknown}"
            )

        request_id = payload["request_id"]
        tool = payload["tool"]
        parameters = payload["parameters"]
        provenance = payload["provenance"]

        if not isinstance(request_id, str) or not IDENTIFIER.fullmatch(request_id):
            raise RequestValidationError("request_id has an invalid format")
        if not isinstance(tool, str) or not IDENTIFIER.fullmatch(tool):
            raise RequestValidationError("tool has an invalid format")
        if not isinstance(parameters, dict):
            raise RequestValidationError("parameters must be an object")
        if (
            not isinstance(provenance, list)
            or not provenance
            or len(provenance) > 20
            or any(
                not isinstance(item, str)
                or not item
                or len(item) > 256
                for item in provenance
            )
        ):
            raise RequestValidationError(
                "provenance must contain 1 to 20 non-empty source identifiers"
            )

        return cls(
            request_id=request_id,
            tool=tool,
            parameters_json=canonical_json(parameters),
            provenance=tuple(provenance),
        )

    @property
    def parameters(self) -> dict[str, Any]:
        """Return a fresh copy so callers cannot mutate the canonical request."""
        return json.loads(self.parameters_json)

    def as_mapping(self) -> dict[str, Any]:
        return {
            "request_id": self.request_id,
            "tool": self.tool,
            "parameters": self.parameters,
            "provenance": list(self.provenance),
        }

    @property
    def request_hash(self) -> str:
        encoded = canonical_json(self.as_mapping()).encode("utf-8")
        return hashlib.sha256(encoded).hexdigest()


@dataclass(frozen=True)
class AuthorizedCapability:
    request: ToolRequest
    authorization_id: str
    approval_id: str | None
    issued_at: str
    signature: str
