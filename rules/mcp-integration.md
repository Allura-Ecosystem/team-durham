---
description: MCP server integration patterns for Team Durham
globs: [".claude/**", "clients/**"]
---

# MCP Integration — Team Durham

## THE RULES

**NEVER `docker exec` for DB operations. ALWAYS use `MCP_DOCKER_*` tools.**
**NEVER use BrowserOS to edit Notion. ALWAYS use `MCP_DOCKER_notion-*` tools.**
**BrowserOS is for visual inspection only — not data writes.**

## Global MCP Registry

Before working with any MCP server, consult the **canonical registry**:

| File | Purpose |
|------|---------|
| `.claude/skills/global-mcp-lookup/SKILL.md` | Human-readable MCP phonebook (all servers, tools, runtimes) |
| `.claude/skills/global-mcp-lookup/references/mcp-registry.yaml` | Machine-readable server index (YAML) |

The registry maps every capability to its runtime type (`local`, `remote`, `api`, `custom`) and provides setup instructions, tool lists, and agent permissions.

**Discovery order:**
1. Check `global-mcp-lookup` skill first — is the server listed?
2. If Docker-based, use `MCP_DOCKER_mcp-find` to confirm catalog presence
3. If remote, verify `opencode.json` has the server config
4. If API, use the companion skill instructions

## Active Tool Stack

### Allura Brain
| Tool | Use | Permission |
|------|-----|------------|
| `MCP_DOCKER_execute_sql` | Raw SQL reads | All agents (read-only) |
| `MCP_DOCKER_query_database` | NL SQL reads | All agents (read-only) |
| `MCP_DOCKER_insert_data` | Append events | Kotler, Aaker, Glaser, Rand |
| Governed retrieval via Allura Brain memory tools | Semantic graph reads | All agents (read-only) |
| Governed promotion via Allura Brain memory tools | Semantic graph writes | Kotler only |

### Notion (MCP Docker — programmatic API)
| Tool | Use | Permission |
|------|-----|------------|
| `MCP_DOCKER_notion-fetch` | Read any page/DB by ID or URL | All agents (read) |
| `MCP_DOCKER_notion-search` | Semantic search across workspace | All agents (read) |
| `MCP_DOCKER_notion-update-page` | Edit page content or properties | Kotler, Aaker, Rand, Ogilvy |
| `MCP_DOCKER_notion-create-pages` | Create new pages | Kotler, Rand, Ogilvy |
| `MCP_DOCKER_notion-create-database` | Create databases | Kotler |
| `MCP_DOCKER_notion-get-comments` | Read inline comments | All agents (read) |
| `MCP_DOCKER_notion-create-comment` | Leave QA/review notes | Munari, Kotler |
| `MCP_DOCKER_notion-move-pages` | Move pages between sections | Kotler |
| `MCP_DOCKER_notion-duplicate-page` | Clone page as template | Kotler, Rand |

**Agent Notion permissions:**
| Agent | Read | Write | Comment |
|-------|------|-------|---------|
| Kotler | ✓ | ✓ | ✓ |
| Aaker | ✓ | ✓ strategy pages | ✓ |
| Glaser | ✓ | — | ✓ |
| Rand | ✓ | ✓ brand kit pages | ✓ |
| Ogilvy | ✓ | ✓ copy pages | ✓ |
| Munari | ✓ | — | ✓ QA notes only |
| Scout | ✓ | — | — |
| Tufte | ✓ | — | — |

### Web Research (Perplexica — NOT for Notion)
| Tool | Use | Permission |
|------|-----|------------|
| `perplexica_search` | Search public web (self-hosted, port 7722) | All agents |

**Perplexica replaces Tavily.** Self-hosted on `http://127.0.0.1:7722/mcp`, backed by Vane on port 3000. Registered globally in `~/.claude.json` mcpServers. Docker container: `perplexica-mcp`.

### Live Docs (Context7)
| Tool | Use |
|------|-----|
| `MCP_DOCKER_resolve-library-id` | Library → Context7 ID |
| `MCP_DOCKER_get-library-docs` | Fetch live docs |

### Allura Brain Memory
| Tool | Use |
|------|-----|
| `allura-brain_memory_search` | Search memories |
| `allura-brain_memory_add` | Add episodic memory |
| `allura-brain_memory_promote` | Promote to semantic |
| `allura-brain_memory_get` | Get specific memory |
| `allura-brain_memory_list` | List user memories |

## Event Types (Team Durham)

| Event Type | When | Who |
|-----------|------|-----|
| `DDR_CREATED` | Design Decision Record | Kotler, Aaker |
| `BRAND_INTERFACE_DEFINED` | Brand spec defined | Kotler, Glaser, Rand |
| `DESIGN_DECISION` | Strategic/visual decision | Kotler, Aaker, Glaser |
| `TASK_COMPLETE` | Task finished | Any agent |
| `BLOCKED` | Blocker encountered | Any agent |
| `LESSON_LEARNED` | Pattern captured | Munari, Kotler |

## Non-Overload Rules

1. PostgreSQL: high-volume event logs (every session)
2. Semantic knowledge graph: promoted memory only (DDRs, patterns)
3. Max one semantic graph write per completed task
4. Always search first — never create duplicates