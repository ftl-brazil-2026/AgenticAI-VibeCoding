import sys
import unittest
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from guardrails import Policy, RequestValidationError, ToolRequest
from guardrails.building_blocks import validate_request_schema


def request_payload(**overrides):
    payload = {
        "request_id": "REQ-TEST-001",
        "tool": "read_fixture",
        "parameters": {"path": "poisoned.md"},
        "provenance": ["test:unit"],
    }
    payload.update(overrides)
    return payload


class ToolRequestTests(unittest.TestCase):
    def test_hash_is_stable_across_key_order(self):
        first = ToolRequest.from_mapping(request_payload())
        second = ToolRequest.from_mapping(
            {
                "provenance": ["test:unit"],
                "parameters": {"path": "poisoned.md"},
                "tool": "read_fixture",
                "request_id": "REQ-TEST-001",
            }
        )
        self.assertEqual(first.request_hash, second.request_hash)
        self.assertEqual(len(first.request_hash), 64)

    def test_parameters_are_returned_as_fresh_copies(self):
        request = ToolRequest.from_mapping(request_payload())
        changed = request.parameters
        changed["path"] = "different.md"
        self.assertEqual(request.parameters["path"], "poisoned.md")

    def test_model_cannot_add_an_approval_field(self):
        payload = request_payload(approved=True)
        with self.assertRaisesRegex(RequestValidationError, "unknown=.*approved"):
            ToolRequest.from_mapping(payload)

    def test_missing_field_is_rejected(self):
        payload = request_payload()
        del payload["provenance"]
        with self.assertRaisesRegex(RequestValidationError, "missing=.*provenance"):
            ToolRequest.from_mapping(payload)

    def test_unknown_tool_is_rejected(self):
        request = ToolRequest.from_mapping(
            request_payload(tool="execute_shell_command", parameters={})
        )
        with self.assertRaisesRegex(RequestValidationError, "Unknown tool"):
            validate_request_schema(request)

    def test_absolute_fixture_path_is_rejected(self):
        request = ToolRequest.from_mapping(
            request_payload(parameters={"path": "/etc/passwd"})
        )
        with self.assertRaisesRegex(RequestValidationError, "relative"):
            validate_request_schema(request)

    def test_delete_accepts_synthetic_identifiers_only(self):
        request = ToolRequest.from_mapping(
            request_payload(
                tool="delete_records",
                parameters={"record_ids": ["customer-42"]},
            )
        )
        with self.assertRaisesRegex(RequestValidationError, "SYN-\\*"):
            validate_request_schema(request)

    def test_delete_rejects_non_string_and_duplicate_identifiers(self):
        for record_ids in ([{"id": "SYN-001"}], ["SYN-001", "SYN-001"]):
            with self.subTest(record_ids=record_ids):
                request = ToolRequest.from_mapping(
                    request_payload(
                        tool="delete_records",
                        parameters={"record_ids": record_ids},
                    )
                )
                with self.assertRaises(RequestValidationError):
                    validate_request_schema(request)

    def test_policy_rejects_unknown_tool_grants(self):
        with self.assertRaisesRegex(ValueError, "unknown tools"):
            Policy(
                frozenset({"shell"}),
                LAB_ROOT / "fixtures",
                LAB_ROOT / "output",
            )


if __name__ == "__main__":
    unittest.main()
