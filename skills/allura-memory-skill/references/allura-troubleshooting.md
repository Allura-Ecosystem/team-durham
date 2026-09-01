# Allura Memory Troubleshooting

## Diagnostic layers

Troubleshoot from the outside in: MCP → Database → Memory Logic → Data Integrity.

```
┌──────────────────────────────────┐
│       LAYER 4: DATA INTEGRITY    │  ← Duplicates, stale data, broken chains
├──────────────────────────────────┤
│    LAYER 3: MEMORY LOGIC         │  ← Promotion, supersede, permission bugs
├──────────────────────────────────┤
│    LAYER 2: DATABASE             │  ← PostgreSQL connection and auth
├──────────────────────────────────┤
│    LAYER 1: MCP                  │  ← Server reachability, transport, tools
└──────────────────────────────────┘
```

---

## Layer 1: MCP

### Symptoms

| Symptom | Likely cause |
|---------|-------------|
| `memory_search` tool not available | MCP server not registered or crashed |
| `MCP_DOCKER_*` tools missing | MCP Docker Toolkit not running |
| Timeout on tool calls | Container unhealthy, network issue |

### Diagnostics

```bash
# Check if MCP Docker is running
docker ps | grep mcp

# Check if alluramemory-mcp container is running
docker ps | grep allura

# Check tool availability (from within agent session)
# Try calling a simple tool to verify connectivity
```

### Fixes

| Issue | Fix |
|-------|-----|
| MCP server crashed | `docker restart <container-name>` |
| Not registered in MCP Docker | `MCP_DOCKER_mcp-add` with correct server name |
| Wrong transport mode | Check transport config (stdio vs sse vs streamable-http) |
| Client pointed to wrong server | Verify the server name matches registration |
| Orphan containers from old images | `docker ps -a | grep allura` → `docker kill` orphans |

**Key rule for this repo:** The primary pathway is `allura-brain_*` native tools when healthy. When degraded or unavailable, use `MCP_DOCKER_*` tools to reach the same databases directly:
- `MCP_DOCKER_search_memories` → semantic graph full-text search
- `MCP_DOCKER_create_entities` / `create_relations` / `add_observations` → semantic graph CRUD
- `MCP_DOCKER_execute_sql` / `insert_data` → PostgreSQL CRUD
- `MCP_DOCKER_find_memories_by_name` → semantic graph exact-name lookup

Do NOT add duplicate MCP server entries for the same capability.

---

## Layer 2: Database

### PostgreSQL

| Symptom | Check |
|---------|-------|
| Connection refused | `make db-status` or `docker exec knowledge-postgres pg_isready` |
| Auth error | Check `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` env vars |
| CHECK constraint failure | `group_id` must match `^allura-[a-z0-9-]+$` |
| Empty results | Verify `group_id = 'allura-team-durham'` in WHERE clause |
| Insert fails | Check all required columns: `event_type`, `group_id` |

### Connectivity quick check

```bash
make db-status  # Should show PostgreSQL: CONNECTED
```

If either is offline:
```bash
make docker-up  # Restart containers
make db-status  # Verify again
```

---

## Layer 3: Memory Logic

### Duplicate detection too weak

**Symptom:** Same insight stored multiple times in the semantic graph.

**Cause:** Agent didn't search before writing, or search query was too narrow.

**Fix:**
1. Search with broader queries before creating entities
2. Use `MCP_DOCKER_search_memories` with the core concept, not just exact text
3. If duplicates exist, merge observations into one entity and mark others as deprecated

```javascript
// Merge duplicate entities
MCP_DOCKER_add_observations({
  entityName: "Decision: Use MCP Docker as single runtime",
  observations: ["Additional observation from duplicate node"]
})

// Mark the duplicate as deprecated
MCP_DOCKER_add_observations({
  entityName: "Decision: Use MCP Docker as single runtime (DUPLICATE)",
  observations: ["DEPRECATED: Duplicate of primary node. Merged on 2026-04-22."]
})
```

### Promotions writing directly to canonical truth

**Symptom:** Unvalidated insights appearing in the semantic graph without going through the promotion pipeline.

**Cause:** Agent used `MCP_DOCKER_create_entities` directly instead of `memory_promote`.

