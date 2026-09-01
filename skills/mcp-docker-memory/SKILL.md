---
name: mcp-docker-memory
description: Use this skill when interacting with the Allura Brain memory system via MCP Docker. Trigger when the user mentions PostgreSQL events, the semantic knowledge graph, Allura Brain, memory system, logging events, or storing brand truth. This skill provides the canonical tool names and query patterns.
---

# MCP Docker Memory System Skill

> **Architecture:** One runtime (MCP Docker Toolkit), one skill (this file), one path.
> **Runtime:** MCP Docker Toolkit registers and runs all MCP servers.
> **Skill:** This file tells Team Durham how and when to use those servers.
> **NEVER** duplicate the runtime layer. **NEVER** add a second MCP server entry for the same capability.

---

## Registered MCP Servers

| Server | Registered Via | Purpose | Status |
|--------|---------------|---------|--------|
| `database-server` | MCP Docker Toolkit | PostgreSQL read/write | ✅ Active |
| `neo4j-cypher` | MCP Docker Toolkit | Raw Cypher queries | ❌ Removed (AD-50) |
| `neo4j-memory` | MCP Docker Toolkit | Knowledge graph CRUD | ❌ Removed (AD-50) |
| `allura-brain` | MCP Docker Toolkit | 10 canonical memory ops | Use `allura-brain_memory_*` tools directly |

> **NOTE:** `allura-memory-mcp` Docker container is the backend service that MCP Docker's `allura-brain` routes to. It stays running but is NOT a second MCP server entry. One runtime, one registration.

---

## Canonical Tool Names

### PostgreSQL (via `database-server`)

| Operation | Tool Name |
|-----------|-----------|
| Natural language SQL | `MCP_DOCKER_query_database` |
| Raw SQL read | `MCP_DOCKER_execute_sql` |
| Raw SQL write | `MCP_DOCKER_execute_unsafe_sql` |
| Insert row | `MCP_DOCKER_insert_data` |
| List tables | `MCP_DOCKER_list_tables` |
| Describe table | `MCP_DOCKER_describe_table` |

### Semantic Knowledge Graph (via `allura-brain_memory_*`)

| Operation | Tool Name |
|-----------|-----------|
| Read full graph | `MCP_DOCKER_read_graph` |
| Create entities | `MCP_DOCKER_create_entities` |
| Create relations | `MCP_DOCKER_create_relations` |
| Add observations | `MCP_DOCKER_add_observations` |
| Search memories | `MCP_DOCKER_search_memories` |
| Find by name | `MCP_DOCKER_find_memories_by_name` |
| Delete entities | `MCP_DOCKER_delete_entities` |
| Delete observations | `MCP_DOCKER_delete_observations` |
| Delete relations | `MCP_DOCKER_delete_relations` |

---

## PostgreSQL — Episodic Memory

### Event Types

| Event Type | When to Use |
|------------|-------------|
| `AGENT_INVOKED` | When an agent starts a session |
| `AGENT_COMPLETED` | When an agent finishes successfully |
| `AGENT_FAILED` | When an agent encounters an error |
| `DESIGN_DECISION` | For strategic design decisions |
| `DDR_CREATED` | For major design decision records |
| `SKILL_PROPOSED` | When a new skill is proposed |
| `SKILL_APPROVED` | When a skill proposal is approved |
| `CLIENT_FEEDBACK` | When client feedback is routed |
| `BRAND_GUARDIAN_AUDIT` | Post-delivery compliance check |
| `TRADEMARK_SCREENED` | Name availability screening |
| `TASK_COMPLETE` | When a task is finished |
| `BLOCKED` | When progress is blocked |
| `LESSON_LEARNED` | For insights to remember |

