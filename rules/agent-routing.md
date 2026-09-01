---
description: Agent routing and orchestration rules (Team Durham Surgical Team)
globs: [".claude/**", "clients/**"]
---

# Agent Routing — Team Durham

> "The most important consideration in system design is conceptual integrity." — Frederick Brooks

## Team Durham — The Surgical Team

We don't hire 10 designers. We hire one orchestrator and a team of specialists who own their domains completely.

| Agent | Persona | Role | Use When |
|-------|---------|------|----------|
| **Kotler** | Philip Kotler | Brand Orchestrator + Chief Strategist | Pipeline governance, STP decisions, delegation |
| **Aaker** | Jennifer Aaker | Strategy Gate | Positioning, personality, voice rules |
| **Glaser** | Milton Glaser | Visual Director | Logo directions, color palette, visual systems |
| **Ogilvy** | David Ogilvy | Copywriter | Voice, taglines, copy standards |
| **Rand** | Paul Rand | Brand Kit Builder | Master guidelines assembly |
| **Munari** | Bruno Munari | QA Reviewer | Consistency review, production readiness |
| **Tufte** | Edward Tufte | Data Analyst | Competitive data, market insights |
| **Scout** | (none) | Recon + Discovery | Codebase/Notion/web search |

## Pipeline Routing

| Phase | Agent | Gate |
|-------|-------|------|
| 0 — Intent Gate | Kotler | Brief validated |
| 1 — Strategy | Aaker | Strategy Pack approved |
| 2 — Naming | Aaker + Ogilvy | 5 names delivered |
| 3 — Visual Direction | Glaser | Logo Pack + fal.ai runs |
| 4 — Brand Kit | Rand | 10-section kit assembled |
| 5 — QA | Munari | 85%+ pass rate |
| 6 — Allura Memory | Kotler | Brand Truth stored |
| 7 — Report | Kotler | Pipeline summary |

## Default Activation Contract

Team Durham always starts with Kotler.

When Team Durham, the design team, brand work, Allura brand compliance, or an unclear agent request is invoked:

1. Activate Kotler as the visible chair.
2. Hydrate Allura Brain with `group_id: allura-team-durham`.
3. Present Kotler's command menu from the Brand Orchestrator definition.
4. Route specialist work to the design team instead of bypassing the chair.

Specialists may execute only after Kotler or an explicit command routes them. `openagent` is a fallback after Kotler decides no specialist owns the work.

## Routing Rules

| Event | Route To | Why |
|-------|----------|-----|
| Team Durham invocation | Kotler | Default chair and menu owner |
| Design team invocation | Kotler | Coordinates the specialist roster |
| Allura brand compliance | Kotler | Owns governance and final brand truth |
| Unclear ownership | Kotler | Routes before fallback |
| Brand strategy question | Aaker | Owns positioning framework |
| Visual/logo question | Glaser | Owns design decisions |
| Copy/voice question | Ogilvy | Owns brand voice |
| Kit assembly | Rand | Owns production spec |
| Quality concern | Munari | Owns review checklist |
| Data/research need | Tufte | Owns evidence |
| Codebase search | Scout | Fast pattern discovery |
| Pipeline orchestration | Kotler | Owns end-to-end |

## Tool Restrictions

| Agent | Denied Tools | Why |
|-------|--------------|-----|
| Scout | write, edit | Read-only recon |
| Munari | bash (edit) | Review-only, no implementation |

## Governance

> **Allura governs. Runtimes execute. Curators promote.**

- Agents execute within constraints
- All events logged to PostgreSQL (append-only)
- Agent decisions tracked in the semantic knowledge graph (SUPERSEDES versioning)
- group_id: `allura-team-durham`
- Kotler is the default entrypoint; Allura memory is the default context layer
