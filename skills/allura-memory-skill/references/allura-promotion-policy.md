# Allura Promotion Policy

## When to promote

Promotion moves a raw trace from PostgreSQL to a curated insight in the semantic graph.
This is irreversible (once promoted, the insight becomes canonical truth).

### All criteria must be true

Before requesting promotion, verify **all** of the following:

| # | Criterion | How to verify |
|---|-----------|---------------|
| 1 | **Evidence exists** | Raw trace in PostgreSQL supports the claim |
| 2 | **Useful beyond immediate session** | The insight is reusable across ≥2 projects or sessions |
| 3 | **Confidence passes threshold** | Score ≥ 0.85 (from `memory_promote` threshold parameter) |
| 4 | **Not a duplicate** | Search the semantic graph for existing similar insights; none found |
| 5 | **Validated, not just proposed** | The decision or pattern was confirmed in practice, not just suggested |

### When NOT to promote

- The information is session-specific (e.g., "currently working on X")
- The information is speculative or unvalidated
- A similar insight already exists in the semantic graph (supersede instead, if different)
- The evidence is thin (single observation, no confirmation)
- The content is temporary state (e.g., "container is restarting")

---

## Promotion outcomes

When you request promotion via `memory_promote`, the system evaluates the candidate and returns one of these outcomes:

| Outcome | Meaning | Next action |
|---------|---------|-------------|
| `promoted` | Insight accepted into the semantic graph | No further action needed |
| `duplicate` | Same knowledge already exists in the semantic graph | Skip. Optionally add observations to existing node |
| `related_context` | Similar but not identical insight exists | Consider supersede or add as complementary observation |
| `possible_supersede` | Existing insight should be updated | Create new version with `SUPERSEDES` relationship |
| `rejected` | Does not meet promotion criteria | Keep as raw trace; try again with more evidence |
| `revoked` | Previously promoted insight is being removed | Mark as deprecated; follow revoke procedure |

---

## HITL gate (Human-in-the-loop)

Promotion never happens automatically. The system routes all promotion requests through a curator pipeline for human approval.

### Flow

```
Agent calls memory_promote(id, rationale)
        │
        ▼
System creates proposal in canonical_proposals
        │
        ▼
Curator reviews proposal (HITL)
        │
   ┌────┴────┐
   │         │
Approved   Rejected
   │         │
   ▼         ▼
Write to    Remain as
the graph   raw trace
```

### How agents request promotion

```javascript
// Request promotion with rationale
memory_promote({
  id: "<episodic-memory-id>",
  group_id: "allura-team-durham",
  rationale: "Decision validated across 3 client projects. Pattern stable for 2+ weeks. No existing semantic graph insight covers this."
})
```

### What to include in the rationale

A good rationale answers:
1. **What evidence** supports this insight? (cite PostgreSQL event IDs if possible)
2. **How many sessions/projects** has this been validated across?
3. **Why is this better** than keeping it as raw trace?
4. **Does anything in the semantic graph conflict** with this insight?

### Bad rationale examples

- "This seems useful" (no evidence)
- "I think this is important" (subjective, no validation)
- "We might need this later" (speculative)
- "Same as before but better" (vague, no specificity)

---

## Supersede vs. Promote

These are different operations. Know when to use each:

| Situation | Action |
|-----------|--------|
| New knowledge, nothing like it in the semantic graph | `memory_promote` |
| Existing insight needs updating | Supersede: create new, link with `SUPERSEDES` |
| Existing insight is wrong | Supersede: create corrected version, mark old as deprecated |
| Two insights conflict | Store both, create `DISPUTES` relationship, flag for human review |

### Supersede workflow

```javascript
// 1. Search for the existing insight
MCP_DOCKER_search_memories({ query: "MCP Docker runtime policy" })

// 2. Create the new version
MCP_DOCKER_create_entities({
  entities: [{
    name: "Decision: Use MCP Docker as single runtime (v2)",
    type: "Decision",
    observations: [
      "Supersedes v1 to account for SASL bug discovery",
      "Evidence: 2026-04-21 architecture audit showed orphan containers",
      "Validated: 3 projects, 2+ weeks stable"
    ]
  }]
})

// 3. Link to old version
MCP_DOCKER_create_relations({
  relations: [{
    source: "Decision: Use MCP Docker as single runtime (v2)",
    target: "Decision: Use MCP Docker as single runtime",
    relationType: "SUPERSEDES"
  }]
})

// 4. Mark old version as deprecated
MCP_DOCKER_add_observations({
  entityName: "Decision: Use MCP Docker as single runtime",
  observations: ["DEPRECATED: Superseded by v2 on 2026-04-22"]
})

// 5. Log the supersession event
memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "Superseded: 'MCP Docker single runtime' v1 → v2. Reason: SASL bug proved multi-runtime model unsafe. Evidence in event log.",
  metadata: { source: "conversation", agent_id: "kotler" }
})
```

---

## Revoke procedure

Revocation is permanent. Use only when a promoted insight is fundamentally wrong or harmful.

### When to revoke

- The insight was based on false evidence
- The insight causes incorrect agent behavior
- The insight is dangerous if acted upon (security, legal, brand damage)

### How to revoke

```javascript
// 1. Soft-delete the memory (30-day recovery window)
memory_delete({
  id: "<memory-id>",
  group_id: "allura-team-durham",
  user_id: "kotler"
})

// 2. Mark the semantic graph node as deprecated
MCP_DOCKER_add_observations({
  entityName: "Brand: ember-fold",
  observations: ["REVOKED: Archetype classification incorrect. Evidence: competitive analysis re-run showed different result. Revoked by kotler on 2026-04-22."]
})

// 3. Log the revocation event
memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "Revoked: ember-fold Brand archetype classification. Reason: Original competitive analysis had flawed data. New analysis pending.",
  metadata: { source: "conversation", agent_id: "kotler" }
})
```

### Recovery

Within 30 days, revoked memories can be restored:

```javascript
// List soft-deleted memories
memory_list_deleted({
  group_id: "allura-team-durham"
})

// Restore a specific memory
memory_restore({
  id: "<memory-id>",
  group_id: "allura-team-durham",
  user_id: "kotler"
})
```

After 30 days, soft-deleted memories are permanently removed. There is no recovery beyond the window.

---

## Batch promotion

When multiple related traces should be promoted together (e.g., a full session checkpoint):

1. Do NOT create one insight per trace
2. Aggregate the burst into a single coherent insight
3. Attach all supporting evidence as observations
4. Submit one promotion request

```javascript
// Good: aggregated session checkpoint
memory_promote({
  id: "<consolidated-memory-id>",
  group_id: "allura-team-durham",
  rationale: "Session checkpoint: MCP topology consolidated. 3 related events (SASL bug, orphan kill, config relocation) aggregate into one architectural decision. No single event tells the full story."
})

// Bad: one promotion per trace event
memory_promote({ id: "event-1", ... })
memory_promote({ id: "event-2", ... })
memory_promote({ id: "event-3", ... })
```

**Non-overload rule:** At most **one** semantic graph write per completed task or decision.