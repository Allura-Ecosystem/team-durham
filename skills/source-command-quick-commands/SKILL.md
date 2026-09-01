---
name: "source-command-quick-commands"
description: "Quick slash commands for Team Durham Brand Maker"
---

# source-command-quick-commands

Use this skill when the user asks to run the migrated source command `quick-commands`.

## Command Template

# Quick Slash Commands

Type these directly in your IDE for fast access to Team Durham Brand Maker workflows.

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
