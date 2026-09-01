#!/usr/bin/env python3
"""Validate Team Durham BMad module adapters against canonical plugin agents."""
from __future__ import annotations

import csv
import sys
from pathlib import Path

MODULE_ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = MODULE_ROOT / "skills"
CANONICAL_ROOT = MODULE_ROOT.parent / "agents"
ADAPTERS = {
    "dur-agent-kotler": "brand-orchestrator.md",
    "dur-agent-scout": "scout-recon.md",
    "dur-agent-munari": "qa-reviewer.md",
}
REQUIRED_SKILLS = {"dur-brand-delivery", "dur-brand-auto", "dur-setup"}


def main() -> int:
    errors: list[str] = []
    for adapter, canonical in ADAPTERS.items():
        if not (SKILLS_ROOT / adapter / "SKILL.md").is_file():
            errors.append(f"missing adapter skill: {adapter}")
        if not (CANONICAL_ROOT / canonical).is_file():
            errors.append(f"missing canonical Team Durham agent: {canonical}")
    for skill in REQUIRED_SKILLS:
        if not (SKILLS_ROOT / skill / "SKILL.md").is_file():
            errors.append(f"missing workflow skill: {skill}")

    csv_path = SKILLS_ROOT / "dur-setup" / "assets" / "module-help.csv"
    with csv_path.open(newline="", encoding="utf-8") as handle:
        csv_skills = {row["skill"] for row in csv.DictReader(handle)}
    expected = set(ADAPTERS) | REQUIRED_SKILLS
    missing = expected - csv_skills
    if missing:
        errors.append(f"module-help.csv missing skills: {', '.join(sorted(missing))}")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print("Team Durham BMad adapters point to canonical plugin roles.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
