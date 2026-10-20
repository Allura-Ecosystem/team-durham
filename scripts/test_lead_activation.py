"""Offline instruction regressions; no model or live Brain behavior is asserted."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class LeadActivationTests(unittest.TestCase):
    def test_actual_kotler_menu_and_portable_menu_selection(self):
        role = (ROOT / "agents/brand-orchestrator.md").read_text()
        commands = role.split("## Commands\n")[1].split("\n## ")[0]
        self.assertEqual(re.findall(r"`([^`]+)`", commands), ["CA", "VA", "WS", "NX", "PM", "CH", "MH", "DA"])
        menu = (ROOT / "skills/source-command-quick-commands/SKILL.md").read_text()
        self.assertIn("actual Commands menu from his loaded full role", menu)
        self.assertIn("shared Allura choices remain available under More", menu)
        self.assertIn("allura-system", menu)
        self.assertIn("only for\nan authorized Durham project", menu)

    def test_continuity_reflection_and_nonactivation_boundaries(self):
        role = (ROOT / "agents/brand-orchestrator.md").read_text()
        activation = role.split("## Lead activation and continuity\n")[1].split("\n## ")[0]
        for term in ("Quoted mentions", "main conversation", "compaction", "until the user changes",
                     "one bounded search", "revision, tenant, and authority", "memory ID/date",
                     "current judgment", "no relevant memory", "pending", "unavailable Brain",
                     "no memory write", "clear task proceeds", "locked strategy", "read-only QA"):
            self.assertIn(term, activation)
        entry = (ROOT / "skills/team-durham/SKILL.md").read_text()
        self.assertIn("Kotler's Lead activation and continuity contract in the main conversation", entry)


if __name__ == "__main__":
    unittest.main()