**Fix:**
1. Never bypass the promotion pipeline for insights
2. Raw traces go to PostgreSQL via `memory_add`
3. Only promoted traces go to the semantic graph via `memory_promote` → curator approval
4. Direct semantic graph writes are only for brand truth storage (Phase 6) and ADR nodes

### Missing timestamps or status fields

**Symptom:** Semantic graph nodes without `created_at` or `deprecated` fields.

**Cause:** Agent created entities without required metadata.

**Fix:**
1. Always include `created_at` timestamp in observations
2. Always set `deprecated: false` initially
3. Always include `group_id` in observations
4. Run validation script: `scripts/smoke-test-memory.sh`

### Permission violations

**Symptom:** Agent writes to a store it shouldn't have access to.

**Cause:** Ogilvy/Munari/Tufte/Scout attempting writes outside their permission scope.

**Fix:**
1. Check the write permissions matrix in SKILL.md
2. Only Kotler can write to the semantic graph (via SUPERSEDES)
3. Munari and Scout are read-only everywhere
4. Log the violation: `memory_add({ content: "Permission violation: agent X attempted write to Y" })`

---

## Layer 4: Data Integrity

### Broken SUPERSEDES chain

**Symptom:** Following `SUPERSEDES` relationships leads to a dead end or cycle.

**Cause:** Incomplete versioning — new node created without linking to old.

**Fix:**
1. Verify every supersede operation creates both `SUPERSEDES` (new→old) and `DEPRECATED_BY` (old→new)
2. Check for orphaned versions (nodes with no incoming or outgoing SUPERSEDES that should have them)

### Stale memory returned

**Symptom:** Agent acts on deprecated insight as if it were current.

**Cause:** Search returned a deprecated node without following the SUPERSEDES chain.

**Fix:**
1. Always check `deprecated` flag on search results
2. If deprecated, follow `SUPERSEDES` → current version
3. If no current version exists, flag for human review
4. Add a retrieval-time check in your search workflow

### Orphaned entities

**Symptom:** Semantic graph entities with no relationships.

**Cause:** Agent created an entity but forgot to link it to related nodes.

**Fix:**
1. Every entity should have at least one relationship
2. Use `FOR_PROJECT`, `ABOUT`, `SUPPORTED_BY`, or `PRODUCED_BY`
3. Run a periodic integrity check via `scripts/smoke-test-memory.sh`

---

## Emergency procedures

### Brain is completely down

1. **Stop working.** Do not attempt to work without memory.
2. Run `make docker-up` to restart containers
3. Run `make db-status` to verify connectivity
4. If still down, check Docker logs: `docker logs knowledge-postgres`
5. Fix the root cause before resuming work
6. Do NOT use local files as fallback

### Accidental bulk insert

1. Identify the bad inserts via timestamp
2. Soft-delete the affected memories (within 30-day window)
3. If promoted to the semantic graph, mark entities as deprecated
4. Log the incident: `memory_add({ content: "INCIDENT: Accidental bulk insert of N memories. Soft-deleted ids: [list]. Root cause: [why]." })`

### Corrupted semantic graph data

1. Export current state: `memory_export({ group_id: "allura-team-durham" })`
2. Identify the corruption scope
3. Mark affected nodes as deprecated (don't delete)
4. Create corrected versions with SUPERSEDES
5. Log the incident with full details

---

## Health check commands

| Check | Command |
|-------|---------|
| Container status | `docker ps --filter name=postgres` |
| PostgreSQL connectivity | `make db-status` |
| Recent events | `make db-events` |
| Memory count | `memory_export({ group_id: "allura-team-durham", limit: 1 })` |
| Orphan containers | `docker ps -a | grep allura` |
| Disk usage | `docker system df` |
| Full smoke test | `scripts/smoke-test-memory.sh` |

---

## Escalation matrix

| Issue | Severity | First responder | Escalation |
|-------|----------|-----------------|------------|
| MCP server not reachable | P0 | Restart container | Docker network issue |
| PostgreSQL connection refused | P0 | `make docker-up` | Container volume issue |
| Duplicate insights detected | P2 | Merge + deprecate | Agent behavior fix |
| Broken SUPERSEDES chain | P2 | Re-link manually | Update promotion logic |
| Permission violation | P2 | Log + block | Update agent config |
| Stale memory returned | P3 | Add deprecation check | Update retrieval logic |