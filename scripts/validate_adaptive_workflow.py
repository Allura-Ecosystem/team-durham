#!/usr/bin/env python3
"""Offline prompt-contract checks; does not execute agents or benchmark models."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def validate() -> list[str]:
    errors: list[str] = []

    def check(ok: bool, message: str) -> None:
        if not ok:
            errors.append(f"adaptive workflow: {message}")

    policy = json.loads((ROOT / "contracts/adaptive-routing.json").read_text())
    cases = json.loads((ROOT / "evals/adaptive-routing.json").read_text())["cases"]
    check(policy["precedence"] == ["sensitive", "standard", "quick"], "risk precedence changed")
    check(policy["model_default"] == "inherit", "model default must inherit")
    check(policy["group_id"] == "allura-team-durham", "tenant drift")
    check(policy["routes"]["quick"]["review"] == "targeted-check", "quick review drift")
    check(policy["routes"]["standard"]["review"] == "independent", "standard review missing")
    check(policy["routes"]["sensitive"]["review"] == "independent-and-human-authority", "sensitive authority missing")
    for case in cases:
        facts = case["facts"]
        route = next((name for name in policy["precedence"]
                      if any(facts.get(key, False) for key in policy["routes"][name]["any"])), "quick")
        blocked = sorted(required for action, required in policy["dependency_gates"].items()
                         if facts.get(action, False) and not facts.get(required, False))
        parallel = not blocked and all(facts.get(key, False) for key in policy["parallel_requires"])
        check(route == case["route"], f"{case['id']}: expected {case['route']}, got {route}")
        check(blocked == sorted(case["blocked_by"]), f"{case['id']}: dependency gate drift")
        check(parallel == case["parallel"], f"{case['id']}: concurrency gate drift")

    entry_paths = [
        "skills/team-durham/SKILL.md", "skills/team-durham-agent-router/SKILL.md",
        "skills/brand-loop/SKILL.md", "rules/agent-routing.md",
        "commands/auto.md", "commands/brand-auto.md", "commands/orchestrate.md",
        "commands/start-session.md", "commands/quick-commands.md",
        "skills/source-command-orchestrate/SKILL.md",
        "skills/source-command-start-session/SKILL.md",
        "skills/source-command-quick-commands/SKILL.md",
    ]
    for path in entry_paths + [str(p.relative_to(ROOT)) for p in (ROOT / "agents").glob("*.md")]:
        content = (ROOT / path).read_text()
        check("adaptive-workflow.md" in content, f"policy disconnected: {path}")
        check(not re.search(r"one phase at a time|proceed sequentially|ask for approval before moving to the next phase", content, re.I), f"serial ceremony returned: {path}")
        check(not re.search(r"ollama-cloud/|(?m:^model: (?:opus|sonnet|haiku)$)", content), f"fixed model returned: {path}")

    for agent in (ROOT / "agents").glob("*.md"):
        check(bool(re.search(r"(?m)^model: inherit$", agent.read_text())), f"inherit missing: {agent.name}")
    for role in ["brand-orchestrator", "scout-recon", "qa-reviewer"]:
        content = (ROOT / f"agents/{role}.md").read_text()
        tools = json.loads(re.search(r"(?m)^tools: (\[.*\])$", content).group(1))
        check(not set(tools) & {"Write", "Edit", "Bash"}, f"craft tools added to {role}")

    schema = json.loads((ROOT / "contracts/context-packet.schema.json").read_text())
    required = {"group_id", "project_id", "hydrated_at", "source_revision", "dependencies", "authority_refs", "brain_status"}
    check(required <= set(schema["required"]), "scoped freshness fields not required")
    check(schema["properties"]["group_id"] == {"const": "allura-team-durham"}, "packet tenant drift")
    check(schema["properties"]["version"] == {"const": "1.1"}, "packet version drift")
    check(schema["properties"]["hydrated_at"].get("format") == "date-time", "timestamp format missing")
    check(schema.get("additionalProperties") is False, "packet must reject unknown top-level fields")
    packet_text = (ROOT / "agents/scout-recon.md").read_text().split("```json\n", 1)[1].split("```", 1)[0]
    packet = json.loads(packet_text)
    check(set(schema["required"]) <= set(packet), "Scout example misses required packet fields")
    check(set(packet) <= set(schema["properties"]), "Scout example has unknown fields")
    check(packet["version"] == "1.1" and packet["group_id"] == "allura-team-durham", "Scout example tenant/version drift")
    return errors


if __name__ == "__main__":
    failures = validate()
    for failure in failures:
        print(f"ERROR: {failure}")
    if not failures:
        print("Validated adaptive workflow offline prompt contracts (18 routing/dependency fixtures).")
    raise SystemExit(bool(failures))
