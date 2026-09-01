---
name: allura-memory-skill
description: Use when working with Allura Brain governed memory through MCP — storing, retrieving, curating, promoting, and governing memories with dual-layer PostgreSQL + RuVector semantic graph architecture.
allowed-tools: allura-brain_memory_add, allura-brain_memory_search, allura-brain_memory_get, allura-brain_memory_list, allura-brain_memory_update, allura-brain_memory_delete, allura-brain_memory_promote, allura-brain_memory_export, allura-brain_memory_restore, allura-brain_memory_list_deleted, MCP_DOCKER_execute_sql, MCP_DOCKER_query_database
---

# Allura Memory Skill

This skill teaches an AI agent how to use Allura Brain's governed memory system through MCP.
It covers persistent memory workflows — not just one-off queries.

## Quick Connect

### MCP Server Configuration

Use this entry in your MCP configuration:

```json
{
  "mcpServers": {
    "memory": {
      "command": "bun",
      "args": ["run", "/home/ronin704/Projects/allura memory/src/mcp/memory-server-canonical.ts"],
      "env": {
        "POSTGRES_HOST": "localhost",
        "POSTGRES_PORT": "5432",
        "POSTGRES_USER": "ronin4life",
        "POSTGRES_PASSWORD": "${POSTGRES_PASSWORD}",
        "POSTGRES_DB": "memory",
        "NEO4J_URI": "bolt://localhost:7687",
        "NEO4J_USER": "neo4j",
        "NEO4J_PASSWORD": "${NEO4J_PASSWORD}",
        "PROMOTION_MODE": "soc2",
        "AUTO_APPROVAL_THRESHOLD": "0.85"
      }
    }
  }
}
```

### Environment Variables

```bash
POSTGRES_PASSWORD=your_password
NEO4J_PASSWORD=your_password
```

## When to use

Use this skill when:

- A user wants the agent to remember important facts across sessions
- A workflow needs semantic search over prior events, outcomes, insights, or entities
- The agent must store new memories after a task completes
- The agent needs to retrieve relevant project or user context before acting
- The agent must distinguish raw episodic traces from curated semantic knowledge
- The agent needs to promote, supersede, deprecate, or revoke a memory
- The agent needs to understand the dual-layer architecture (PG episodic + RuVector semantic graph)

## Core architecture

Allura Brain is a **dual-layer governed memory system**:

1. **Episodic layer (PostgreSQL)**
   - Append-only event traces
   - Vector embeddings via RuVector (qwen3-embedding:8b, 4096d)
   - Every `allura-brain_memory_add` writes here first
   - Never treat raw traces as final truth

2. **Semantic layer (Neo4j)**
   - Curated, versioned knowledge nodes
   - Graph relationships (SUPERSEDES, AUTHORED_BY, CONTRIBUTES_TO)
   - Only populated via curator promotion after policy checks
   - This is the canonical truth layer

3. **Governance (RuVix kernel)**
   - Promotion gating — raw → curated requires approval
   - Policy enforcement on every operation
   - Budget enforcement and circuit breakers
   - Agent identity tracking on all writes

## Memory operating model

Treat memory as multiple layers:

1. **Raw trace** — Store session events, observations, and evidence. Append-only. Never treat as final truth.
2. **Curated insight** — Promote only after policy checks. Use versioning instead of mutating in place. Prefer SUPERSEDES / deprecated / reverted relationships.
3. **Retrieval context** — Load both project-specific and global memories. Prefer the smallest useful context window.

## Tenant model

- `group_id` is the hard namespace boundary. Every read and write MUST include a valid `group_id` matching `^allura-`. Missing it causes CHECK constraint failure.
- Default tenant: `allura-system`
- Cross-tenant access is impossible by schema constraint
- Always specify `group_id` explicitly — never assume
- `allura-roninmemory-*` group_ids are deprecated; flag any occurrence as drift

## Agent identity

- Every `allura-brain_memory_add` must include your agent persona as `user_id` (e.g., `brooks-architect`, `woz-builder`)
- Generic IDs like `system` or `default` are only for bootstrap/system-level entries
- Your agent identity creates provenance and audit trails

## Instructions

When a user asks for memory-related work:

1. **Identify the intent**
   - Store a new memory
   - Search memory
   - Summarize memory state
   - Promote raw trace into insight
   - Revoke or deprecate memory
   - Troubleshoot memory server/runtime

2. **Retrieve before writing**
   - Call `allura-brain_memory_search` for existing related memories first
   - Avoid duplicate inserts
   - Check whether a candidate memory already exists in similar form

3. **Classify the memory**
   - Raw event / session trace
   - Outcome / result
   - Insight / learned pattern
   - Entity fact
   - Decision / ADR
   - Relationship between entities

4. **Apply write discipline**
   - Raw traces: use `allura-brain_memory_add` directly
   - Insights: write as raw, then call `allura-brain_memory_promote` if it passes policy
   - If updating prior truth: use `allura-brain_memory_update` (creates SUPERSEDES lineage, never overwrites)

5. **Store evidence with memory**
   - Capture source, timestamp, task context, and confidence
   - Do not write unsupported claims as durable truth

