"""Command-line approval channel for the guardrail reference lab."""

import argparse
import json
import os
import shutil
import sys
from pathlib import Path

from .audit import AuditSink
from .building_blocks import STATE_CHANGING_TOOLS, TOOL_SCHEMAS
from .errors import ApprovalError, GuardrailError
from .policy import Policy
from .runtime import GuardrailRuntime

READ_ONLY_DEFAULTS = ("read_fixture", "validate_schema")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("request_file", type=Path)
    parser.add_argument(
        "--allow-tool",
        action="append",
        choices=sorted(TOOL_SCHEMAS),
        dest="allowed_tools",
        help="Trusted host tool grant; repeat for multiple tools",
    )
    parser.add_argument("--actor", default=os.environ.get("USER", "local-learner"))
    parser.add_argument("--fixture-root", type=Path, default=Path("fixtures"))
    parser.add_argument("--output-root", type=Path, default=Path("output"))
    parser.add_argument("--audit-log", type=Path)
    parser.add_argument("--approval-ttl", type=int, default=300)
    parser.add_argument(
        "--initialize-records",
        action="store_true",
        help="Copy the synthetic records fixture into the writable output directory",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    args.output_root.mkdir(parents=True, exist_ok=True)
    audit_path = args.audit_log or args.output_root / "audit.jsonl"
    audit = AuditSink(audit_path)
    allowed_tools = frozenset(args.allowed_tools or READ_ONLY_DEFAULTS)
    policy = Policy(
        granted_tools=allowed_tools,
        fixture_root=args.fixture_root,
        writable_root=args.output_root,
    )
    runtime = GuardrailRuntime(policy, audit)

    if args.initialize_records:
        source = args.fixture_root / "records.json"
        target = args.output_root / "records.json"
        if target.exists():
            print(f"[BLOCKED] Refusing to overwrite {target}", file=sys.stderr)
            return 1
        shutil.copyfile(source, target)

    try:
        payload = json.loads(args.request_file.read_text(encoding="utf-8"))
        request = runtime.prepare(payload)
        approval = None
        if request.tool in STATE_CHANGING_TOOLS:
            if request.tool not in policy.granted_tools:
                runtime.authorize(request)
            print("\n--- AGENT REQUEST APPROVAL ---")
            print(f"Request ID: {request.request_id}")
            print(f"Tool: {request.tool}")
            print(f"Parameters: {json.dumps(request.parameters, sort_keys=True)}")
            print(f"Request hash: {request.request_hash}")
            typed_hash = input(
                "Type the exact request hash to approve; anything else denies: "
            ).strip()
            try:
                approval = runtime.approval_store.issue(
                    request_hash=request.request_hash,
                    typed_hash=typed_hash,
                    actor=args.actor,
                    ttl_seconds=args.approval_ttl,
                )
            except ApprovalError as error:
                audit.record(
                    "human_approval",
                    "denied",
                    request_id=request.request_id,
                    tool=request.tool,
                    request_hash=request.request_hash,
                    reason_code=error.code,
                )
                raise
            audit.record(
                "human_approval",
                "approved",
                request_id=request.request_id,
                tool=request.tool,
                request_hash=request.request_hash,
                approval_id=approval.approval_id,
            )

        capability = runtime.authorize(request, approval)
        result = runtime.execute(capability)
    except (GuardrailError, OSError, json.JSONDecodeError) as error:
        print(f"[BLOCKED] {error}", file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
