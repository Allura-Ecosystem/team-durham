# Team Durham Architecture

## Product boundary

Team Durham is a source-first agent product. Its durable behavior is expressed as reviewed text definitions, machine-readable manifests and contracts, and deterministic export tooling. It does not bundle an agent runtime, a database, client credentials, or a memory service.

## Authority layers

Highest authority appears first:

1. The active client's approved brief, locked brand truth, and explicit governance.
2. `contracts/`, `governance/`, and `rules/` in this repository.
3. Canonical definitions in `agents/`, `commands/`, `skills/`, and `evals/`.
4. Runtime manifests and adapters (`.claude-plugin/`, `.codex-plugin/`, `bmad-module/`).
5. Generated catalog exports.
6. Preserved compatibility or historical workspace surfaces (`.opencode/`, `clients/`, `PROGRESS.md`).

Generated exports and adapters may not silently override their source.

## Role model: 12 + 1

There are **13 agent definition files** and **12 canonical roles**.

- The 12 canonical roles are listed in `SOURCE.json` and represent Team Durham's product roster.
- `agents/openagent.md` is a persona-free fallback definition retained for runtime compatibility.
- Plugin manifests load all 13 definitions because the fallback must remain usable.
- Product language must say either “12 canonical roles” or “13 loadable agent definitions”; it must not call both numbers the same thing.

This resolves the earlier ambiguity without deleting a supported definition or inventing a thirteenth specialist.

## Workflow

```text
brief
  │
  ▼
recon ──► STP / strategy gate ──► naming + voice
                                  │
                                  ▼
                         visual direction
                                  │
                                  ▼
                       brand-kit assembly
                                  │
                                  ▼
                     independent QA + evidence
                                  │
                                  ▼
                     approved delivery / publish
```

Munari/`qa-reviewer` is read-only by design. A failed gate routes work back to the producing role. Memory writeback records evidence only after the underlying action succeeds.

## Runtime surfaces

### Claude Code

`.claude-plugin/plugin.json` loads the canonical agents, skills, and commands. Claude-specific runtime syntax belongs in the manifest; behavior belongs in canonical directories.

### Codex

`.codex-plugin/plugin.json` publishes skills and commands. Codex plugin packaging does not create native subagents, so Team Durham also includes BMAD adapter material under `bmad-module/`.

### OpenCode / Team RAM compatibility

The root `.opencode/`, `opencode.jsonc`, and `AGENTS.md` predate this canonical migration and are intentionally preserved. They describe an engineering Team RAM harness and are excluded from catalog export. New Team Durham behavior must not be authored there.

## Ecosystem relationships

### Allura Memory

Allura Memory (also called Allura Brain in existing definitions) is an optional external system for scoped episodic recall, semantic retrieval, and governed writeback. Team Durham uses `group_id = allura-team-durham` where a connected deployment requires that scope. The repository does not ship Memory, credentials, databases, or a network endpoint.

### Team RAM

Team RAM is a separate coding and engineering delivery team. It may build or review Team Durham, but its Brooks/Woz/etc. roster is not part of the canonical Durham roster.

### allura-plugins

`Allura-Ecosystem/allura-plugins` is a catalog/distribution repository. The authoritative direction is:

```text
team-durham (canonical source at an exact Git SHA)
  └── scripts/export_catalog.py
        └── allura-plugins/team-durham (generated distribution)
```

The consumer repository must pin the standalone source SHA. Changes flow from this repository outward, never in reverse by hand-editing the generated package.

## Export architecture

`export-manifest.json` declares every exported root. `scripts/export_catalog.py` copies only those paths, rejects escaping symlinks, rewrites the exported `SOURCE.json` with the exact source revision, and creates `EXPORT.json` containing deterministic SHA-256 hashes. Workspace/client compatibility paths are excluded by construction.

## Failure and degradation

Optional integrations fail closed for claims:

- Missing Memory means no durable recall or writeback claim.
- Missing design/image/publishing tools means that phase is blocked or explicitly skipped.
- A local artifact is not proof of remote publication.
- A queued memory event is not a successful canonical write.
- No integration failure may be hidden behind a success response.

See [docs/DEGRADED-BEHAVIOR.md](docs/DEGRADED-BEHAVIOR.md).
