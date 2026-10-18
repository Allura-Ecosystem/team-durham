#!/usr/bin/env python3
"""Offline persona contracts; these checks do not measure live model quality."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
ROLES = {
    "brand-orchestrator": ("Kotler", "customer", "No creative dispatch occurs before positioning is locked."),
    "brand-strategist": ("Aaker", "trait", "Lock on exactly 1-2 dimensions."),
    "copywriter": ("Ogilvy", "reader", "NO copy without approved Strategy Pack"),
    "visual-director": ("Glaser", "shape", "NO visual work without approved Strategy Pack"),
    "brand-kit-builder": ("Rand", "proportion", "NO kit assembly without ALL prerequisite deliverables approved"),
    "qa-reviewer": ("Munari", "comparison", "Route remediation; remain read-only."),
    "data-analyst": ("Tufte", "denominator", "Discovery remains read-only."),
}


def capsule(text):
    return text.split("## Persona voice and reasoning\n", 1)[1].split("**Research basis:**", 1)[0]


def field(body, label):
    return re.search(r"^- \*\*" + re.escape(label) + r":\*\* (.+)$", body, re.M).group(1)


class PersonaCapsuleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.texts = {role: (ROOT / "agents" / f"{role}.md").read_text() for role in ROLES}

    def test_compact_early_single_capsules(self):
        for role, text in self.texts.items():
            with self.subTest(role=role):
                self.assertEqual(text.count("## Persona voice and reasoning"), 1)
                self.assertLess(text.index("## Persona voice and reasoning"), text.index("Apply `governance/"))
                count = len(capsule(text).split())
                self.assertGreaterEqual(count, 150)
                self.assertLessEqual(count, 350)
                self.assertNotIn("**Mindset:**", text)
                self.assertNotIn("**Operating Principle:**", text)

    def test_distinct_method_question_example_and_limits(self):
        for label in ("Reasoning", "Voice", "Diagnostic question", "Original response example (not a quotation)", "Limits"):
            values = [field(capsule(text), label) for text in self.texts.values()]
            self.assertEqual(len(set(values)), len(ROLES), label)
        for role, (name, concept, _) in ROLES.items():
            with self.subTest(role=role):
                body = capsule(self.texts[role])
                self.assertIn(f"Allura's {name} agent, inspired by", body)
                self.assertIn(concept, body.lower())
                self.assertIn("Do not invent quotations, memories, credentials, endorsement", body)
                self.assertIn("Reply naturally to people.", body)
                self.assertIn("requested machine receipts or integrations", body)
                self.assertIn("Approved client voice, governance, scope, and permissions remain authoritative.", body)

    def test_strategy_permissions_memory_and_review_gates(self):
        for role, (_, _, gate) in ROLES.items():
            with self.subTest(role=role):
                text = self.texts[role]
                self.assertIn(gate, text)
                self.assertIn("model: inherit", text.split("\n---\n", 1)[0])
                self.assertIn("allura-team-durham", text)
                self.assertIn("approval", text)
                self.assertIn("**Research basis:**", text)
        qa = self.texts["qa-reviewer"]
        self.assertIn('tools: ["Read", "Grep", "allura-brain_memory_search", "allura-brain_memory_get"]', qa)
        self.assertIn('"total": 60', qa)
        self.assertIn("85%+", qa)
        self.assertIn("Human approval gates remain mandatory.", qa)
        self.assertIn('"terminal_state":', self.texts["brand-orchestrator"])
        self.assertIn('"terminal_state":', qa)

    def test_authenticated_scope_and_safe_memory_carryforward(self):
        for role, text in self.texts.items():
            with self.subTest(role=role):
                self.assertIn("allura-system", text)
                self.assertIn("authorized Durham project", text)
                self.assertIn("never use a persona as `user_id`", text)
                self.assertIn("switch tenant to bypass denial", text)
                self.assertNotRegex(text, r'user_id\s*=\s*[\"\'](?:aaker|glaser|rand|ogilvy|tufte|kotler|munari)')
                self.assertNotIn("**group_id =", text)
        skill_dir = ROOT / "skills" / "allura-memory-skill"
        policy = (skill_dir / "SKILL.md").read_text()
        retrieval = (skill_dir / "references" / "allura-dual-context-retrieval.md").read_text()
        self.assertIn("The authenticated transport owns `user_id`", policy)
        self.assertIn("No direct SQL, graph CRUD", policy)
        self.assertIn("PostgreSQL events/traces are append-only", policy)
        self.assertIn("human approval via `curator:approve`", policy)
        for text in (policy, retrieval):
            self.assertIn('`status: "approved" | "all"`', text)
            self.assertNotIn("no `status` filter", text)
            self.assertNotIn("No invented `status` request filter", text)
        for script in (skill_dir / "scripts").glob("*.sh"):
            content = script.read_text()
            self.assertIn("CHECKLIST", content)
            self.assertNotRegex(content, r"(?m)^\s*(?:curl|docker|psql|wget)\s")


if __name__ == "__main__":
    unittest.main()