### Insert Event Pattern

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'DESIGN_DECISION', 'allura-team-durham', 'aaker', 'completed', '{\"json\": \"summary\"}'"
})
```

### Query Pattern

```javascript
MCP_DOCKER_execute_sql({
  sql_query: "SELECT * FROM events WHERE group_id = 'allura-team-durham' AND agent_id = 'kotler' ORDER BY created_at DESC LIMIT 10"
})
```

---

## Semantic Knowledge Graph

### When to use which server

| Need | Use | Why |
|------|-----|-----|
| Knowledge graph CRUD | `allura-brain_memory_*` | Entity/relation/observation operations |
| Brand Truth / promoted facts | `neo4j-memory` | Structured memory entities |

### Promotion Criteria (ALL must be true)

1. Decision is reusable across ≥2 projects
2. Decision was validated — not just proposed
3. No duplicate exists in the semantic knowledge graph

### Write Pattern (Always search first)

```javascript
// 1. Search first — never create duplicates
MCP_DOCKER_search_memories({ query: "decision text" })

// 2. Only create if no duplicate found
MCP_DOCKER_create_entities({
  entities: [{
    name: "Decision: Use MCP Docker as single runtime",
    type: "Decision",
    observations: [
      "One runtime layer (MCP Docker Toolkit) + one skill layer (.claude/skills/)",
      "No duplicate MCP server registrations for same capability",
      "Validated: 2026-04-21 architecture audit"
    ]
  }]
})
```

### Brand Truth Storage (Phase 6)

```javascript
MCP_DOCKER_create_entities({
  entities: [{
    name: "Brand: [Brand Name]",
    type: "Brand",
    observations: [
      "Archetype: Primary/Secondary",
      "Positioning: [statement]",
      "Promise: [brand promise]",
      "Project: [project name]",
      "group_id: allura-team-durham"
    ]
  }]
})

MCP_DOCKER_create_relations({
  relations: [{
    source: "Brand: [Brand Name]",
    target: "Project: [project name]",
    relationType: "PRODUCED_BY"
  }]
})
```

---

## Non-Overload Rules

1. **PostgreSQL** is for high-volume event logs (commands, builds, tests, every session action)
2. **The semantic knowledge graph** is for promoted memory only (ADRs, patterns, recurring failures + validated fixes)
3. **Batch writes:** At most **one** semantic graph write per completed task/decision
4. **De-duplicate:** **Search first**; only create if new
5. **Aggregate bursts** into a single "session checkpoint" insight

---

## Architecture Rule

**ONE runtime. ONE skill wrapper. ONE orchestration path.**

```
Team Durham Agent
    ↓
.claude/skills/mcp-docker-memory (this file)
    ↓
MCP Docker Toolkit (single runtime)
    ├── database-server → PostgreSQL :5432
    └── neo4j-memory   → Neo4j :7687
```

**NEVER add:**
- A second MCP server entry for the same DB
- An HTTP gateway wrapping an already-registered server
- A `docker exec` path bypassing MCP Docker
- Both `allura-memory` HTTP entry AND `allura-brain` MCP Docker entry

---

## Common Queries

### Last Session Event
```sql
SELECT * FROM events
WHERE agent_id = 'kotler' AND group_id = 'allura-team-durham'
ORDER BY created_at DESC LIMIT 1
```

### Recent Decisions
```sql
SELECT * FROM events
WHERE event_type IN ('DESIGN_DECISION', 'DDR_CREATED')
  AND group_id = 'allura-team-durham'
ORDER BY created_at DESC LIMIT 10
```

### Pipeline Status
```sql
SELECT agent_id, event_type, status, created_at
FROM events
WHERE group_id = 'allura-team-durham'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
```

---

## Invariants

- `group_id = 'allura-team-durham'` for ALL operations
- PostgreSQL events are **append-only** — never UPDATE or DELETE
- Semantic graph writes require **deduplication search first**
- At most **one semantic graph write per task**
- **NEVER use `docker exec`** — use MCP Docker tools only
- **NEVER register duplicate MCP servers** — one runtime, one skill, one path
