---
description: PostgreSQL best practices for Allura Brain episodic store
globs: [".claude/**", "clients/**"]
---

# PostgreSQL Best Practices — Team Durham

## The Rules

1. **Append-only events** — The `events` table is NEVER updated or deleted. INSERT only.
2. **group_id CHECK constraint** — Every INSERT MUST include a valid `group_id` matching `^allura-`.
3. **Use MCP tools** — NEVER `docker exec psql`. ALWAYS `MCP_DOCKER_*` tools.
4. **Parameterized queries** — Never concatenate user input into SQL strings.

## Table Schema

```sql
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  group_id VARCHAR(100) NOT NULL CHECK (group_id ~ '^allura-'),
  event_type VARCHAR(100) NOT NULL,
  agent_id VARCHAR(100) NOT NULL,
  workflow_id VARCHAR(100),
  status VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Insert Pattern

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'DESIGN_DECISION', 'allura-team-durham', 'kotler', 'completed', '{\"decision\": \"...\"}'"
})
```

## Query Patterns

```javascript
// Last session events
MCP_DOCKER_execute_sql({
  sql_query: "SELECT event_type, agent_id, status, created_at FROM events WHERE group_id = 'allura-team-durham' ORDER BY created_at DESC LIMIT 10"
})

// Count by type
MCP_DOCKER_execute_sql({
  sql_query: "SELECT event_type, COUNT(*) FROM events WHERE group_id = 'allura-team-durham' GROUP BY event_type ORDER BY count DESC"
})
```

## Team Durham Event Types

| Event Type | Description |
|-----------|-------------|
| `DDR_CREATED` | Design Decision Record created |
| `BRAND_INTERFACE_DEFINED` | Brand asset specification defined |
| `DESIGN_DECISION` | Strategic or visual decision made |
| `TASK_COMPLETE` | Task finished successfully |
| `TASK_FAILED` | Task failed |
| `BLOCKED` | Blocker encountered |
| `LESSON_LEARNED` | Pattern or insight captured |
| `AGENT_INVOKED` | Agent started working |
| `AGENT_COMPLETED` | Agent finished working |