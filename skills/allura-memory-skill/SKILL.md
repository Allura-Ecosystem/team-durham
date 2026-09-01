---
name: allura-memory-skill
description: "Govern persistent Allura Brain memory operations."
allowed-tools:
  - MCP_DOCKER_search_memories
  - MCP_DOCKER_create_entities
  - MCP_DOCKER_create_relations
  - MCP_DOCKER_add_observations
  - MCP_DOCKER_find_memories_by_name
  - MCP_DOCKER_delete_entities
  - MCP_DOCKER_delete_observations
  - MCP_DOCKER_delete_relations
  - MCP_DOCKER_execute_sql
  - MCP_DOCKER_execute_unsafe_sql
  - MCP_DOCKER_list_tables
  - MCP_DOCKER_describe_table
  - MCP_DOCKER_insert_data
  - MCP_DOCKER_query_database
  - allura-brain_memory_search
  - allura-brain_memory_add
  - allura-brain_memory_promote
  - allura-brain_memory_get
  - allura-brain_memory_list
  - allura-brain_memory_delete
  - allura-brain_memory_update
  - allura-brain_memory_restore
  - allura-brain_memory_export
  - allura-brain_memory_list_deleted
  - mcp__allura-brain__memory_search
  - mcp__allura-brain__memory_add
  - mcp__allura-brain__memory_promote
  - mcp__allura-brain__memory_get
  - mcp__allura-brain__memory_list
  - mcp__allura-brain__memory_delete
  - mcp__allura-brain__memory_update
  - mcp__allura-brain__memory_restore
  - mcp__allura-brain__memory_export
  - mcp__allura-brain__memory_list_deleted
  - mcp__MCP_DOCKER__execute_sql
  - mcp__MCP_DOCKER__insert_data
  - mcp__MCP_DOCKER__search_memories
---

# Allura Memory Skill — Governance Layer

> **Principle:** A brain with manners, not a brain with a knife.

This skill governs **how** agents interact with Allura Brain safely.
It does **not** replace the memory server or the runtime skill (`mcp-docker-memory`).
It sits between the agent's intent and the memory system, enforcing discipline.

### Two-Layer Architecture

```
┌───────────────────────────────────────────────────────────┐
│  SKILL LAYER (this file)                                   │
│  Agent behavior contract — when, how, why to use memory   │
│  .claude/skills/allura-memory-skill/                       │
├───────────────────────────────────────────────────────────┤
│  RUNTIME LAYER (MCP Docker)                                │
│  Server packaging — Docker container, env vars, transport  │
│  database-server → PostgreSQL :5432 (episodic)             │
│  RuVector semantic graph → via governed Brain API          │
└───────────────────────────────────────────────────────────┘
```

**Dockerfile = runtime packaging. Skill = agent behavior contract.**

### Primary Tool Pathway

When Allura Brain memory tools are available and healthy, use them (they include
deduplication, scoring, and promotion logic). Names vary by harness: Claude Code may
expose `mcp__allura-brain__memory_search`; OpenCode/native aliases may expose
`allura-brain_memory_search`. When they are degraded or unavailable, fall back to
`MCP_DOCKER_*` / `mcp__MCP_DOCKER__*` tools which connect to the same databases directly.

| Operation | Primary (`allura-brain_*`) | Fallback (`MCP_DOCKER_*`) |
|-----------|---------------------------|---------------------------|
| Search episodic | `mcp__allura-brain__memory_search` or `allura-brain_memory_search` | `MCP_DOCKER_execute_sql` on `events` |
| Add episodic | `mcp__allura-brain__memory_add` or `allura-brain_memory_add` | `MCP_DOCKER_insert_data` on `events` |
| Search semantic | `mcp__allura-brain__memory_search` or `allura-brain_memory_search` | `MCP_DOCKER_search_memories` |
| Create entity | `mcp__allura-brain__memory_promote` or `allura-brain_memory_promote` | `MCP_DOCKER_create_entities` |
| Add observation | `mcp__allura-brain__memory_update` or `allura-brain_memory_update` | `MCP_DOCKER_add_observations` |
| Create relation | (via promote) | `MCP_DOCKER_create_relations` |
| Soft-delete | `allura-brain_memory_delete` | `MCP_DOCKER_add_observations` (mark DEPRECATED) |

