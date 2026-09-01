---
name: memory-client
description: "Use Allura Brain for persistent memory across sessions. Triggers on: session start/end, debugging (search before guessing), planning (check prior work), implementation (find conventions and past solutions), or any time you need to remember or recall something. If you're about to guess — search first."
---

# Allura Brain — Field Guide for Agents

You are stateless. Brain is your memory. Use it.

## The Loop

Every interaction with Brain follows one pattern:

**Search → Work → Log**

Search before you guess. Log what matters. Skip the noise.

## Connection — Always Online

**Status**: ✅ Brain is the **only** memory system. No offline fallback.

Brain is exposed via MCP tools. The server runs as a Docker container or local canonical MCP process. Tool names vary by harness: Claude Code often exposes namespaced tools such as `mcp__allura-brain__memory_search`; OpenCode/native aliases often expose `allura-brain_memory_search`; fallback database tools may appear as `MCP_DOCKER_*` or `mcp__MCP_DOCKER__*`. Use the exact tool name available in the current runtime.

**group_id**: Always `allura-team-durham` (from env). Every read and write requires it. Pattern: `^allura-[a-z0-9-]+$`.

**Pre-flight check** (automatic on session start):
```bash
make db-status  # Should show PostgreSQL: CONNECTED and semantic graph: CONNECTED
```

If Brain is down, warn the user and continue only with local repo evidence if the task is safe to do without memory. Do not claim hydration or logging happened unless a memory or fallback write actually succeeded.

## Tools

| Tool | When to use |
|------|-------------|
| Operation | Claude Code name | OpenCode/native alias | When to use |
|------|-------------|-------------|-------------|
| Search | `mcp__allura-brain__memory_search` | `allura-brain_memory_search` | Before guessing. Before proposing. Before debugging. |
| Add | `mcp__allura-brain__memory_add` | `allura-brain_memory_add` | After decisions, fixes, and durable discoveries. |
| Get | `mcp__allura-brain__memory_get` | `allura-brain_memory_get` | When you have a specific event ID. |
| List | `mcp__allura-brain__memory_list` | `allura-brain_memory_list` | Recent activity for a user/agent. |
| Update | `mcp__allura-brain__memory_update` | `allura-brain_memory_update` | Append-only versioned update. Never mutates. |
| Delete | `mcp__allura-brain__memory_delete` | `allura-brain_memory_delete` | Soft-delete only. |
| Promote | `mcp__allura-brain__memory_promote` | `allura-brain_memory_promote` | Request curator promotion. Requires HITL approval. |
| Restore | `mcp__allura-brain__memory_restore` | `allura-brain_memory_restore` | Undo a soft-delete within the recovery window. |
| Export | `mcp__allura-brain__memory_export` | `allura-brain_memory_export` | Export memories for backup or migration. |
| List deleted | `mcp__allura-brain__memory_list_deleted` | `allura-brain_memory_list_deleted` | Find soft-deleted memories. |

## Five Modes

### 1. Hydrate (Session Start)

Before doing anything, find out what you already know.

```javascript
// What happened recently?
memory_search({ query: "session reflection", group_id: "allura-team-durham", limit: 5 })

// What's blocking?
memory_search({ query: "BLOCKER", group_id: "allura-team-durham", limit: 5 })

// What decisions are live?
memory_search({ query: "ARCHITECTURE_DECISION", group_id: "allura-team-durham", limit: 5 })
```

Don't skip this. Your past self left breadcrumbs — follow them.

### 2. Plan (Starting Work)

Before breaking down a task, check if it's been planned before.

```javascript
// Has this been attempted?
memory_search({ query: "memory() wrapper implementation", group_id: "allura-team-durham" })

// What similar work has been done?
memory_search({ query: "TraceMiddleware integration", group_id: "allura-team-durham" })
```

After planning, write the plan down:

```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "brooks",
  content: "Plan: Implement memory() wrapper. Steps: 1) Define type signature 2) Wire to coordinator 3) Add trace middleware hook. Depends on: Story 1.1 (complete). Risk: coordinator circular dependency."
})
```

### 3. Build (Doing the Work)

Before writing code, search for conventions and past solutions.

```javascript
// How was this done before?
memory_search({ query: "postgres connection pooling pattern", group_id: "allura-team-durham" })

// Any gotchas?
memory_search({ query: "Zod validation boundary convention", group_id: "allura-team-durham" })
```

After making a decision, log it — especially the "why":

```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "woz",
  content: "Decision: Use polling not queue for embedding backfill. Why: Simpler, sufficient for current scale (~50K events). Revisit if event volume exceeds 500K. Batch size: 10, model: nomic-embed-text."
})
```

**What's worth logging during build:**
- Decisions and their rationale (most valuable)
- Patterns discovered ("this module assumes X")
- Gotchas ("must handle NULL content rows")
- Convention choices ("validate at boundary only")

**What's noise:**
- "Started working on X" (your git log says this)
- "Read file Y" (ephemeral)
- Play-by-play of steps taken (too granular)

### 4. Debug (Something Breaks)

**Search before investigating.** This is the highest-value habit.

```javascript
// Have we seen this error before?
memory_search({ query: "connection pool exhausted", group_id: "allura-team-durham" })

// Has this component failed before?
memory_search({ query: "neo4j authentication failure", group_id: "allura-team-durham" })
```

After finding the root cause, log the full chain:

```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "bellard",
  content: "Bug: Neo4j showing unhealthy, repeated 'missing key credentials' errors. Symptom: MCP tools failing to connect. Root cause: Docker MCP Toolkit had allura-brain enabled, spawning orphan containers from old GHCR image without proper env vars. Fix: docker mcp server disable allura-brain, kill orphans. Prevention: Don't add allura-brain to Toolkit — it runs locally."
})
```

**The debug log format that compounds:**
- Symptom (what you saw)
- Root cause (what was actually wrong)
- Fix (what you did)
- Prevention (how to avoid it next time)

If the same error shows up 3+ times, promote it:

```javascript
memory_promote({
  id: "<memory-id>",
  group_id: "allura-team-durham"
})
```

This queues it for curator approval to enter the knowledge graph.

### 5. Reflect (Session End)

Write what matters for next-you:

```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "brooks",
  content: "Session 2026-04-20: Fixed MCP topology. Removed allura-brain from Docker Toolkit (was spawning orphans). Consolidated MCP config to opencode.json as single source of truth. Allura Brain connected via governed gateway. Neo4j tools removed (AD-50) — semantic graph now RuVector on PG.. Open: allura-web and allura-http-gateway still showing unhealthy — need restart."
})
```

**Good reflections answer:** What changed? What's still open? What should next-me check first?

## Invariants

These are non-negotiable. Violating them causes data corruption or CHECK constraint failures.

- **Brain is the ONLY memory** — never use local files, no offline fallback
- **group_id on every call** — always `allura-team-durham` for this project
- **Postgres is append-only** — never update or delete trace rows
- **The semantic graph uses SUPERSEDES** — create new version nodes, never edit existing ones
- **Promotion requires HITL** — agents cannot self-promote; goes through curator pipeline
- **user_id** — use the Team Durham agent name (kotler, aaker, glaser, rand, munari, ogilvy, tufte, scout)

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Tools not available | Is `alluramemory-mcp` container running? `docker ps` |
| Empty search results | Verify group_id is `allura-team-durham` |
| memory_add fails | Check group_id pattern matches `^allura-[a-z0-9-]+$` |
| Promotion stuck | Normal — requires human approval via `curator:approve` |
