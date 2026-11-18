"""Append-only synthetic audit events without prompt or parameter contents."""

import json
import os
from datetime import UTC, datetime
from pathlib import Path


class AuditSink:
    def __init__(self, path: Path):
        self.path = path

    def record(
        self,
        event_type: str,
        status: str,
        *,
        request_id: str | None = None,
        tool: str | None = None,
        request_hash: str | None = None,
        approval_id: str | None = None,
        reason_code: str | None = None,
    ) -> None:
        entry = {
            "timestamp": datetime.now(UTC).isoformat(),
            "event_type": event_type,
            "status": status,
            "request_id": request_id,
            "tool": tool,
            "request_hash": request_hash,
            "approval_id": approval_id,
            "reason_code": reason_code,
        }
        self.path.parent.mkdir(parents=True, exist_ok=True)
        line = json.dumps(entry, separators=(",", ":"), sort_keys=True) + "\n"
        descriptor = os.open(
            self.path,
            os.O_APPEND | os.O_CREAT | os.O_WRONLY,
            0o600,
        )
        try:
            os.write(descriptor, line.encode("utf-8"))
        finally:
            os.close(descriptor)
