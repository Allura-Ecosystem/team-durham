---
description: "Validate Team Durham's canonical manifests, roles, contracts, evaluations, and export contract."
allowed-tools: Read, Grep, Bash
---

# Validate Repository

Validate the standalone Team Durham package itself. This command does not validate a client's brand deliverables; use `/validate [client]` for that.

## Usage

```text
/validate-repo
```

## Required checks

From the repository root, run:

```bash
python3 scripts/validate_repository.py
python3 scripts/export_catalog.py --check
gitleaks dir --config .gitleaks.toml .
git diff --check
```

## What is validated

1. Package and Claude/Codex manifest names and versions agree.
2. The roster contains 12 canonical roles and one `openagent` compatibility fallback.
3. Every declared agent and command path exists; command manifests match `commands/` exactly.
4. The skill inventory meets the distribution minimum and each top-level skill has `SKILL.md`.
5. JSON contracts and canonical evaluation snapshots parse and reference existing prompt files.
6. `SOURCE.json` and `export-manifest.json` agree on the canonical export path.
7. Workspace-only paths such as `clients/` and `.opencode/` cannot enter the catalog export.
8. The generated export has an exact Git revision plus SHA-256 inventory.
9. Gitleaks finds no credential material.

## Report rules

- Include the exact command and exit status for every check.
- Treat a missing tool as a blocker, not a pass.
- Do not claim the repository is clean unless `git status --short` is empty after commit.
- Do not claim a generated catalog copy is current unless its exported `SOURCE.json.revision` equals the pinned standalone SHA.
