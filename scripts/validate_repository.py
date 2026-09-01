#!/usr/bin/env python3
"""Validate Team Durham's canonical package and distribution contract."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHA_RE = re.compile(r"^[0-9a-f]{40}$")


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001 - report every invalid artifact
        raise ValueError(f"invalid JSON: {path.relative_to(ROOT)}: {exc}") from exc


def rel_ref(value: str) -> str:
    return value[2:] if value.startswith("./") else value


def agent_name(path: Path) -> str | None:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"(?m)^name:\s*[\"']?([^\n\"']+)", text)
    return match.group(1).strip() if match else None


def main() -> int:
    errors: list[str] = []

    def check(condition: bool, message: str) -> None:
        if not condition:
            errors.append(message)

    try:
        package = load_json(ROOT / "package.json")
        claude = load_json(ROOT / ".claude-plugin/plugin.json")
        codex = load_json(ROOT / ".codex-plugin/plugin.json")
        source = load_json(ROOT / "SOURCE.json")
        export = load_json(ROOT / "export-manifest.json")
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    versions = {package.get("version"), claude.get("version"), codex.get("version")}
    check(len(versions) == 1, f"package/plugin versions differ: {sorted(str(v) for v in versions)}")
    check(package.get("name") == claude.get("name") == codex.get("name") == "team-durham", "manifest names must be team-durham")

    canonical = source.get("canonicalRoles", [])
    compatibility = source.get("compatibilityDefinitions", [])
    expected_names = set(canonical + compatibility)
    agent_files = sorted((ROOT / "agents").glob("*.md"))
    actual_names = {name for path in agent_files if (name := agent_name(path))}
    check(len(canonical) == 12, f"expected 12 canonical roles, found {len(canonical)}")
    check(compatibility == ["openagent"], f"compatibility definition must be openagent, found {compatibility}")
    check(len(agent_files) == 13, f"expected 13 loadable agent files, found {len(agent_files)}")
    check(actual_names == expected_names, f"agent names differ: expected {sorted(expected_names)}, found {sorted(actual_names)}")
    check(source.get("roleCount") == {"canonical": 12, "loadableDefinitions": 13}, "SOURCE.json roleCount is inconsistent")
    check(source.get("revision") is None or bool(SHA_RE.fullmatch(source["revision"])), "SOURCE.json revision must be null or a 40-character SHA")

    claude_agents = {Path(rel_ref(ref)).stem for ref in claude.get("agents", [])}
    check(claude_agents == expected_names, "Claude manifest must load all 12 roles plus openagent")
    for ref in claude.get("agents", []):
        check((ROOT / rel_ref(ref)).is_file(), f"missing Claude agent reference: {ref}")

    command_files = {str(path.relative_to(ROOT)) for path in (ROOT / "commands").glob("*.md")}
    for label, manifest in (("Claude", claude), ("Codex", codex)):
        refs = {rel_ref(ref) for ref in manifest.get("commands", [])}
        check(refs == command_files, f"{label} command manifest differs from commands/: missing={sorted(command_files-refs)}, extra={sorted(refs-command_files)}")
        for ref in refs:
            check((ROOT / ref).is_file(), f"missing {label} command reference: {ref}")

    skill_files = sorted((ROOT / "skills").glob("*/SKILL.md"))
    minimums = export.get("minimums", {})
    check(len(skill_files) >= minimums.get("skills", 0), f"expected at least {minimums.get('skills')} skills, found {len(skill_files)}")
    check(len(command_files) >= minimums.get("commands", 0), f"expected at least {minimums.get('commands')} commands, found {len(command_files)}")
    for pointer in (claude.get("skills"), codex.get("skills")):
        check(pointer == "./skills/", f"skills pointer must be ./skills/, found {pointer}")

    for path in sorted((ROOT / "contracts").rglob("*.json")):
        try:
            load_json(path)
        except ValueError as exc:
            errors.append(str(exc))

    eval_json = sorted((ROOT / "evals").glob("*.json"))
    check(bool(eval_json), "evals/ must contain canonical JSON evaluation snapshots")
    for path in eval_json:
        try:
            payload = load_json(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        for prompt in payload.get("prompts", []):
            ref = prompt.get("path", "")
            check(bool(ref) and (ROOT / ref).is_file(), f"{path.name} references missing prompt: {ref}")

    includes = export.get("include", [])
    excluded = set(export.get("excludedWorkspaceRoots", []))
    check(len(includes) == len(set(includes)), "export include list contains duplicates")
    check(not (set(includes) & excluded), f"export includes workspace-only paths: {sorted(set(includes) & excluded)}")
    for ref in includes:
        path = ROOT / ref
        check(path.exists(), f"export include does not exist: {ref}")
        try:
            path.resolve().relative_to(ROOT.resolve())
        except ValueError:
            errors.append(f"export include escapes repository: {ref}")

    expected_scripts = {
        "test": "python3 scripts/validate_repository.py",
        "validate": "python3 scripts/validate_repository.py",
        "export": "python3 scripts/export_catalog.py",
        "export:check": "python3 scripts/export_catalog.py --check",
    }
    check(package.get("scripts") == expected_scripts, "package scripts differ from canonical validation/export commands")
    check(source.get("exportManifest") == "export-manifest.json", "SOURCE.json exportManifest mismatch")
    check(source.get("exportScript") == "scripts/export_catalog.py", "SOURCE.json exportScript mismatch")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        print(f"Validation failed with {len(errors)} error(s).", file=sys.stderr)
        return 1

    print(
        "Validated Team Durham: "
        f"{len(canonical)} canonical roles + {len(compatibility)} compatibility definition, "
        f"{len(command_files)} commands, {len(skill_files)} skills, "
        f"{len(eval_json)} evaluation snapshots."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
