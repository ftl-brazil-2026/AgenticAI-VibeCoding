"""Small, explicitly dispatched tools for synthetic lab data."""

import hashlib
import json
import os
import tempfile
from pathlib import Path
from typing import Any

from .building_blocks import SYNTHETIC_RECORD_ID
from .errors import ExecutionError

MAX_FIXTURE_BYTES = 1_000_000


def resolve_within(root: Path, relative_path: str) -> Path:
    root = root.resolve()
    candidate = (root / relative_path).resolve()
    try:
        candidate.relative_to(root)
    except ValueError as error:
        raise ExecutionError("Path escapes the configured root") from error
    return candidate


def read_fixture(fixture_root: Path, path: str) -> dict[str, Any]:
    target = resolve_within(fixture_root, path)
    if not target.is_file():
        raise ExecutionError("Fixture does not exist")
    if target.stat().st_size > MAX_FIXTURE_BYTES:
        raise ExecutionError("Fixture exceeds the one-megabyte lab limit")
    content = target.read_text(encoding="utf-8")
    return {
        "path": str(Path(path)),
        "sha256": hashlib.sha256(content.encode("utf-8")).hexdigest(),
        "content": content,
    }


def validate_document(document: dict[str, Any]) -> dict[str, Any]:
    encoded = json.dumps(document, allow_nan=False, sort_keys=True)
    return {
        "valid": True,
        "keys": sorted(document),
        "sha256": hashlib.sha256(encoded.encode("utf-8")).hexdigest(),
    }


def delete_records(writable_root: Path, record_ids: list[str]) -> dict[str, Any]:
    target = resolve_within(writable_root, "records.json")
    if not target.is_file():
        raise ExecutionError("Writable records.json has not been initialized")

    try:
        records = json.loads(target.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ExecutionError("Writable records.json is invalid") from error
    if not isinstance(records, list) or any(
        not isinstance(record, dict)
        or not isinstance(record.get("record_id"), str)
        or not SYNTHETIC_RECORD_ID.fullmatch(record["record_id"])
        for record in records
    ):
        raise ExecutionError("Writable records.json has an invalid schema")
    record_ids_in_file = [record["record_id"] for record in records]
    if len(record_ids_in_file) != len(set(record_ids_in_file)):
        raise ExecutionError("Writable records.json contains duplicate identifiers")

    wanted = set(record_ids)
    deleted = [record["record_id"] for record in records if record["record_id"] in wanted]
    remaining = [record for record in records if record["record_id"] not in wanted]
    if set(deleted) != wanted:
        raise ExecutionError("One or more requested synthetic records do not exist")

    output = json.dumps(remaining, indent=2, sort_keys=True) + "\n"
    descriptor, temporary_name = tempfile.mkstemp(
        dir=target.parent,
        prefix=".records-",
        suffix=".tmp",
        text=True,
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(output)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary_name, target)
    except Exception:
        Path(temporary_name).unlink(missing_ok=True)
        raise

    return {
        "deleted": sorted(deleted),
        "remaining": len(remaining),
        "records_sha256": hashlib.sha256(output.encode("utf-8")).hexdigest(),
    }
