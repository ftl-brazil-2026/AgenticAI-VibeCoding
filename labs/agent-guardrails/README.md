# Agent guardrail reference lab

This zero-dependency lab demonstrates the boundary between model output and tool execution. It uses synthetic data and deterministic Python, so its release tests need no LLM, API key or network access.

## Core building blocks

| Layer | Implementation | Security property |
|:--|:--|:--|
| Request | `ToolRequest` | Exact fields, typed JSON data, provenance and a canonical SHA-256 hash |
| Tool schema | `building_blocks.py` | Three known tools with exact parameter names and types |
| Policy | Frozen `Policy` | A model cannot add a tool to the host's granted scope |
| Approval | `ApprovalStore` | A person types the exact request hash; approval expires, applies to one request and can be used once |
| Capability | HMAC-bound `AuthorizedCapability` | The executor rejects forged or replayed capabilities |
| Executor | Hard-coded dispatch in `GuardrailRuntime` | No dynamic import, shell, MCP, browser or arbitrary function call |
| Path boundary | `resolve_within()` | Absolute paths, traversal and symlink escapes cannot leave the configured root |
| Audit | `AuditSink` | Private JSONL events contain IDs, hashes and reason codes, not prompts or parameters |
| Sandbox | `Containerfile` and CI flags | Non-root process, no network, read-only root, no Linux capabilities and one writable output mount |

## Tools

- `read_fixture(path)`: reads a UTF-8 fixture under `fixtures/`, with a one-megabyte limit.
- `validate_schema(document)`: performs a deterministic JSON check without I/O.
- `delete_records(record_ids)`: removes `SYN-*` records from a copied `output/records.json`. It is state-changing and always needs a hash-bound approval.

## Guardrail flow

```text
Untrusted request or retrieved content
              |
              v
Strict request schema and tool schema
              |
              v
Immutable host tool grants
              |
              v
Separate hash-bound approval for state changes
              |
              v
One-use signed capability
              |
              v
Hard-coded tool executor -> output check -> JSONL audit event
```

The request cannot contain `approved`, policy, network or executor fields. Unknown fields fail closed.

## Run locally

From the repository root:

```bash
cd labs/agent-guardrails
python -m unittest discover -s tests -v
python -m guardrails fixtures/requests/read-poisoned-markdown.json
```

The second command prints the poisoned fixture as data. It cannot call another tool.

To exercise the synthetic state change:

```bash
python -m guardrails fixtures/requests/delete-record.json \
  --allow-tool delete_records \
  --initialize-records
```

The CLI prints the canonical request and its SHA-256 hash. Type that exact hash to issue a one-use approval. Any other input denies the request. Delete `output/` before repeating the initialization.

Local audit events are written to `output/audit.jsonl`. Git ignores JSONL logs.

## Container boundary

The Python policy layer works without a container for learner accessibility. Local Python alone does **not** disable the computer's network or make its filesystem read-only.

CI runs the same tests in the pinned container image with:

- `--network none`
- `--read-only`
- `--cap-drop ALL`
- `--security-opt no-new-privileges`
- non-root UID/GID `65532`
- `tmpfs` for `/tmp`
- one writable `/output` mount

Container checks confirm that DNS/network access and writes under `/workspace` fail while synthetic audit output remains writable. CI retains that output for seven days.

## Evals

The `unittest` suite covers:

- direct prompt injection attempting to add `delete_records`;
- indirect injection in Markdown and CSV fixtures;
- model-supplied `approved=true`;
- approval hash mismatch, expiry and replay;
- changed arguments after approval;
- capability signature forgery and replay;
- path traversal and symlink escape;
- synthetic deletion after exact approval;
- audit permissions and data minimization;
- container network, identity and filesystem boundaries.

## Enforced and advisory controls

| Control | Local Python | CI container |
|:--|:--:|:--:|
| Request schema and allowlist | Enforced | Enforced |
| Hash-bound approval | Enforced | Enforced |
| Path confinement | Enforced | Enforced |
| No network tools in the dispatcher | Enforced | Enforced |
| Operating-system network isolation | Not enforced | Enforced |
| Read-only runtime filesystem | Not enforced | Enforced |
| `LAB_*` and telemetry variables | Advisory | Advisory unless the named software honors them |

## Boundaries

This is an educational reference, not a production authorization service. The approval store and capability signing key live in one process, and audit logs are local rather than remotely tamper-evident. Do not add real credentials, personal data, production APIs or general-purpose execution tools.
