import os
import socket
import sys
import unittest
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(LAB_ROOT))

from guardrails import AuditSink


@unittest.skipUnless(
    os.environ.get("EXPECT_SANDBOX") == "1",
    "container boundary checks run in CI",
)
class ContainerBoundaryTests(unittest.TestCase):
    def test_process_is_not_root(self):
        self.assertNotEqual(os.geteuid(), 0)

    def test_network_is_disabled(self):
        with self.assertRaises(OSError):
            socket.create_connection(("github.com", 443), timeout=2)

    def test_root_filesystem_is_read_only(self):
        with self.assertRaises(OSError):
            Path("/workspace/forbidden.txt").write_text("blocked", encoding="utf-8")

    def test_audit_mount_is_writable(self):
        audit_path = Path(os.environ["GUARDRAIL_AUDIT_LOG"])
        AuditSink(audit_path).record("sandbox", "verified")
        self.assertTrue(audit_path.is_file())


if __name__ == "__main__":
    unittest.main()
