# Plugin Contents

Bundled from Brand Maker:

- `agents/` — Team Durham canonical agent definitions plus alias map.
- `skills/` — Team Durham shared skills that validate as Codex plugin skills.
- `commands/` — command runbooks migrated from the canonical harness.
- `rules/` — routing, MCP, dashboard-specific, Postgres, semantic-graph, and documentation rules.
- `source/codex/` — Codex adapter, persona research, and governance bridge.
- `source/opencode/` — OpenCode agent wrappers for reference.
- `source/bmad/` — BMAD Builder configs and Team Durham persona overrides.
- `governance/` — plugin-level governance notes.

Excluded from plugin skills:

- Runtime package folders that do not contain `SKILL.md`.
- Empty artifact folders.
- Duplicate `memory-client copy`.
