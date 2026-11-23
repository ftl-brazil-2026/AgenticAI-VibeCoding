---
title: "ARCH-03: Agent runtime enforcement"
subtitle: "Deterministic policy, approval, sandbox and audit boundaries"
---

# Architecture decision

**Status:** Approved baseline implemented by the reference lab in `labs/agent-guardrails/`. Optional runtime expansion still requires maintainer review.

## Objective

Prove that model output cannot grant tool permissions, approve its own state-changing action, write outside a scoped workspace or use the network in CI. Tests replay direct and indirect prompt-injection fixtures without an LLM or API key.

## Architecture

```text
User input / retrieved fixture (untrusted)
                    |
                    v
Orchestrator: context, planning, routing (untrusted proposals)
                    |
                    v
Policy enforcement (trusted deterministic host code)
  schema -> tool scope -> argument policy -> approval binding
                    |
                    v
Sandbox executor (network off, read-only inputs, one writable output)
                    |
                    v
Mock tools -> independent output checks -> append-only audit events
```

The model and retrieved content never receive a reference that can mutate the policy or approval store. The runtime rejects unknown request fields, including model-supplied approval claims.

## Components

| Component | Responsibility |
|:--|:--|
| `ToolRequest` | Strict request ID, tool, typed parameters and provenance; deterministic request hash |
| `Policy` | Immutable granted tools, fixture root, writable root and network mode |
| `CapabilityAuthority` | Enforces tool scope and approval, then signs a one-use capability |
| `ApprovalStore` | Issues an expiring, one-use approval only when a person types the exact request hash |
| `GuardrailRuntime` | Hard-coded dispatch; it exposes no shell, arbitrary function, browser, MCP or network tool |
| `AuditSink` | Appends minimized JSONL events without prompt or parameter contents |
| CI container | Non-root process, no network, read-only root, dropped capabilities, `no-new-privileges` and one writable output mount |

## Security invariants

1. Conversation text and retrieved files cannot alter policy or approval state.
2. `delete_records` operates only on copied `SYN-*` fixtures and requires approval for the exact canonical request.
3. Approval, capability and argument replay fail closed.
4. Fixture reads cannot escape through absolute paths, traversal or symlinks.
5. CI blocks network access and writes outside `/output` at the container boundary.
6. Audit events contain identifiers, hashes and reason codes, not sensitive content.

## Deliberate limitations

- Local execution without a container enforces application policy but not operating-system network or filesystem isolation.
- The CLI is the separate trusted approval channel; no web approval service is included.
- The signing key and approval store are process-local.
- JSONL audit output is private and short-lived, but not remotely tamper-evident.
- Only three narrow synthetic tools exist. Optional Pydantic, MCP, browser, API and distributed approval integrations are out of scope.

## Expansion gate

Before adding any new tool or optional framework, maintainers should review its schema, side effects, least-privilege grant, approval requirement, sandbox access and audit fields. New state-changing tools require a denial test, exact-approval test, replay test and container-boundary test.