**Companion skills:**
- `memory-client` — *when* to use memory (the Search→Work→Log loop, five modes)
- `mcp-docker-memory` — *which tools* to call (canonical MCP Docker tool names and query patterns)
- **This skill** — *how to use memory safely* (governance, promotion, conflict resolution, dual-pathway)

---

## When to use

Use this skill when:

- A user asks the agent to remember something important across sessions
- A workflow needs semantic search over prior events, outcomes, insights, or entities
- The agent must store new memories after a task completes
- The agent needs to retrieve relevant project or user context before acting
- The agent must distinguish raw traces from curated knowledge
- The agent needs to promote, supersede, deprecate, or revoke a memory
- The agent is unsure whether to write, update, or supersede a fact
- The agent found conflicting memories and needs resolution logic
- A memory system built on Allura Brain — PostgreSQL (episodic) + RuVector semantic graph — needs setup or troubleshooting

---

## Memory operating model

Treat memory as three distinct layers:

### Layer 1: Raw Trace (PostgreSQL)

- **What:** Session events, observations, evidence, commands, builds, tests
- **Store:** Every actionable event via `memory_add` or `MCP_DOCKER_insert_data`
- **Discipline:** Append-only. Never update or delete trace rows.
- **Status:** Raw. Not truth. Not actionable until promoted.

### Layer 2: Curated Insight (RuVector semantic graph)

- **What:** Promoted decisions, patterns, ADRs, brand truth, entity facts
- **Store:** Only after passing promotion policy (see `references/allura-promotion-policy.md`)
- **Discipline:** Version via `SUPERSEDES` relationships. Never mutate in place.
- **Status:** Canonical. This is actionable truth.

### Layer 3: Retrieval Context (Hybrid)

- **What:** The smallest useful context window for the current task
- **Source:** Both PostgreSQL trace and semantic graph insight, ranked by relevance
- **Discipline:** Prefer project-local first, add global only when it improves reasoning

```
┌─────────────────────────────────────────────────┐
│               RETRIEVAL CONTEXT                  │
│  (smallest useful window for current task)       │
├──────────────────┬──────────────────────────────┤
│  PROJECT-LOCAL   │          GLOBAL               │
│  (scoped to      │  (cross-project patterns,     │
│   group_id)       │   conventions, ADRs)          │
├──────────────────┴──────────────────────────────┤
│         CURATED INSIGHT (Semantic Graph)         │
│  Promoted, versioned, evidence-backed             │
├──────────────────────────────────────────────────┤
│             RAW TRACE (PostgreSQL)                │
│  Append-only, event-level, unvalidated            │
└──────────────────────────────────────────────────┘
```

---

## Instructions

When a user asks for memory-related work, follow this sequence:

### 1. Identify the intent

| Intent | Action | Layer |
|--------|--------|-------|
| Log what happened | Store raw trace | PostgreSQL |
| Remember a decision | Store trace, consider promotion | PostgreSQL → semantic graph |
| Retrieve context | Search both layers | Hybrid |
| Make a fact durable | Promote to insight | Semantic graph |
| Update a fact | Supersede, never overwrite | Semantic graph |
| Remove a fact | Soft-delete or deprecate | PostgreSQL / semantic graph |
| Recover a mistake | Restore within 30-day window | PostgreSQL |
| Check what's known | Summarize current state | Hybrid |

### 2. Retrieve before writing

**Always search before storing.** This prevents duplicates and reveals whether a candidate memory already exists.

```javascript
// Check for existing memories on the same topic
memory_search({
  query: "brand architecture decision monorepo",
  group_id: "allura-team-durham",
  limit: 5
})

// Check the semantic graph specifically for promoted insights
MCP_DOCKER_search_memories({ query: "brand architecture" })
```

**Possible outcomes of the search:**

| Result | Action |
|--------|--------|
| No match found | Proceed with store |
| Exact duplicate | Skip store entirely |
| Partial overlap | Store with reference to existing, or supersede |
| Conflicting fact | Preserve lineage, mark one as disputed or superseded |

### 3. Classify the memory

Every memory must have a type before storage:

