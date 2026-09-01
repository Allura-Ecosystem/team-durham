# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What This Is

Brand Maker is a multi-agent brand production system ("Team Durham") that takes a client brief through an 8-phase pipeline to produce complete brand identity deliverables. It runs on the Allura Brain infrastructure (PostgreSQL (episodic) + RuVector semantic graph + MCP Docker).

## Commands

### Make Commands
```bash
make brand         # Run full brand production pipeline (orchestrated by harness)
make status        # Check pipeline and infrastructure status
make validate      # Validate deliverables against rubric
make clean         # Remove generated files (keeps source)
make images        # Execute fal.ai image generation
make docker-up     # Start Allura Brain containers
make docker-down   # Stop containers
make db-status     # Check PostgreSQL + semantic graph connections
make db-events     # Show recent Team Durham events
make penpot-status # Check Penpot MCP server health (both servers)
make penpot-create # Scaffold Penpot board for CLIENT
make penpot-export # Export Penpot deliverables for CLIENT
```

### Codex Commands
```
/orchestrate       # Run the 8-phase brand production pipeline
/status            # Check pipeline status for all clients or specific client
/validate          # Run QA validation on deliverables
```

New client: `cp -r clients/_template clients/<brand-slug>`

## Harness Architecture

Team Durham has one canonical agent layer and several tool-specific adapters:

- `.claude/agents/` — canonical agent definitions. Edit agent behavior here.
- `.agents/skills/` — shared skill library used by Codex, Claude, and OpenCode adapters.
- `.Codex/` — Codex-facing adapter and onboarding index for this repo.
- `.opencode/` — legacy OpenCode adapter, retained for compatibility.

| Phase | Agent | Deliverable | Penpot Skill (if enabled) |
|-------|-------|-------------|---------------------------|
| 0 Intent Gate | Kotler (Philip Kotler) | Validated brief | — |
| 1 Strategy | Aaker (Jennifer Aaker) | Strategy Pack (`brand-truth.json`) | — |
| 2 Naming | Aaker + Ogilvy (David Ogilvy) | Naming Pack | — |
| 3 Visual Direction | Glaser (Milton Glaser) | Logo Pack + fal.ai runs | `penpot-create-board` → `penpot-foundations` → `penpot-upload-media` |
| 4 Brand Kit | Rand (Paul Rand) | Brand Kit (10 sections) | `penpot-implement-mockups` |
| 5 QA | Munari (Bruno Munari) | QA Report | `penpot-export-handoff` |
| 6 Allura Memory | Kotler | Brand Truth JSON | — |
| 7 Report | Kotler | Pipeline Summary | — |

**Penpot Integration Rule:** STP before pixels. No Penpot work until Aaker's `brand-truth.json` is locked. Penpot skills live in `.agents/skills/penpot-*/` and are surfaced to Codex through `.Codex/skills/README.md`.

### Key Constraints

- All data isolated by `group_id = 'allura-team-durham'` (PostgreSQL enforces `^allura-` prefix)
- No visual work without Aaker strategy sign-off first
- QA (Munari) is read-only — flags issues but never fixes; fixes route back to producing agent
- Events table is append-only (no UPDATE/DELETE)
- Vision agents (Aaker, Glaser, Rand, Munari, Scout) must analyze actual image files, not just metadata

### Model Routing

Vision-critical agents get multimodal models; text-only agents use `glm-5.1`. See `docs/ARCHITECTURE.md` for the full routing table.

### Infrastructure

Docker Compose runs: WordPress + MySQL + phpMyAdmin + Allura UX Board (Next.js on port 3101 prod / 3102 dev). The Allura Brain layer uses PostgreSQL (episodic memory), the RuVector semantic graph, and MCP Docker (toolkit).

## Project Layout

- `clients/` — One folder per brand client; each contains numbered phase deliverables (01-07)
- `clients/_template/` — Copy this for new clients
- `.claude/` — Canonical harness location (agents, commands, rules, Claude skill copies)
- `.agents/skills/` — Shared skill library
- `.Codex/` — Codex adapter that maps Team Durham agents, commands, and skills into this workspace
- `.opencode/` — Legacy OpenCode harness adapter
- `scripts/` — Shell utilities (status, clean, validate)
- `docs/` — Architecture docs, DDRs, Brand Dictionary
- `allura-app/` — Next.js frontend (Allura UX Board)
- `wordpress/` — WordPress theme files
- `docker/` — Docker configs and init scripts

## Dependencies

Root `package.json` has: `@fal-ai/client` (image generation), `sharp` (image processing), `canvas`, `dotenv`. The `allura-app/` directory is a separate Next.js project with its own dependencies.

## Current Sprint Context

Active sprint (ending 2026-04-26) focuses on making merged code functional — no new features. The Allura Memory v2.0 app at `localhost:3100` needs infrastructure fixes, DB schema work, and Next.js 16 compatibility fixes. See `DEV_TEAM_DIRECTIVE.md` for the full checklist.
