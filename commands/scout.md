---
description: "Search Allura Brain for insights, patterns, and prior decisions."
---

# /scout — Brain Search Command

## Usage

```
/scout <query>
```

## Description

Perform a bounded read-only Brain search for decisions, learned patterns, and
blockers. The current owner may perform a sufficient lookup directly; invoke
**Tufte** only when useful research warrants actual delegation. Resolve any target
against the observed runtime registry before invoking.

## Query Patterns

### Pattern 1: Find ADRs and Decisions
```
/scout "What ADRs exist for authentication?"
/scout "Show me all database schema decisions"
/scout "Find decisions about token budgets"
```

### Pattern 2: Trace Historical Context
```
/scout "Who decided on the group_id enforcement?"
/scout "When was the RuVix kernel integrated?"
/scout "What was the rationale for SUPERSEDES versioning?"
```

### Pattern 3: Identify Patterns and Blockers
```
/scout "What patterns keep failing?"
/scout "Show me all blocked tasks"
/scout "Find recurring error patterns in events"
```

### Pattern 4: Cross-Reference Knowledge
```
/scout "What decisions reference Brooksian principles?"
/scout "Show me all INTERFACE_DEFINED events"
/scout "Find all TECH_STACK_DECISION events"
```

## How It Works

1. **Query Analysis** — The current owner or invoked Tufte scopes the query
2. **Memory Search** — Searches Allura Brain for relevant episodic and semantic memories
3. **Synthesis** — Combines results into actionable summary
4. **Read receipt** — Report the actual query, permitted scope, returned record IDs,
   and operation status. This lookup performs no writes.

## Tool Access

This compatibility command performs read-only lookup using available tools:
- `allura-brain_memory_search` — Search memories
- `allura-brain_memory_list` — Recent activity
- `allura-brain_memory_get` — Specific memory lookup

## Limitations

- **Read-only**: this lookup does not create, modify, or delete memories
- **No downstream delegation**: after initial owner selection, this lookup does not
  invoke further agents
- **No implementation**: this lookup finds information; further work requires a scoped route

## See Also

- Canonical agent definition: [Tufte canonical definition](../agents/data-analyst.md)
- Memory system: [Memory client](../skills/memory-client/SKILL.md)
