"""Trusted orchestration between validation, authorization and tool execution."""

from collections.abc import Mapping
from typing import Any

from .approval import Approval, ApprovalStore
from .audit import AuditSink
from .building_blocks import validate_request_schema
from .errors import GuardrailError
from .models import AuthorizedCapability, ToolRequest
from .policy import CapabilityAuthority, Policy
from .tools import delete_records, read_fixture, validate_document
from .verifier import capture_state, verify_result


class GuardrailRuntime:
    def __init__(
        self,
        policy: Policy,
        audit: AuditSink,
        approval_store: ApprovalStore | None = None,
    ) -> None:
        self.policy = policy
        self.audit = audit
        self.approval_store = approval_store or ApprovalStore()
        self.authority = CapabilityAuthority(policy, self.approval_store)

    def prepare(self, payload: Mapping[str, Any]) -> ToolRequest:
        try:
            request = ToolRequest.from_mapping(payload)
            validate_request_schema(request)
        except GuardrailError as error:
            self.audit.record(
                "request_validation",
                "denied",
                reason_code=error.code,
            )
            raise

        self.audit.record(
            "request_validation",
            "accepted",
            request_id=request.request_id,
            tool=request.tool,
            request_hash=request.request_hash,
        )
        return request

    def authorize(
        self,
        request: ToolRequest,
        approval: Approval | None = None,
    ) -> AuthorizedCapability:
        try:
            capability = self.authority.authorize(request, approval)
        except GuardrailError as error:
            self.audit.record(
                "authorization",
                "denied",
                request_id=request.request_id,
                tool=request.tool,
                request_hash=request.request_hash,
                approval_id=approval.approval_id if approval else None,
                reason_code=error.code,
            )
            raise

        self.audit.record(
            "authorization",
            "approved",
            request_id=request.request_id,
            tool=request.tool,
            request_hash=request.request_hash,
            approval_id=capability.approval_id,
        )
        return capability

    def execute(self, capability: AuthorizedCapability) -> dict[str, Any]:
        request = capability.request
        try:
            self.authority.verify(capability)
            parameters = request.parameters
            snapshot = capture_state(
                request,
                self.policy.fixture_root,
                self.policy.writable_root,
            )
            if request.tool == "read_fixture":
                result = read_fixture(self.policy.fixture_root, parameters["path"])
            elif request.tool == "validate_schema":
                result = validate_document(parameters["document"])
            elif request.tool == "delete_records":
                result = delete_records(
                    self.policy.writable_root,
                    parameters["record_ids"],
                )
            else:
                raise AssertionError("Authorized capability contains an unknown tool")
        except GuardrailError as error:
            self.audit.record(
                "execution",
                "blocked",
                request_id=request.request_id,
                tool=request.tool,
                request_hash=request.request_hash,
                approval_id=capability.approval_id,
                reason_code=error.code,
            )
            raise

        self.audit.record(
            "execution",
            "completed",
            request_id=request.request_id,
            tool=request.tool,
            request_hash=request.request_hash,
            approval_id=capability.approval_id,
        )
        try:
            verify_result(
                request,
                result,
                snapshot,
                self.policy.writable_root,
            )
        except GuardrailError as error:
            self.audit.record(
                "verification",
                "failed",
                request_id=request.request_id,
                tool=request.tool,
                request_hash=request.request_hash,
                approval_id=capability.approval_id,
                reason_code=error.code,
            )
            raise

        self.audit.record(
            "verification",
            "passed",
            request_id=request.request_id,
            tool=request.tool,
            request_hash=request.request_hash,
            approval_id=capability.approval_id,
        )
        return result

    def run(
        self,
        payload: Mapping[str, Any],
        approval: Approval | None = None,
    ) -> dict[str, Any]:
        request = self.prepare(payload)
        capability = self.authorize(request, approval)
        return self.execute(capability)
