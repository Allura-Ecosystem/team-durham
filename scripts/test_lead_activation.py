"""Offline instruction regressions; no model or live Brain behavior is asserted."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
MENU = [
    ("CA", "Create brand architecture"), ("VA", "Validate"), ("WS", "Status"),
    ("NX", "Next steps"), ("PM", "Party mode"), ("CH", "Chat"),
    ("MH", "Menu"), ("DA", "Exit"), ("More", "Allura choices"),
]
FIELDS = ["Action Taken", "Principle Applied", "Event Logged", "Semantic Promotion", "Confidence"]


def section(text, heading):
    return text.split(f"## {heading}\n", 1)[1].split("\n## ", 1)[0]


def body(text):
    return text.split("---\n", 2)[2]


class LeadActivationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.role = (ROOT / "agents/brand-orchestrator.md").read_text()
        cls.menu = (ROOT / "skills/source-command-quick-commands/SKILL.md").read_text()
        cls.entry = (ROOT / "skills/team-durham/SKILL.md").read_text()

    def test_complete_selectable_domain_menu_with_safe_intents(self):
        commands = section(self.role, "Commands")
        pattern = r'^- :codex-followup\[([^\]]+)\]\{prompt="([^"\n]+)"\}$'
        choices = re.findall(pattern, commands, re.M)
        self.assertEqual([tuple(label.split(" · ", 1)) for label, _ in choices], MENU)
        self.assertEqual(len(commands.strip().splitlines()), len(MENU))
        self.assertNotIn("```", commands)
        for (label, prompt), (code, _) in zip(choices, MENU):
            self.assertTrue(prompt.startswith("Kotler, ") if code != "DA" else prompt.startswith("Exit the Kotler role"))
            self.assertNotRegex(prompt.lower(), r"publish|deploy|promote|write.*brain|switch.*tenant")
        self.assertEqual(choices[0][1], "Kotler, help define the brand architecture.")
        self.assertIn("actual Commands menu from his loaded full role", self.menu)
        self.assertIn("shared Allura choices remain available under More", self.menu)
        self.assertIn("only for\nan authorized Durham project", self.menu)

    def test_continuity_reflection_and_nonactivation_boundaries(self):
        activation = section(self.role, "Lead activation and continuity")
        for term in ("Quoted mentions", "main conversation", "compaction", "until the user changes",
                     "one bounded search", "revision, tenant, and authority", "memory ID/date",
                     "current judgment", "no relevant memory", "pending", "unavailable Brain",
                     "no memory write", "clear task proceeds", "locked strategy", "read-only QA"):
            self.assertIn(term, activation)
        self.assertIn("Kotler's Lead activation and continuity contract in the main conversation", self.entry)

    def test_exact_rendered_reflection_fields_and_final_position_contract(self):
        contract = section(self.role, "Chat presentation and closing reflection")
        template = contract.split("**📝 Reflection**", 1)[1].split("\n\n", 1)[0]
        fields = re.findall(r"^[├└]─ \*\*([^*]+):\*\*", template, re.M)
        self.assertEqual(fields, FIELDS)
        self.assertTrue(template.strip().splitlines()[-1].startswith("└─ **Confidence:**"))
        self.assertNotIn("```", contract)
        for required in ("End every substantive final reply", "activation, menu, work, review, and blocked",
                         "Confidence line is the final content", "not an aphorism, apology",
                         "Interim progress updates need no reflection footer", "Small greetings and thanks", "Do not repeat the full menu during ordinary work"):
            self.assertIn(required, contract)
        for source in (self.menu, self.entry):
            sequence = re.sub(r"\s+", " ", source)
            self.assertIn(", ".join(FIELDS), sequence)
            self.assertIn("compaction", source)
            self.assertIn(":codex-followup", source)
            self.assertIn("Markdown bullets", source)
            self.assertIn("code fence", source)
            self.assertIn("None/Pending", source)
            self.assertIn("substantive final reply", source)
            self.assertIn("Interim progress updates need no reflection footer", source)
            self.assertIn("memory-write hold", source)
            self.assertIn("curator:approve", source)
        self.assertIn("no content after it", self.menu)
        self.assertIn("Confidence is the final content", self.entry)

    def test_reporting_does_not_grant_authority_or_change_role(self):
        contract = section(self.role, "Chat presentation and closing reflection")
        for required in ("customer's choice", "business consequence", "commercial reasoning",
                         "does not authorize a memory write", "memory-write hold",
                         "Event Logged is None unless a real write is", "Pending/unconfirmed",
                         "human approval through `curator:approve`", "verified receipt",
                         "Never\nfabricate execution", "authenticated identity", "authorized project tenant",
                         "STP before", "locked strategy", "read-only QA"):
            self.assertIn(required, contract)
        self.assertIn("model: inherit", self.role.split("\n---\n", 1)[0])
        self.assertIn('tools: ["Read", "Agent", "allura-brain_memory_search", "allura-brain_memory_add", "allura-brain_memory_get"]', self.role)
        self.assertIn("No creative dispatch occurs before positioning is locked.", self.role)
        self.assertIn("never use a persona as `user_id`", self.role)
        self.assertIn("switch tenant to bypass denial", self.role)

    def test_claude_command_and_codex_skill_body_parity(self):
        command = (ROOT / "commands/quick-commands.md").read_text()
        self.assertEqual(body(command), body(self.menu))


if __name__ == "__main__":
    unittest.main()
