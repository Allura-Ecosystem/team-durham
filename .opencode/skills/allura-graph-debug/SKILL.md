# Allura Graph Debug (Read-Only)

## Trigger
"show me the graph for X", "debug graph connections", "what does the memory graph look like", "trace relationships for X"

## Required Inputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `group_id` | string | **YES** | Tenant namespace (must match `^allura-*`). No calls without it. |
| `query` | string | yes | Entity name or search term to find in the graph |
| `depth` | number | no | Relationship depth to traverse (default: 2, max: 4) |

## MCP Tool Allowlist
- `MCP_DOCKER__find_memories_by_name` — exact entity lookup
- `MCP_DOCKER__search_memories` — fulltext search across names, types, observations
- `MCP_DOCKER__read_graph` — full graph dump (use sparingly, only when query is broad)

## Output Contract
```json
{
  "nodes": "number — count of entities found",
  "edges": "number — count of relationships",
  "depth": "number — actual traversal depth used",
  "entities": [{ "name": "string", "type": "string", "observations": ["string"] }],
  "relations": [{ "source": "string", "target": "string", "relationType": "string" }]
}
```

## Guardrails
- **READ-ONLY.** This skill must NEVER create, update, or delete any entity or relationship.
- **group_id required.** Every call must include group_id. Reject if missing.
- **No Cypher queries.** Use `find_memories_by_name` and `search_memories` only. Never construct raw Cypher.
- **Depth cap.** Never traverse beyond depth 4 — risk of OOM on large graphs.
- **No exfiltration.** Never return data from a group_id the caller doesn't belong to.