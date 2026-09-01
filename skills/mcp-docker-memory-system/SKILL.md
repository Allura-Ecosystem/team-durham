---
name: mcp-docker-memory-system
description: "Canonical MCP Docker interface for Team Durham's Allura Brain memory system. Use when agents need PostgreSQL event logging, semantic knowledge graph reads/writes, Notion access through MCP Docker, or the rule that database work must go through MCP tools rather than docker exec."
---

# Skill: mcp-docker-memory-system

# MCP Docker Memory System — Team Durham

> **Skill for:** All agents in Team Durham
> **Purpose:** Provides the canonical interface to Allura Brain (PostgreSQL (episodic) + RuVector semantic graph) via MCP_DOCKER tools

---

## THE RULE

**NEVER `docker exec` for DB operations. ALWAYS use `mcp__MCP_DOCKER__*` tools.**

---

## Tool Stack

### PostgreSQL (Episodic Store — Every Action)
| Tool | Use | Permission |
|------|-----|------------|
| `mcp__MCP_DOCKER__query_database` | Natural language SQL reads | All agents (read-only) |
| `mcp__MCP_DOCKER__execute_sql` | Raw SQL reads | All agents (read-only) |
| `mcp__MCP_DOCKER__insert_data` | Append events only | Kotler, Aaker, Glaser, Rand (write) |

### Semantic Knowledge Graph (Promoted Knowledge Only)
| Access | Use | Permission |
|------|-----|------------|
| Governed retrieval via Allura Brain memory tools | Graph reads | All agents (read-only) |
| Governed promotion via Allura Brain memory tools | Graph writes | Kotler only (SUPERSEDES) |

### Notion (Dashboard + Knowledge Base)
| Tool | Use | Permission |
|------|-----|------------|
| `mcp__MCP_DOCKER__notion-search` | Search workspace | All agents |
| `mcp__MCP_DOCKER__notion-fetch` | Fetch page/database | All agents |
| `mcp__MCP_DOCKER__notion-create-pages` | Create pages | Kotler, Rand |
| `mcp__MCP_DOCKER__notion-update-page` | Update pages | Kotler, Rand |

---

## Write-Back Contract

### Event Types (Team Durham)

| Event Type | When | Who |
|-----------|------|-----|
| `DDR_CREATED` | Design Decision Record created | Kotler, Aaker |
| `BRAND_INTERFACE_DEFINED` | Brand asset spec defined | Kotler, Glaser, Rand |
| `DESIGN_DECISION` | Strategic or visual decision | Kotler, Aaker, Glaser |
| `TASK_COMPLETE` | Task finished | Any agent |
| `BLOCKED` | Blocker encountered | Any agent |
| `LESSON_LEARNED` | Pattern or insight captured | Munari, Kotler |

### Insert Pattern

```javascript
mcp__MCP_DOCKER__insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'DDR_CREATED', 'allura-team-durham', 'kotler', 'completed', '{\"decision\": \"...\", \"rationale\": \"...\"}'"
})
```

### Semantic Graph Promotion (Kotler Only)

1. Search first — never create duplicates
2. Only promote if: reusable across ≥2 projects, validated, no duplicate
3. Create a `SUPERSEDES` relation in the semantic graph for updates, never mutate

---

## Non-Overload Rules

1. PostgreSQL is for high-volume event logs (every session action)
2. The semantic knowledge graph is for promoted memory only (DDRs, patterns, recurring failures + validated fixes)
3. Batch writes: at most **one** semantic graph write per completed task/decision
4. De-duplicate: **search first**; only create if new
5. Aggregate bursts into a single "session checkpoint" insight
