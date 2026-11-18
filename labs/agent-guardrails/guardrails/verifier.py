"""Independent state and result checks before outputs cross the boundary."""

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .errors import ExecutionError
from .models import ToolRequest
from .tools import resolve_within

SHA256 = re.compile(r"^[0-9a-f]{64}$")


@dataclass(frozen=True)
class ExecutionSnapshot:
    content: str | None = None
    record_ids: tuple[str, ...] = ()


def capture_state(
    request: ToolRequest,
    fixture_root: Path,
    writable_root: Path,
) -> ExecutionSnapshot:
    parameters = request.parameters
    if request.tool == "read_fixture":
        target = resolve_within(fixture_root, parameters["path"])
        if not target.is_file():
            raise ExecutionError("Verifier cannot find the requested fixture")
        return ExecutionSnapshot(content=target.read_text(encoding="utf-8"))
    if request.tool == "validate_schema":
        content = json.dumps(
            parameters["document"],
            allow_nan=False,
            sort_keys=True,
        )
        return ExecutionSnapshot(content=content)
    if request.tool == "delete_records":
        target = resolve_within(writable_root, "records.json")
        try:
            records = json.loads(target.read_text(encoding="utf-8"))
            record_ids = tuple(record["record_id"] for record in records)
        except (OSError, json.JSONDecodeError, KeyError, TypeError) as error:
            raise ExecutionError("Verifier cannot read the synthetic record state") from error
        return ExecutionSnapshot(record_ids=record_ids)
    raise ExecutionError("No state capture exists for the requested tool")


def require_exact_fields(result: Any, fields: set[str]) -> dict[str, Any]:
    if not isinstance(result, dict) or set(result) != fields:
        raise ExecutionError(f"Tool result must contain exactly {sorted(fields)}")
    return result


def verify_result(
    request: ToolRequest,
    result: Any,
    snapshot: ExecutionSnapshot,
    writable_root: Path,
) -> None:
    parameters = request.parameters
    if request.tool == "read_fixture":
        checked = require_exact_fields(result, {"path", "sha256", "content"})
        content = snapshot.content
        if (
            content is None
            or checked["path"] != parameters["path"]
            or checked["content"] != content
            or checked["sha256"]
            != hashlib.sha256(content.encode("utf-8")).hexdigest()
        ):
            raise ExecutionError("read_fixture returned an invalid result")
    elif request.tool == "validate_schema":
        checked = require_exact_fields(result, {"valid", "keys", "sha256"})
        content = snapshot.content
        if (
            content is None
            or checked["valid"] is not True
            or checked["keys"] != sorted(parameters["document"])
            or checked["sha256"]
            != hashlib.sha256(content.encode("utf-8")).hexdigest()
        ):
            raise ExecutionError("validate_schema returned an invalid result")
    elif request.tool == "delete_records":
        checked = require_exact_fields(
            result,
            {"deleted", "remaining", "records_sha256"},
        )
        target = resolve_within(writable_root, "records.json")
        try:
            content = target.read_text(encoding="utf-8")
            records = json.loads(content)
            actual_ids = tuple(record["record_id"] for record in records)
        except (OSError, json.JSONDecodeError, KeyError, TypeError) as error:
            raise ExecutionError("Verifier cannot read the resulting record state") from error
        deleted = set(parameters["record_ids"])
        expected_ids = tuple(
            record_id for record_id in snapshot.record_ids if record_id not in deleted
        )
        if (
            actual_ids != expected_ids
            or checked["deleted"] != sorted(deleted)
            or checked["remaining"] != len(expected_ids)
            or checked["records_sha256"]
            != hashlib.sha256(content.encode("utf-8")).hexdigest()
        ):
            raise ExecutionError("delete_records returned an invalid result or state")
    else:
        raise ExecutionError("No verifier exists for the requested tool")

    if not isinstance(result.get("sha256", result.get("records_sha256", "")), str):
        raise ExecutionError("Tool result hash has an invalid type")
    result_hash = result.get("sha256", result.get("records_sha256"))
    if result_hash is not None and not SHA256.fullmatch(result_hash):
        raise ExecutionError("Tool result hash has an invalid format")
