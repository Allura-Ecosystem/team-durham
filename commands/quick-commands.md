---
description: "Quick slash commands for Team Durham Brand Maker"
allowed-tools: ["Read", "Grep", "Bash", "allura-brain_memory_search"]
---

# Quick Slash Commands

Type these directly in your IDE for fast access to Team Durham Brand Maker workflows.

Default route: Kotler starts every Team Durham session, hydrates Allura Brain with `group_id: allura-team-durham`, shows the Brand Orchestrator menu, then delegates to the design team.

## Pipeline Commands

| Command | Action |
|---------|--------|
| `/orchestrate` | Run brand production pipeline |
| `/status` | Check pipeline and infrastructure status |
| `/validate` | Run QA validation on deliverables |
| `/sync-governance` | Sync rules from Notion Agent OS |

## Session Commands

| Command | Action |
|---------|--------|
| `/start-session` | Initialize session and verify health |
| `/end-session` | Finalize and log session |
| `/party <task>` | Launch agents in parallel |

## Memory & Search Commands

| Command | Action |
|---------|--------|
| `/query <term>` | Search Allura Brain |
| `/scout <term>` | Fast discovery search |

## Agent Personas

| Command | Persona | Focus |
|---------|---------|-------|
| `/architect` | Kotler | Brand architecture |
| `/analyst` | Tufte | Data insights |
| `/scribe` | Rand/Ogilvy | Documentation |

## Default Design Team

| Agent | Focus |
|-------|-------|
| Kotler | Chair, STP, menu, final brand truth |
| Aaker | Strategy and positioning |
| Glaser | Visual direction and logo |
| Ogilvy | Naming, copy, and voice |
| Rand | Brand kit and design system |
| Munari | QA and compliance |
| Tufte | Data and evidence |

## Makefile Targets

| Target | Action |
|--------|--------|
| `make session-start` | Start a session |
| `make session-end` | End a session gracefully |
| `make session-status` | Show pipeline status |
| `make session-verify` | Verify checkpoint health |
| `make db-status` | Check DB connections |
| `make db-events` | Show recent events |

---

**All commands work with Allura Brain integration.**
