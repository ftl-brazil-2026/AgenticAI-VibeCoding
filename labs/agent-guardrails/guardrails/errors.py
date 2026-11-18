"""Typed failures raised by the guardrail reference implementation."""


class GuardrailError(Exception):
    """Base class with a stable reason code for audit events."""

    code = "GUARDRAIL_ERROR"


class RequestValidationError(GuardrailError):
    code = "REQUEST_INVALID"


class AuthorizationError(GuardrailError):
    code = "AUTHORIZATION_DENIED"


class ApprovalError(GuardrailError):
    code = "APPROVAL_INVALID"


class ExecutionError(GuardrailError):
    code = "EXECUTION_BLOCKED"
