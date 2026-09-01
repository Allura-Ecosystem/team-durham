# Allura Dual-Context Retrieval

## Principle

Load the smallest useful context window for the current task.
A context dump is not context — it's noise.

---

## Retrieval order

When a task begins, load memory in this order:

```
1. PROJECT-LOCAL  ──→  scoped to group_id / specific project
2. GLOBAL         ──→  cross-project patterns, ADRs, conventions
3. EVIDENCE       ──→  supporting PostgreSQL traces (only if needed)
```

### Step 1: Project-local first

Search for memories scoped to the project you're working on.

```javascript
// Search for project-specific context
memory_search({
  query: "ember-fold brand strategy positioning",
  group_id: "allura-team-durham",
  limit: 5
})

// Search for project-specific decisions
memory_search({
  query: "ember-fold design decision",
  group_id: "allura-team-durham",
  limit: 5
})
```

**Why first:** Project-local memories are the most relevant. They reduce hallucination risk and keep the context window tight.

### Step 2: Global if needed

Add cross-project patterns, conventions, or ADRs only when they improve reasoning for the current task.

```javascript
// Global patterns that apply across projects
memory_search({
  query: "MCP Docker runtime architecture",
  group_id: "allura-team-durham",
  limit: 3
})

// Global conventions
MCP_DOCKER_search_memories({ query: "naming convention brand" })
```

**When to add global:**
- The task involves a cross-cutting concern (infrastructure, conventions, shared patterns)
- No project-local memory covers the need
- You need to validate a decision against established ADRs

**When NOT to add global:**
- Project-local context is sufficient
- The global context would dilute focus
- The task is narrow and self-contained

### Step 3: Evidence traces (optional)

Only load raw PostgreSQL traces when you need to:
- Verify the evidence behind a promoted insight
- Debug a discrepancy between expected and actual behavior
- Reconstruct a decision timeline

```javascript
MCP_DOCKER_execute_sql({
  sql_query: "SELECT event_type, agent_id, status, created_at, metadata FROM events WHERE group_id = 'allura-team-durham' AND metadata::text LIKE '%ember-fold%' ORDER BY created_at DESC LIMIT 10"
})
```

**Rule:** Do not load raw traces unless you need evidence. They are not actionable on their own.

---

## Ranking signals

When multiple memories match a search, rank by:

| Signal | Weight | Description |
|--------|--------|-------------|
| Semantic similarity | High | How closely the memory matches the query intent |
| Recency | Medium | Newer memories are more likely to reflect current state |
| Status | High | Prefer `curated` over `raw`, prefer non-deprecated over deprecated |
| Confidence score | Medium | Higher `score` values indicate more validated insights |
| Project scope | Medium | Project-local matches rank above global matches for project tasks |

### Resolution: When to follow the chain

If a search returns a deprecated or superseded memory:

1. **Check for `SUPERSEDES` relationships** — follow to the current version
2. **Check `deprecated` flag** — if true, find the replacement
3. **Return the active version**, not the stale one

```javascript
// When search returns a deprecated insight
// 1. Note the entity name from the result
// 2. Search for superseding version
MCP_DOCKER_search_memories({ query: "MCP Docker single runtime v2" })

// 3. If found, return the v2 content
// 4. If not found, flag that the original is deprecated with no replacement
```

---

## Context window discipline

### What to include

| Include | Why |
|---------|-----|
| Current project decisions | Directly relevant |
| Active patterns and ADRs | Guide correct behavior |
| Recent session reflections | What happened last, what's still open |
| Blockers and open questions | What needs attention |

### What to exclude

| Exclude | Why |
|---------|-----|
| Raw event logs (unless debugging) | Too granular, not actionable |
| Deprecated insights | Stale, may cause incorrect behavior |
| Memories from unrelated projects | Noise, dilutes focus |
| Play-by-play session traces | Ephemeral, not useful |
| Git-log-level events | Available from git, not memory |

### Maximum context sizes

| Task type | Max memories to load | Sources |
|-----------|---------------------|---------|
| Hydrate (session start) | 5-10 | Recent reflections + blockers |
| Plan (task breakdown) | 3-5 | Related past plans + ADRs |
| Build (implementation) | 3-7 | Conventions + similar past solutions |
| Debug (error) | 5-10 | Similar past errors + fixes |
| Reflect (session end) | 2-3 | What changed + what's open |

**Rule:** If you're loading more than 10 memories for a single task, narrow your search query. You're likely including noise.

---

## Retrieval patterns by phase

### Phase 0-1: Strategy

```javascript
// Load brand strategy context
memory_search({ query: "ember-fold positioning archetype", group_id: "allura-team-durham", limit: 5 })
memory_search({ query: "competitive landscape ember-fold category", group_id: "allura-team-durham", limit: 3 })
MCP_DOCKER_search_memories({ query: "brand archetype patterns" })  // global
```

### Phase 2: Naming

```javascript
// Load naming context
memory_search({ query: "ember-fold naming direction linguistics", group_id: "allura-team-durham", limit: 5 })
MCP_DOCKER_search_memories({ query: "trademark screening results" })  // global
```

### Phase 3: Visual Direction

```javascript
// Load visual context
memory_search({ query: "ember-fold visual direction color palette", group_id: "allura-team-durham", limit: 5 })
memory_search({ query: "ember-fold logo direction concept", group_id: "allura-team-durham", limit: 3 })
MCP_DOCKER_search_memories({ query: "logo archetype mapping" })  // global
```

### Phase 4: Brand Kit

```javascript
// Load brand kit context
memory_search({ query: "ember-fold brand kit sections spacing", group_id: "allura-team-durham", limit: 5 })
MCP_DOCKER_search_memories({ query: "brand kit section requirements" })  // global
```

### Phase 5: QA

```javascript
// Load QA context (Munari is read-only)
memory_search({ query: "ember-fold deliverable QA consistency", group_id: "allura-team-durham", limit: 5 })
MCP_DOCKER_search_memories({ query: "QA checklist brand consistency" })  // global
```

### Phase 6: Brand Truth

```javascript
// Load full brand truth for storage
memory_search({ query: "ember-fold brand truth archetype promise", group_id: "allura-team-durham", limit: 10 })
```

### Phase 7: Report

```javascript
// Load pipeline summary
memory_search({ query: "ember-fold pipeline status phase", group_id: "allura-team-durham", limit: 10 })
```

---

## Anti-patterns

| Anti-pattern | Why it's wrong | Correct approach |
|-------------|---------------|-----------------|
| Loading all memories | Context window pollution, slow, irrelevant noise | Scope by project and query intent |
| Ignoring deprecated status | Acting on stale truth, causing incorrect behavior | Always check `deprecated` and `SUPERSEDES` chain |
| Only loading PostgreSQL | Missing validated insights, re-deriving known patterns | Search the semantic graph first for canonical knowledge |
| Only loading the semantic graph | Missing recent events, blind to current state | Hybrid search across both layers |
| Caching search results across sessions | Stale context, missed updates | Always search fresh at session start |
| Returning full objects instead of summaries | Token waste, lower signal-to-noise | Return concise relevant context |