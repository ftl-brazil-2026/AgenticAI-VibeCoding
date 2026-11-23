import json
import shutil
import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from guardrails import (
    ApprovalError,
    AuditSink,
    GuardrailRuntime,
    Policy,
    RequestValidationError,
)
from guardrails.building_blocks import TOOL_SCHEMAS

ADVERSARIAL_DIR = LAB_ROOT / "fixtures" / "requests" / "adversarial"

# (fixture file, expected error, message fragment)
ADVERSARIAL_CASES = [
    ("direct-shell-injection.json", RequestValidationError, "Unknown tool"),
    ("tool-alias.json", RequestValidationError, "Unknown tool"),
    ("unicode-confusable-tool.json", RequestValidationError, "invalid format"),
    ("path-shell-metacharacters.json", RequestValidationError, "safe relative path"),
    ("path-encoded-traversal.json", RequestValidationError, "safe relative path"),
    ("nested-unexpected-arguments.json", RequestValidationError, "exactly"),
    ("forged-authority.json", ApprovalError, "separate approval"),
]


class AdversarialFixtureTests(unittest.TestCase):
    """Every adversarial fixture is denied before any tool executes."""

    def setUp(self):
        self.temporary = TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.fixtures = self.root / "fixtures"
        self.output = self.root / "output"
        shutil.copytree(LAB_ROOT / "fixtures", self.fixtures)
        self.output.mkdir()
        shutil.copyfile(self.fixtures / "records.json", self.output / "records.json")
        self.runtime = GuardrailRuntime(
            Policy(
                frozenset(TOOL_SCHEMAS),
                self.fixtures,
                self.output,
            ),
            AuditSink(self.output / "audit.jsonl"),
        )

    def tearDown(self):
        self.temporary.cleanup()

    def records_text(self):
        return (self.output / "records.json").read_text(encoding="utf-8")

    def test_every_adversarial_fixture_has_a_registered_case(self):
        on_disk = sorted(path.name for path in ADVERSARIAL_DIR.glob("*.json"))
        registered = sorted(name for name, _, _ in ADVERSARIAL_CASES)
        self.assertEqual(on_disk, registered)

    def test_adversarial_fixtures_are_denied_without_reaching_tools(self):
        before_records = self.records_text()
        for name, error_type, message in ADVERSARIAL_CASES:
            payload = json.loads((ADVERSARIAL_DIR / name).read_text(encoding="utf-8"))
            with (
                self.subTest(fixture=name),
                patch(
                    "guardrails.runtime.read_fixture",
                    side_effect=AssertionError("executor reached"),
                ),
                patch(
                    "guardrails.runtime.validate_document",
                    side_effect=AssertionError("executor reached"),
                ),
                patch(
                    "guardrails.runtime.delete_records",
                    side_effect=AssertionError("executor reached"),
                ),
                self.assertRaisesRegex(error_type, message),
            ):
                self.runtime.run(payload)
        self.assertEqual(self.records_text(), before_records)

    def test_denied_fixtures_produce_audit_events_without_prompt_content(self):
        for name, error_type, _ in ADVERSARIAL_CASES:
            payload = json.loads((ADVERSARIAL_DIR / name).read_text(encoding="utf-8"))
            with self.subTest(fixture=name), self.assertRaises(error_type):
                self.runtime.run(payload)
        audit_text = (self.output / "audit.jsonl").read_text(encoding="utf-8")
        events = [json.loads(line) for line in audit_text.splitlines()]
        self.assertEqual(len(events), len(ADVERSARIAL_CASES) + 1)
        for event in events:
            self.assertIn("event_type", event)
            self.assertIn("reason_code", event)
        self.assertNotIn("Ignore all previous instructions", audit_text)
        self.assertNotIn("rm -rf /", audit_text)


if __name__ == "__main__":
    unittest.main()