6. **Use retrieval discipline**
   - Fetch project-local memory first when task scope is narrow
   - Add global memory only when it improves reasoning
   - Return concise relevant context, not a dump

7. **Handle conflicts safely**
   - If two memories disagree, preserve lineage
   - Mark one as superseded or disputed instead of deleting
   - Prefer explicit status edges over destructive edits

8. **Troubleshoot systematically**
    - Is the MCP server reachable? (`memory` server via `bun run mcp`)
    - Is PostgreSQL accepting connections? (`localhost:5432`)
    - Is Neo4j reachable? (`localhost:7687`)
    - Are credentials and `group_id` correct?
    - Is the embedding service (Ollama) running on host?
    - Check `POSTGRES_PASSWORD` and `NEO4J_PASSWORD` environment variables

## Guardrails

- Do not confuse raw logs with validated knowledge
- Do not mutate canonical insights in place — always use `allura-brain_memory_update`
- Do not promote memories without evidence or policy support
- Do not create duplicate nodes when a SUPERSEDES relationship is more appropriate
- Do not return stale memory without checking timestamps and status
- Always use `group_id: allura-system` unless explicitly told otherwise
- Always identify yourself as the calling agent in `user_id`
- **Never** use `allura-roninmemory-*` group_ids; always use `allura-*`

## Tool Signatures (Actual Available Tools)

| Operation | Tool | Parameters (required → optional) | Returns |
|-----------|------|----------------------------------|---------|
| Store new memory | `allura-brain_memory_add` or `memory_memory_add` | `group_id`, `user_id`, `content` | `metadata.source`, `score` |
| Search memories | `allura-brain_memory_search` or `memory_memory_search` | `query`, `group_id` | `user_id?`, `limit?`, `min_score?`, `include_global?` |
| Get single memory | `allura-brain_memory_get` or `memory_memory_get` | `id`, `group_id` | memory object |
| List user memories | `allura-brain_memory_list` or `memory_memory_list` | `group_id`, `user_id` | `limit?`, `offset?`, `sort?` |
| Update memory | `allura-brain_memory_update` or `memory_memory_update` | `id`, `group_id`, `user_id`, `content` | `reason?`, `metadata?` |
| Soft-delete memory | `allura-brain_memory_delete` or `memory_memory_delete` | `id`, `group_id`, `user_id` | — |
| Promote to canonical | `allura-brain_memory_promote` or `memory_memory_promote` | `id`, `group_id`, `user_id` | `curator_id?`, `rationale?` |
| Export memories | `allura-brain_memory_export` or `memory_memory_export` | `group_id` | `user_id?`, `canonical_only?`, `limit?`, `offset?` |
| Restore deleted | `allura-brain_memory_restore` or `memory_memory_restore` | `id`, `group_id`, `user_id` | — |
| List deleted (30-day) | `allura-brain_memory_list_deleted` or `memory_memory_list_deleted` | `group_id` | `user_id?`, `limit?`, `offset?` |

**Note:** This environment exposes both `allura-brain_memory_*` and `memory_memory_*` tool variants as aliases. Both names refer to the same canonical memory operations.

## Examples

### Session Bootstrap

```javascript
// Raw trace at session start
await allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "woz-builder",
  content: "Session started: work on allura-memory-skill consolidation"
});

// Search existing context first
results = await allura-brain_memory_search({
  query: "allura-memory-skill",
  group_id: "allura-system",
  limit: 5
});

// End-of-session event
await allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "woz-builder",
  content: "Session complete: allura-memory-skill merged, draft PR created",
  metadata: { workflow: "skill-merge" }
});
```

### Promote Raw Trace to Curated Insight

```javascript
// Write raw first
const raw = await allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "woz-builder",
  content: "Tool signatures use allura-brain_memory_* prefix only"
});

// Later, after policy review
await allura-brain_memory_promote({
  id: raw.id,
  group_id: "allura-system",
  user_id: "woz-builder",
  rationale: "Policy check passed; fits canonical schema"
});
```

### Update with Versioning (SUPERSEDES)

```javascript
await allura-brain_memory_update({
  id: "mem_abc123",
  group_id: "allura-system",
  user_id: "woz-builder",
  content: "Updated tool signatures: added allura-brain_memory_list_deleted",
  reason: "Documentation drift: list_deleted was missing from initial spec"
});
```

### Search and Export

```javascript
// Semantic search
matches = await allura-brain_memory_search({
  query: "dual-layer architecture",
  group_id: "allura-system",
  min_score: 0.8
});

// Export canonical-only (Neo4j)
all_memories = await allura-brain_memory_export({
  group_id: "allura-system",
  canonical_only: true,
  limit: 100
});
```

## Recommended references

- `references/allura-memory-model.md`
- `references/allura-promotion-policy.md`
- `references/allura-dual-context-retrieval.md`
- `references/allura-troubleshooting.md`

## Scripts (for reference)

- `src/mcp/memory-server.ts` — MCP entry point
- `src/integrations/postgres.client.ts` — EPISODIC layer
- `src/integrations/neo4j.client.ts` — SEMANTIC layer
- `src/curator/` — HITL promotion pipeline

(End of file - total 212 lines)
