# Allura Memory Model

## Dual-layer architecture

### Episodic layer (PostgreSQL)
- Table: `allura_memories`
- Append-only event traces with vector embeddings (4096d, qwen3-embedding:8b)
- Fields: id, group_id, user_id, content, metadata, embedding, score, created_at
- Every `memory_add` writes here first
- RuVector hybrid search (vector + BM25) for retrieval
- 237 rows in `allura-system` as of 2026-04-22

### Semantic layer (Neo4j)
- Node labels: Memory, Agent, Team, Project
- Relationship types: SUPERSEDES, AUTHORED_BY, CONTRIBUTES_TO, MEMBER_OF, DELEGATES_TO, ESCALATES_TO, HANDS_OFF_TO, PROPOSES_TO, APPROVES_PROMOTION
- 81 Memory nodes, 19 Agent nodes in `allura-system` as of 2026-04-22
- Only populated via curator promotion pipeline
- This is the canonical truth layer

## Node types

| Type | Label | Description |
|------|-------|-------------|
| Event | (stored in PG) | Raw session trace, observation |
| Outcome | :Memory | Result of a task or process |
| Insight | :Memory | Learned pattern, distilled knowledge |
| ADR | :Memory | Architecture Decision Record |
| Entity | :Memory | Fact about a system, person, or thing |
| Agent | :Agent | Team member with role and routing |
| Team | :Team | Group of agents |
| Project | :Project | Project context |

## Relationship patterns

```
(:Memory)-[:SUPERSEDES]->(:Memory)      // versioned replacement
(:Memory)-[:AUTHORED_BY]->(:Agent)      // provenance
(:Memory)-[:CONTRIBUTES_TO]->(:Project) // project scope
(:Agent)-[:MEMBER_OF]->(:Team)          // team membership
(:Agent)-[:DELEGATES_TO]->(:Agent)      // task routing
(:Agent)-[:ESCALATES_TO]->(:Agent)      // escalation path
(:Memory)-[:APPROVES_PROMOTION]->(:Memory) // promotion audit
```

## Status guidance

Prefer explicit version/status edges over in-place mutation:
- `active` — current canonical truth
- `deprecated` — superseded by newer version
- `disputed` — conflicting evidence exists
- `revoked` — removed with cause

## Versioning model

`memory_update` creates a new node with SUPERSEDES relationship to the old one.
The old node is marked deprecated. Both exist in the graph.
This preserves full lineage and audit trail.

Never overwrite in place. Always version forward.