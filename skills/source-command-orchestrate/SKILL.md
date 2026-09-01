---
name: "source-command-orchestrate"
description: "Run the 8-phase brand production pipeline for a client"
---

# source-command-orchestrate

Use this skill when the user asks to run the migrated source command `orchestrate`.

## Command Template

# Brand Orchestration Mode

You are now in **Brand Orchestration Mode** — the 8-phase brand production pipeline.

## Instructions

1. Run Scout recon first: hydrate Allura Brain and map the active client/workspace
2. Read `BLUEPRINT.md` for the project's single source of design intent
3. Read `.Codex/agents/` for the Team Durham agent roster
4. Check `clients/` for the target client workspace

## Pipeline

The user will specify a client. Default is the first client found in `clients/`.

| Phase | Agent | Output |
|-------|-------|--------|
| 0 — Intent Gate | Kotler | Validated brief |
| 1 — Strategy | Aaker | Strategy Pack |
| 2 — Naming | Aaker + Ogilvy | Naming Pack |
| 3 — Visual Direction | Glaser | Logo Pack + fal.ai runs |
| 4 — Brand Kit | Rand | Brand Kit (10 sections) |
| 5 — QA | Munari | QA Report |
| 6 — Allura Memory | Kotler | Brand Truth JSON |
| 7 — Report | Kotler | Pipeline Summary |

## Rules

- **STP before everything.** No creative work without a locked positioning statement.
- **Scout before strategy.** No phase work until Brain hydration and recon are complete.
- **One phase at a time.** Complete and validate each phase before proceeding.
- **Log every event.** All agent invocations and decisions go to Allura Brain (primary) or MCP_DOCKER (fallback).
- **Gate at each phase.** Ask for approval before moving to the next phase.
- **group_id**: `allura-team-durham`
- **Tool namespace rule:** Codex uses `mcp__allura-brain__*`; OpenCode uses `allura-brain_*`. Use whichever exists.

## Brain Integration (MANDATORY)

Every phase gate MUST log to Allura Brain. No exceptions.

### At Pipeline Start (Phase 0)
```javascript
allura-brain_memory_search({
  query: "{client-slug} brand pipeline",
  group_id: "allura-team-durham",
  limit: 10
})
```
Search before starting. Load prior context, decisions, and blockers for this client.

### At Each Phase Gate (Phases 0–7)
```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "{agent-name}",
  content: "PHASE_{N}_{STATUS}: {client-slug} — {one-line summary of what was decided/delivered}",
  metadata: {
    source: "conversation",
    agent_id: "{agent-name}",
    phase: N,
    client: "{client-slug}",
    deliverable: "{filename}"
  }
})
```
Log the phase completion WITH the deliverable filename. This makes `/status` queries work.

### At Decision Points (any phase)
```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "{agent-name}",
  content: "DECISION: {client-slug} — {what was decided} because {why}",
  metadata: {
    source: "conversation",
    agent_id: "{agent-name}",
    decision_type: "DESIGN_DECISION|STRATEGY_DECISION|ARCHITECTURE_DECISION",
    client: "{client-slug}"
  }
})
```

### At Blockers
```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "{agent-name}",
  content: "BLOCKER: {client-slug} — {what is blocked} — {what is needed to unblock}",
  metadata: {
    source: "conversation",
    agent_id: "{agent-name}",
    client: "{client-slug}",
    blocker: true
  }
})
```

### At Pipeline End (Phase 7)
```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "PIPELINE_COMPLETE: {client-slug} — All 8 phases delivered. {summary of key decisions and outcomes}",
  metadata: {
    source: "conversation",
    agent_id: "kotler",
    client: "{client-slug}",
    pipeline_complete: true
  }
})
```

### If Brain is unavailable
Fall back to `MCP_DOCKER_insert_data` on the `events` table. Log `MEMORY_DEGRADED` via the same path. Never skip logging.

## Execution

1. Identify the target client from `clients/`
2. Read `BLUEPRINT.md` for design intent
3. **Search Brain** for prior context on this client (`memory_search` with client slug)
4. Execute Phase 0: Validate brief with Kotler agent
5. **Log Phase 0 gate** to Allura Brain
6. Proceed sequentially through all 8 phases, **logging each phase gate to Brain**
7. At Phase 7, log `PIPELINE_COMPLETE` to Brain

## If the user says "status"

Show the current pipeline status for the active client by:
1. Querying Allura Brain: `memory_search({ query: "{client} phase", group_id: "allura-team-durham", limit: 20 })`
2. Checking which deliverables exist in `clients/{brand}/`
3. Reporting completion status for each phase
4. Cross-referencing Brain events with filesystem deliverables