| Type | Layer | Description | Example |
|------|-------|-------------|---------|
| `raw_event` | PostgreSQL | Session event, observation | "Agent kotler invoked for ember-fold" |
| `outcome` | PostgreSQL | Task result | "Brand kit assembled for ember-fold" |
| `insight` | Semantic graph (promoted) | Reusable pattern or lesson | "Use monorepo layout for multi-client projects" |
| `adr` | Semantic graph (promoted) | Architecture Decision Record | "ADR-007: Use MCP Docker as single runtime" |
| `entity_fact` | Semantic graph (promoted) | Fact about an entity | "Brand ember-fold uses Hero archetype" |
| `decision` | Semantic graph (promoted) | Strategic decision with rationale | "Decided: polling > queue for embedding backfill" |
| `relationship` | Semantic graph (promoted) | Link between entities | "Brand ember-fold PRODUCED_BY ember-fold project" |

### 4. Apply write discipline

#### Raw traces (PostgreSQL)

Raw traces are cheap and safe. Write freely, but write **signal, not noise:**

| Worth logging | Not worth logging |
|---------------|-------------------|
| Decisions and rationale | "Started working on X" |
| Patterns discovered | "Read file Y" |
| Gotchas and workarounds | Play-by-play of steps |
| Bug symptom → root cause → fix → prevention | Ephemeral status updates |
| Session reflections | Git-log-level events |

```javascript
// Good: decision with context
memory_add({
  group_id: "allura-team-durham",
  user_id: "aaker",
  content: "Decision: Position ember-fold as Hero brand. Rationale: Target audience responds to empowerment narratives. Validated by competitive analysis showing 7/10 competitors use Creator archetype, leaving Hero space open.",
  metadata: { source: "conversation", agent_id: "aaker" }
})

// Bad: noise without context
memory_add({
  group_id: "allura-team-durham",
  user_id: "aaker",
  content: "Working on strategy pack for ember-fold",
  metadata: { source: "conversation", agent_id: "aaker" }
})
```

#### Insights (semantic graph)

Insights are expensive and permanent. Apply strict discipline:

1. **Never create an insight without searching for duplicates first**
2. **Never mutate an existing insight node — create a new version and link with `SUPERSEDES`**
3. **Never promote without evidence — raw traces must exist to back the insight**
4. **Prefer supersede relationships over in-place edits**

### 5. Store evidence with memory

Every memory must carry:

| Field | Required | Description |
|-------|----------|-------------|
| `group_id` | ✅ Always | `allura-team-durham` (pattern: `^allura-[a-z0-9-]+$`) |
| `user_id` | ✅ Always | Team Durham agent name (kotler, aaker, glaser, rand, munari, ogilvy, tufte, scout) |
| `content` | ✅ Always | The actual memory text |
| `source` | ✅ Always | `conversation` or `manual` |
| `agent_id` | Recommended | Which agent produced this |
| `timestamp` | Automatic | Set by the system |
| `confidence` | For insights | 0-1 scale |

Do **not** write unsupported claims as durable truth. If you are guessing, mark it. If you lack evidence, store it as a raw trace and defer promotion.

### 6. Use dual-context retrieval

When acting on behalf of a project, load context in this order:

1. **Project-local first** — search with `group_id` scoped to the project
2. **Global only when needed** — add cross-project patterns, conventions, ADRs
3. **Smallest useful window** — return what's relevant, not a dump

See `references/allura-dual-context-retrieval.md` for the full retrieval protocol.

### 7. Handle conflicts safely

When two memories disagree:

1. **Preserve lineage** — never delete history
2. **Mark one as superseded** — use `SUPERSEDES` relationship, not destructive edits
3. **Prefer explicit status edges** over silent overwrites
4. **If uncertain** — store both and flag for human review

```javascript
// Supersede an old insight with a new one
MCP_DOCKER_create_entities({
  entities: [{
    name: "Decision: Use MCP Docker as single runtime (v2)",
    type: "Decision",
    observations: [
      "Supersedes: Decision v1 which assumed multiple runtimes",
      "Evidence: SASL bug proved single-runtime model is safer",
      "Validated: 2026-04-21 architecture audit"
    ]
  }]
})

MCP_DOCKER_create_relations({
  relations: [{
    source: "Decision: Use MCP Docker as single runtime (v2)",
    target: "Decision: Use MCP Docker as single runtime",
    relationType: "SUPERSEDES"
  }]
})
```

