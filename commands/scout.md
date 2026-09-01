---
description: "Search Allura Brain for insights, patterns, and prior decisions."
---

# /scout — Brain Search Command

## Usage

```
/scout <query>
```

## Description

Invoke **Scout Recon** to search Allura Brain memory. Scout retrieves past decisions, learned patterns, and recurring blockers.

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

1. **Query Analysis** — Scout parses your natural language query
2. **Memory Search** — Searches Allura Brain for relevant episodic and semantic memories
3. **Synthesis** — Combines results into actionable summary
4. **Logging** — Records the query as a reflection event

## Tool Access

Scout uses read-only tools:
- `allura-brain_memory_search` — Search memories
- `allura-brain_memory_list` — Recent activity
- `allura-brain_memory_get` — Specific memory lookup

## Limitations

- **Read-only**: Scout cannot create, modify, or delete memories
- **No delegation**: Scout cannot invoke other agents
- **No implementation**: Scout finds information but does not act on it

## See Also

- Agent definition: `.claude/agents/scout-recon.md`
- Memory system: `.claude/skills/memory-client/SKILL.md`