---
## 🔗 Allura Brain Connection — MANDATORY

Every agent on Team Durham is connected to Allura Brain (PostgreSQL (episodic) + RuVector semantic graph).
This is not optional. Every action must be logged. Every insight must be searchable.

### Connection Parameters
- **group_id**: `allura-team-durham` (REQUIRED on every call)
- **user_id**: Your agent name (kotler, aaker, glaser, rand, ogilvy, munari, tufte, scout, openagent)
- **PostgreSQL (episodic)**: localhost:5432, db=memory, user=ronin4life
- **Semantic graph (RuVector)**: via governed gateway — no direct DB access

### MCP Tools Available
| Tool | Purpose | Permission |
|------|---------|------------|
| `allura-brain_memory_search` | Search memories across both stores | ALL |
| `allura-brain_memory_add` | Write to PostgreSQL (episodic) | Write agents only |
| `allura-brain_memory_promote` | Request promotion to the semantic knowledge graph | ALL (requests HITL) |
| `allura-brain_memory_get` | Get single memory by ID | ALL |
| `allura-brain_memory_list` | List memories for user | ALL |
| `allura-brain_memory_update` | Append-only versioned update | Write agents only |
| `allura-brain_memory_delete` | Soft-delete (30-day window) | Write agents only |
| `allura-brain_memory_restore` | Restore soft-deleted | Write agents only |
| `allura-brain_memory_export` | Export memories | ALL |

### Write Discipline (NON-NEGOTIABLE)
1. **Postgres FIRST**: Every event → `memory_add` to PostgreSQL before any other action
2. **Abort on failure**: If Postgres write fails, STOP. Do not proceed.
3. **Semantic graph ONLY after validation**: Promote to the semantic knowledge graph only after evidence exists in Postgres
4. **Search before write**: Always `memory_search` before storing to prevent duplicates
5. **Signal not noise**: Log decisions, patterns, lessons — not play-by-play status

### Startup Protocol
On activation, execute:
```
allura-brain_memory_list({
  group_id: "allura-team-durham",
  user_id: "YOUR_NAME",
  limit: 5
})
```
This loads your recent context before acting.

### Fallback Protocol
If Allura Brain MCP is unavailable:
1. Log the failure to local file: `.claude/state/brain-fallback-{timestamp}.json`
2. Retry after 5 seconds (max 3 attempts)
3. If still down, proceed with in-memory tracking but mark run as `degraded`
4. NEVER skip logging entirely — even degraded runs must have trace

### Reflection Protocol
After every substantive action:
```
📝 Reflection
├─ Action Taken: {what was done}
├─ Principle Applied: {which principle governed}
├─ Brain Logged: {event_type written to allura-brain}
├─ Postgres Record: {Yes/No — must be Yes}
├─ Semantic Graph Promoted: {Yes/No}
└─ Confidence: {High/Medium/Low}
```
