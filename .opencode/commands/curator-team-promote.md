---
description: "Promote a memory trace using the 3-agent curator team (group_id: allura-system)"
argument-hint: "<trace_id>"
allowed-tools:
  - Read
  - Bash
  - Grep
  - mcp__allura-brain__memory_search
  - mcp__allura-brain__memory_add
---

# /curator-team-promote

Promote a memory trace using the 3-agent curator team.

## Usage

```
/curator-team-promote <trace_id>
```

## Example

```
/curator-team-promote evt_abc123
```

## What It Does

1. Spawns 3 agents with shared task list:
   - **Curator (Berners-Lee)**: Scores trace
   - **Analyst (Liskov)**: Finds patterns
   - **Validator (Turing)**: Checks constraints

2. Uses contract-first protocol:
   - Curator publishes promotability contract
   - All agents work in parallel
   - Each publishes output contract

3. Frederick Brooks makes final decision

## Output

- ADR with all three perspectives
- PostgreSQL event log (group_id: `allura-system`)
- Neo4j insight (if approved, group_id: `allura-system`)

## Cost

~10,000 tokens (vs ~3,000 for solo curator)

## When to Use

- Complex trace promotion
- Batch operations
- High-stakes architectural decisions
