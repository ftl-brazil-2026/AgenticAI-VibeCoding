"""Immutable runtime policy and capability authorization."""

import hashlib
import hmac
import secrets
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from .approval import Approval, ApprovalStore
from .building_blocks import STATE_CHANGING_TOOLS, TOOL_SCHEMAS, validate_request_schema
from .errors import ApprovalError, AuthorizationError
from .models import AuthorizedCapability, ToolRequest, canonical_json


@dataclass(frozen=True)
class Policy:
    granted_tools: frozenset[str]
    fixture_root: Path
    writable_root: Path
    network_mode: str = "none"

    def __post_init__(self) -> None:
        unknown = self.granted_tools - TOOL_SCHEMAS.keys()
        if unknown:
            raise ValueError(f"Policy grants unknown tools: {sorted(unknown)}")
        if self.network_mode != "none":
            raise ValueError("The reference lab supports network_mode='none' only")
        object.__setattr__(self, "fixture_root", self.fixture_root.resolve())
        object.__setattr__(self, "writable_root", self.writable_root.resolve())


class CapabilityAuthority:
    def __init__(
        self,
        policy: Policy,
        approval_store: ApprovalStore,
        *,
        signing_key: bytes | None = None,
    ) -> None:
        self.policy = policy
        self.approval_store = approval_store
        self._signing_key = signing_key or secrets.token_bytes(32)
        self._consumed_capabilities: set[str] = set()

    def authorize(
        self,
        request: ToolRequest,
        approval: Approval | None = None,
    ) -> AuthorizedCapability:
        validate_request_schema(request)
        if request.tool not in self.policy.granted_tools:
            raise AuthorizationError(f"Tool is outside the granted scope: {request.tool}")

        approval_id = None
        if request.tool in STATE_CHANGING_TOOLS:
            if approval is None:
                raise ApprovalError("State-changing tool requires separate approval")
            self.approval_store.consume(
                approval,
                request_hash=request.request_hash,
            )
            approval_id = approval.approval_id

        authorization_id = secrets.token_hex(16)
        issued_at = datetime.now(UTC).isoformat()
        signature = self._sign(
            request.request_hash,
            authorization_id,
            approval_id,
            issued_at,
        )
        return AuthorizedCapability(
            request=request,
            authorization_id=authorization_id,
            approval_id=approval_id,
            issued_at=issued_at,
            signature=signature,
        )

    def verify(self, capability: AuthorizedCapability) -> None:
        if capability.authorization_id in self._consumed_capabilities:
            raise AuthorizationError("Capability has already been used")
        expected = self._sign(
            capability.request.request_hash,
            capability.authorization_id,
            capability.approval_id,
            capability.issued_at,
        )
        if not hmac.compare_digest(expected, capability.signature):
            raise AuthorizationError("Capability signature is invalid")
        self._consumed_capabilities.add(capability.authorization_id)

    def _sign(
        self,
        request_hash: str,
        authorization_id: str,
        approval_id: str | None,
        issued_at: str,
    ) -> str:
        message = canonical_json(
            {
                "request_hash": request_hash,
                "authorization_id": authorization_id,
                "approval_id": approval_id,
                "issued_at": issued_at,
            }
        ).encode("utf-8")
        return hmac.new(self._signing_key, message, hashlib.sha256).hexdigest()
