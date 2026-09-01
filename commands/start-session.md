---
description: "Session initialization - run at the start of every session to load memory and verify system health"
allowed-tools: ["allura-brain_memory_search", "allura-brain_memory_add", "MCP_DOCKER_execute_sql", "MCP_DOCKER_insert_data", "MCP_DOCKER_search_memories", "mcp__allura-brain__memory_search", "mcp__allura-brain__memory_add", "mcp__MCP_DOCKER__execute_sql", "mcp__MCP_DOCKER__insert_data", "mcp__MCP_DOCKER__search_memories"]
---

# Session Start Protocol

Run at the start of every session. Hydrates context from Allura Brain before any planning or implementation.

Kotler is the default Team Durham chair. After hydration, load Kotler's command menu from the Brand Orchestrator definition and route design-team work through Aaker, Glaser, Ogilvy, Rand, Munari, and Tufte.

## Step 1: Hydrate Memory

Search for the last session reflection, open blockers, and live decisions.
**Try the available Allura Brain memory tool first; if degraded, fall back to `MCP_DOCKER_*`.**

**Tool namespace rule:** Claude Code may expose MCP tools as `mcp__allura-brain__memory_search`; OpenCode may expose the same operation as `allura-brain_memory_search`. Use whichever exact tool name is available in the current harness. Do not claim hydration happened unless one of these paths actually returned data.

### Primary path (Allura Brain)

```javascript
allura-brain_memory_search({
  query: "session reflection",
  group_id: "allura-team-durham",
  limit: 5
})

allura-brain_memory_search({
  query: "BLOCKER",
  group_id: "allura-team-durham",
  limit: 5
})

allura-brain_memory_search({
  query: "ARCHITECTURE_DECISION",
  group_id: "allura-team-durham",
  limit: 5
})
```

### Fallback path (MCP_DOCKER — when native tools fail)

```javascript
MCP_DOCKER_execute_sql({
  sql_query: "SELECT id, event_type, agent_id, created_at, metadata FROM events WHERE group_id = 'allura-team-durham' AND event_type IN ('SESSION_END', 'SESSION_START', 'BLOCKED', 'DESIGN_DECISION', 'LESSON_LEARNED') ORDER BY created_at DESC LIMIT 10"
})

MCP_DOCKER_search_memories({
  query: "architecture decision"
})
```

Report the most recent decisions and any blockers before continuing.

Then report:

- Active chair: `kotler`
- Memory group: `allura-team-durham`
- Menu source: Brand Orchestrator command menu
- Design team: Aaker, Glaser, Ogilvy, Rand, Munari, Tufte

### If hydration returns degraded

- Log the degradation: record `MEMORY_DEGRADED` event via MCP_DOCKER
- Continue with whichever path returned data
- Never silently skip hydration

## Step 2: Log Session Start

### Primary path

```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "SESSION_START: Hydrated from Allura Brain. Reviewed recent reflection, blockers, and live decisions before work began.",
  metadata: {
    source: "conversation",
    conversation_id: "current",
    agent_id: "kotler"
  },
  threshold: 0.9
})
```

### Fallback path (when Allura Brain memory_add fails)

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SESSION_START', 'allura-team-durham', 'kotler', 'completed',
    '{\"hydration_success\": true, \"brain_status\": \"degraded\", \"fallback_used\": true}'"
})
```

If brain was degraded, also log:

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'MEMORY_DEGRADED', 'allura-team-durham', 'kotler', 'completed',
    '{\"backend\": \"allura-brain\", \"error\": \"POSTGRES_PASSWORD missing\", \"fallback_used\": true}'"
})
```

## Step 3: Verify Brain Health (Telemetry)

Run a quick health check and record it:

```javascript
MCP_DOCKER_execute_sql({
  sql_query: "SELECT count(*) as total, count(CASE WHEN group_id = 'allura-team-durham' THEN 1 END) as team_durham FROM events"
})
```

If team-durham event count is 0, warn: "Team Durham memory appears empty — first session or data loss."

## If Brain is unavailable

- Warn the user
- Continue only with repo evidence
- Log the gap via MCP_DOCKER_insert_data (this always works if PostgreSQL is reachable)
- Log the gap once Brain returns

## Never Do This

- Skip hydration at session start
- Guess about prior work without searching first
- Proceed silently if memory is unreachable
- Let a native tool failure prevent the session from proceeding (always fall back)

## Always Do This

- Try the available Allura Brain memory tool first (`mcp__allura-brain__*` or `allura-brain_*`), then `MCP_DOCKER_*` as fallback
- Log degradation events so the feedback loop can detect infrastructure issues
- Include timestamp and group_id in observations
