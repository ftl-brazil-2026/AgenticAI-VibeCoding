"""One-time approvals bound to the exact canonical request hash."""

import hmac
import secrets
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from .errors import ApprovalError


@dataclass(frozen=True)
class Approval:
    approval_id: str
    request_hash: str
    actor: str
    issued_at: datetime
    expires_at: datetime


class ApprovalStore:
    def __init__(self) -> None:
        self._issued: dict[str, Approval] = {}
        self._consumed: set[str] = set()

    def issue(
        self,
        *,
        request_hash: str,
        typed_hash: str,
        actor: str,
        ttl_seconds: int = 300,
        now: datetime | None = None,
    ) -> Approval:
        if not actor.strip() or len(actor) > 128:
            raise ApprovalError("Approval actor is required")
        if not 1 <= ttl_seconds <= 900:
            raise ApprovalError("Approval lifetime must be between 1 and 900 seconds")
        if not hmac.compare_digest(request_hash, typed_hash):
            raise ApprovalError("Typed hash does not match the request")

        issued_at = now or datetime.now(UTC)
        approval = Approval(
            approval_id=secrets.token_hex(16),
            request_hash=request_hash,
            actor=actor,
            issued_at=issued_at,
            expires_at=issued_at + timedelta(seconds=ttl_seconds),
        )
        self._issued[approval.approval_id] = approval
        return approval

    def consume(
        self,
        approval: Approval,
        *,
        request_hash: str,
        now: datetime | None = None,
    ) -> None:
        known = self._issued.get(approval.approval_id)
        if known != approval:
            raise ApprovalError("Approval was not issued by this trusted store")
        if approval.approval_id in self._consumed:
            raise ApprovalError("Approval has already been used")
        if not hmac.compare_digest(approval.request_hash, request_hash):
            raise ApprovalError("Approval belongs to a different request")
        checked_at = now or datetime.now(UTC)
        if checked_at >= approval.expires_at:
            raise ApprovalError("Approval has expired")
        self._consumed.add(approval.approval_id)
