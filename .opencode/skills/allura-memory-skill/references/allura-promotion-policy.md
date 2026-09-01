# Allura Promotion Policy

Promotion is the process of elevating raw episodic traces into curated semantic knowledge. It is the gate between "we observed this" and "we know this."

## When to promote

Promote raw memory to insight only when ALL of these are true:

1. **Evidence exists** — The memory is grounded in a real event, test result, decision, or observation
2. **Utility beyond session** — The information helps future work, not just the current conversation
3. **Confidence passes threshold** — Default threshold: 0.85 (configurable via `AUTO_APPROVAL_THRESHOLD`)
4. **Not a duplicate** — No existing canonical memory covers the same ground
5. **Not better suited as a supersede** — If it contradicts an existing insight, use `allura-brain_memory_update` instead

## Promotion modes

| Mode | Behavior | When to use |
|------|----------|-------------|
| `soc2` | Requires explicit approval via curator pipeline | Production (default) |
| `auto` | Auto-promotes if score >= threshold | Development/testing only |

Current mode: `soc2` (set in `PROMOTION_MODE` env var)

## Promotion outcomes

| Outcome | Meaning |
|---------|---------|
| `promoted` | Memory elevated to canonical Neo4j node |
| `duplicate` | Matches existing canonical memory — not promoted |
| `related_context` | Related but not the same — linked, not promoted |
| `possible_supersede` | Contradicts existing — use `memory_update` instead |
| `rejected` | Fails evidence or policy check |
| `revoked` | Previously promoted, now removed with cause |

## Promotion flow

```
allura-brain_memory_add (PG episodic)
    ↓
allura-brain_memory_promote (request)
    ↓
Curator evaluates:
  - Score check (threshold)
  - Duplicate detection (semantic similarity)
  - Policy check (RuVix)
    ↓
Approved → Neo4j :Memory node created
Rejected → Stays in PG as raw trace
```

## Critical rules

- Never promote without calling `allura-brain_memory_promote` — direct Neo4j writes bypass governance
- Never auto-approve in production — `soc2` mode exists for a reason
- If promotion is rejected, the raw trace still exists in PG — nothing is lost
- Promoted memories carry their `group_id` for tenant isolation