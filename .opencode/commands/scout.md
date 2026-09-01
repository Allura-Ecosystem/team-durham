---
description: "Invoke Scout to search Allura Brain memory for past decisions, patterns, and blockers"
argument-hint: "<query>"
allowed-tools:
  - Read
  - Grep
  - Glob
---

# /scout — Brain Search Command

## Usage

```
/scout <query>
```

## Description

Invoke **Scout** (Grace Hopper persona) to search Allura Brain memory. Scout retrieves past decisions, learned patterns, and recurring blockers from both PostgreSQL (episodic traces) and Neo4j (semantic insights).

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
2. **Dual Search** — Searches both PostgreSQL (traces) and Neo4j (insights)
3. **Synthesis** — Combines results into actionable summary
4. **Logging** — Records query as `SCOUT_QUERY` event for audit trail

## Tool Access

Scout uses read-only tools:
- `mcp__MCP_DOCKER__query_database` — Natural language SQL
- `mcp__MCP_DOCKER__execute_sql` — Raw SQL queries
- `mcp__MCP_DOCKER__read_neo4j_cypher` — Neo4j graph queries

## Limitations

- **Read-only**: Scout cannot create, modify, or delete memories
- **No delegation**: Scout cannot invoke other agents
- **No implementation**: Scout finds information but does not act on it

## Example Response

```
🔍 Scout Report: "What ADRs exist for authentication?"

**PostgreSQL Traces (Last 10):**
- ADR-001: JWT Token Strategy (2026-04-01)
- ADR-015: Session Management (2026-04-03)
- ADR-023: OAuth2 Integration (2026-04-05)

**Neo4j Insights:**
- Decision: "Use proof-gated mutation for auth"
- Principle: Conceptual Integrity
- Confidence: 0.92

**Related Patterns:**
- 3 similar decisions in other projects
- 1 superseded version (ADR-001-v1)
```

## See Also

- Agent definition: `.opencode/agent/subagents/scout.md`
- Query patterns: Scout Agent "Query Patterns" section
- Memory system: `.claude/README.md` § Memory System
