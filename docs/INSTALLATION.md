# Installation

## Requirements

- Git
- Python 3.10+ for validation and export
- One supported agent client (Claude Code, Codex CLI, or a catalog/runtime that understands the bundled manifests)
- Node.js/npm only for the convenience scripts in `package.json`; the validators themselves use Python's standard library

External integrations are optional. Install only the services needed by your workflow.

## Canonical checkout

```bash
git clone https://github.com/Allura-Ecosystem/team-durham.git
cd team-durham
python3 scripts/validate_repository.py
```

Pin a release tag or commit for repeatable team installations.

## Claude Code local plugin

From the repository root:

```bash
claude --plugin-dir "$PWD"
```

The `.claude-plugin/plugin.json` manifest loads canonical definitions directly from `agents/`, `commands/`, and `skills/`.

## Codex

The `.codex-plugin/plugin.json` manifest declares the Codex distribution surface. Codex plugin packaging exposes skills and commands but does not create native Codex subagents. Use the bundled BMAD adapter when a Codex workflow needs agent-like persona routing; see `docs/BMAD-AGENTS.md` and `bmad-module/README.md`.

## Catalog installation

The Allura catalog copy is a generated distribution. Once the catalog has been updated from a pinned standalone SHA, users may install it through that catalog's documented marketplace command. Until then, use the canonical checkout rather than assuming the catalog copy matches this repository.

## Verify an installation

```bash
npm test
npm run export:check
```

A runtime-specific smoke test should confirm that the manifest is accepted and that at least one read-only command/skill can be discovered. Integration availability is checked separately; absence of optional services is not an installation failure.

## Updating

```bash
git fetch origin
git switch main
git pull --ff-only
python3 scripts/validate_repository.py
```

Review release notes before updating a pinned production environment.
