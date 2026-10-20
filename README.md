# Team Durham

Turn an approved brief into clear brand strategy, copy, visual direction, and a reviewed brand kit.

Team Durham supplies seven specialist roles for Claude Code and Codex. Kotler coordinates the work, Aaker anchors the strategy, production specialists create the assets, and Munari reviews them independently. The host supplies tools and execution; optional integrations add design, publishing, and memory capabilities.

Use the [Allura plugin catalog](https://github.com/Allura-Ecosystem/allura-plugins#installation) for installation, or this repository for canonical source and local development. Catalog copies are generated from a pinned source commit.

## Start with the task

Give a clear request, such as:

> Review our README against the approved Allura voice. Make the first step clear, preserve technical accuracy, and identify claims that need evidence.

For broader brand work, supply the audience, objective, approved strategy, and source assets. Ask for **Menu** or **Help** to get next steps, prompt help, Council, work, a bounded loop, validation, or more specialist workflows. A clear correction proceeds without a full intake ceremony.

## How Team Durham operates

```text
Brief and relevant context
  → Approved audience, positioning, and brand truth
  → Specialist production
  → Independent QA and producer corrections
  → Authorized delivery with evidence and remaining limits
```

This describes a full brand-production route. Smaller tasks reuse approved inputs and use checks suited to their risk. Strategy precedes visual production; QA reports findings without changing the artifact. Protected actions, external delivery, and semantic memory promotion retain human approval requirements.

Optional Allura Brain access adds scoped context and outcome retention. Its availability and any successful write must be reported from actual receipts. Neither a role definition nor a diagram establishes that agents ran or that every decision was retained.

## What is included

- **7 named canonical roles and 7 loadable definitions**; evidence, recon, workflow, and trust are responsibilities of retained roles
- **77 skills** and **22 commands**
- Contracts, governance rules, prompt evaluations, Claude/Codex manifests, and a BMAD adapter
- A deterministic catalog export contract with source-revision provenance

> Supporting registrations and the generic fallback were retired on 2026-10-16. Capability ownership is explicit in the retained roles; Git history preserves prior definitions. See [agent routes](docs/ALIASES.md).

## Canonical roles

| Definition | Persona | Responsibility |
| --- | --- | --- |
| `brand-orchestrator` | Philip Kotler | Pipeline routing and STP gate |
| `brand-strategist` | Jennifer Aaker | Positioning, personality, and brand truth |
| `copywriter` | David Ogilvy | Naming, voice, and copy |
| `visual-director` | Milton Glaser | Visual direction and logo systems |
| `brand-kit-builder` | Paul Rand | Brand kit and design-system assembly |
| `qa-reviewer` | Bruno Munari | Read-only consistency and readiness QA |
| `data-analyst` | Edward Tufte | Research and evidence-based analysis |

## Operating model

1. **Discover before changing** — Tufte locates authoritative context and risks.
2. **Strategy before pixels** — Kotler and Aaker lock audience, positioning, and brand truth first.
3. **Specialists produce** — Ogilvy, Glaser, and Rand create the system and deliverables.
4. **QA stays independent** — Munari reports findings; producing roles perform fixes.
5. **Claims require evidence** — Tufte establishes evidence requirements and provenance; Munari independently verifies the actual artifact.
6. **Governance wins over persona** — project/client authority and safety constraints outrank stylistic simulation.

## Install

Clone the canonical repository:

```bash
git clone https://github.com/Allura-Ecosystem/team-durham.git
cd team-durham
python3 scripts/validate_repository.py
```

For Claude Code development, load the checkout as a local plugin:

```bash
claude --plugin-dir "$PWD"
```

The generated `allura-plugins` catalog package is the marketplace route. Its provenance identifies the exact standalone commit from which it was exported. See [Installation](docs/INSTALLATION.md) and [Catalog export](docs/CATALOG-EXPORT.md).

## Configure

Team Durham works without external services for file-based strategy and production guidance. Integrations are opt-in:

| Capability | Configuration | When unavailable |
| --- | --- | --- |
| Allura Memory / Brain | MCP server plus scoped `group_id` | No durable recall/write; workflow must report degraded state |
| Figma | Runtime MCP configuration; token supplied outside the repo | Figma-specific skills stop or offer a file-based path |
| fal.ai | `FAL_KEY` in the caller's secret store | Image-generation steps stop; no synthetic success evidence |
| Notion | `NOTION_TOKEN` in the caller's secret store | Publishing steps are skipped and reported |
| Docker MCP toolkit | Docker and configured MCP gateway | Docker-backed tools remain unavailable |
| LibreOffice MCP | `MCP_LIBRE_ROOT` and `fastmcp` | Office automation remains unavailable |

Never commit credentials. Full details: [Configuration](docs/CONFIGURATION.md) and [Degraded behavior](docs/DEGRADED-BEHAVIOR.md).

## Repository map

```text
agents/             seven canonical role definitions
commands/           canonical user-facing workflows
skills/             canonical reusable procedures
contracts/          machine-readable handoff contracts
governance/         authority and policy notes
rules/              runtime guidance
evals/              canonical prompt-evaluation snapshots and policy
bmad-module/         generated/runtime adapter source
.claude-plugin/      Claude manifest
.codex-plugin/       Codex manifest
scripts/             validation and catalog export
clients/             preserved historical/client workspace data; not exported
.opencode/           preserved legacy Team RAM/OpenCode compatibility surface; not canonical
```

## Ecosystem boundaries

- **Team Durham** owns this brand-production role/command/skill source.
- **Allura Memory** is an optional governed memory dependency, not bundled here.
- **Team RAM** is a separate engineering-delivery harness. The preserved `.opencode/` surface in this repository is compatibility history, not Team Durham authority.
- **allura-plugins** is a distribution catalog. Its Team Durham directory must be generated from a pinned commit of this repository.

See [Architecture](ARCHITECTURE.md) for authority and dependency boundaries.

## Validate and export

```bash
python3 scripts/validate_repository.py
python3 scripts/export_catalog.py --check
python3 scripts/export_catalog.py --output /tmp/team-durham-export
```

The exporter injects the source Git SHA and a SHA-256 file inventory into the generated package. CI verifies manifests, role counts, paths, JSON contracts, evaluations, and export reproducibility.

## Security and contributing

Read [SECURITY.md](SECURITY.md) before reporting vulnerabilities and [CONTRIBUTING.md](CONTRIBUTING.md) before changing canonical surfaces.

## License

MIT — see [LICENSE](LICENSE).

## Adaptive workflow

See [the shared operating policy](governance/adaptive-workflow.md). Choose a
quick, standard, or sensitive route; retain one accountable producer and select
review by risk. Canonical agents inherit the configured model. Overrides require
actual availability and capability checks, not a fixed persona/model pairing.
ContextPacket v1.1 adds tenant/project, timestamp, revisions, authority references,
and Brain status. Older packets must be refreshed to this scoped contract before
reuse. Independent work may parallelize after approved inputs; locked strategy,
name-dependent logos, human promotion/shipping approval, and read-only QA remain.

`python3 scripts/validate_repository.py` includes offline prompt-contract routing
fixtures. These checks do not establish live latency, cost, or model quality.
Pilot representative tasks and compare elapsed time, handoffs, review rounds,
first-pass acceptance, and cost per accepted result before claiming improvement.