### 8. Troubleshoot systematically

See `references/allura-troubleshooting.md` for the full troubleshooting guide.

Quick checklist:

| Symptom | Check |
|---------|-------|
| Tools not available | Is `alluramemory-mcp` container running? `docker ps` |
| Empty search results | Verify `group_id` is `allura-team-durham` |
| `memory_add` fails | `group_id` pattern must match `^allura-[a-z0-9-]+$` |
| Promotion stuck | Normal — requires human approval via `curator:approve` |
| Duplicate insights | Did you search before creating? |
| Stale memory returned | Check `deprecated` and `SUPERSSEDES` status edges |

---

## Write permissions matrix

Not every agent can write everywhere. Respect these boundaries:

| Agent | PostgreSQL Write | Semantic Graph Write | Promotion |
|-------|-------------------|-------------|-----------|
| Kotler | ✅ | ✅ (SUPERSEDES only) | ✅ Request |
| Aaker | ✅ | ❌ | ✅ Request |
| Glaser | ✅ | ❌ | ✅ Request |
| Rand | ✅ | ❌ | ✅ Request |
| Ogilvy | ❌ | ❌ | ✅ Request |
| Munari | ❌ (read-only) | ❌ (read-only) | ❌ |
| Tufte | ❌ | ❌ | ✅ Request |
| Scout | ❌ (read-only) | ❌ (read-only) | ❌ |

**Key rules:**
- Munari and Scout are **read-only** — they flag issues but never fix directly
- Only Kotler can write to the semantic graph, and only via SUPERSEDES (never in-place edit)
- Any agent can *request* promotion, but approval requires HITL

---

## Guardrails

These are non-negotiable. Violating them causes data corruption or CHECK constraint failures.

1. **Do not confuse raw logs with validated knowledge.** PostgreSQL trace ≠ semantic graph insight.
2. **Do not mutate canonical insights in place.** Create new version nodes with `SUPERSEDES`.
3. **Do not promote memories without evidence or policy support.** See `references/allura-promotion-policy.md`.
4. **Do not create duplicate insight nodes when a superseding relationship is more appropriate.** Search first.
5. **Do not return stale memory without checking timestamps and status.** Check for `deprecated` flags and `SUPERSEDES` edges.
6. **Do not bypass Brain.** Never use local files as fallback. If Brain is down, fix Brain, then work.
7. **Do not work without `group_id`.** Every call requires it. Pattern: `^allura-[a-z0-9-]+$`.
8. **Do not skip the search-before-write step.** Always deduplicate before storing.

---

## Recovery procedures

### Soft-delete (within 30-day window)

```javascript
memory_delete({
  id: "<memory-id>",
  group_id: "allura-team-durham",
  user_id: "kotler"
})
```

### Restore a soft-deleted memory

```javascript
memory_restore({
  id: "<memory-id>",
  group_id: "allura-team-durham",
  user_id: "kotler"
})
```

### List soft-deleted memories (recovery window)

```javascript
memory_list_deleted({
  group_id: "allura-team-durham"
})
```

### Deprecate a semantic graph insight (without deleting history)

```javascript
// Create a deprecation marker, not a delete
MCP_DOCKER_add_observations({
  entityName: "Decision: Use MCP Docker as single runtime",
  observations: ["DEPRECATED: Superseded by v2 on 2026-04-22"]
})
```

---

## Recommended references

Read these for deep-dive knowledge:

| Reference | Content |
|-----------|---------|
| `references/allura-memory-model.md` | Node types, relationships, status semantics, schema |
| `references/allura-promotion-policy.md` | Promotion criteria, outcomes, HITL gate, rejection handling |
| `references/allura-dual-context-retrieval.md` | Project-local vs. global, ranking, context window discipline |
| `references/allura-troubleshooting.md` | MCP layer, PostgreSQL layer, memory logic layer, data integrity layer |

## Recommended scripts

| Script | Purpose |
|--------|---------|
| `scripts/validate-env.sh` | Verify Brain connectivity before any memory operations |
| `scripts/smoke-test-memory.sh` | End-to-end store/search/promote/revoke sanity check |
