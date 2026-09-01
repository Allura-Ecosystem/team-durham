---
name: global-mcp-lookup
description: "Unified MCP server registry and discovery for Team Durham. Single source of truth for every MCP capability — Penpot, Allura Brain, Context7, Notion, PostgreSQL (RuVector semantic graph), Figma, fal.ai, and more. Trigger when asking 'what MCP tools are available?', 'which server provides X?', 'how do I connect to Y?', 'MCP registry', 'MCP lookup', 'available tools', or when onboarding a new agent. Cross-references mcp-registry.yaml as the canonical server index."
globs: [".claude/**", "clients/**"]
---

# Global MCP Lookup — Team Durham

> **Single source of truth** for every MCP server, tool, and runtime in the Team Durham pipeline.

## Purpose

Instead of scattering MCP configuration across multiple skill files, rules, and env vars, this skill provides **one canonical registry** that answers:

- "What MCP servers are available?"
- "Which server provides tool X?"
- "How do I connect to Y?"
- "What's the runtime type — Docker, remote, API?"

Every agent, skill, and command should consult this registry (and its companion `mcp-registry.yaml`) before attempting MCP operations.

---

## MCP Server Registry

### Active Servers

| # | Server | Runtime | Connection | Primary Tools | Status | Skill |
|---|--------|---------|------------|---------------|--------|-------|
| 1 | **MCP Docker Gateway** | `local` (Docker) | `docker mcp gateway run` | `MCP_DOCKER_query_database`, `MCP_DOCKER_execute_sql`, `MCP_DOCKER_insert_data`, `MCP_DOCKER_notion-*`, `MCP_DOCKER_search_memories`, `MCP_DOCKER_create_entities`, `MCP_DOCKER_mcp-*` | ✅ Active | `mcp-docker` |
| 2 | **Allura Brain** | Native (Brain MCP) | `allura-brain_*` tools (PostgreSQL (episodic) + RuVector semantic graph backend) | `allura-brain_memory_search`, `allura-brain_memory_add`, `allura-brain_memory_promote`, `allura-brain_memory_get`, `allura-brain_memory_list`, `allura-brain_memory_delete`, `allura-brain_memory_update`, `allura-brain_memory_restore`, `allura-brain_memory_export` | ⚠️ Degraded (SASL bug) | `allura-memory-skill` |
| 3 | **Penpot** | `remote` (HTTP/SSE) | `http://localhost:4401/mcp` | `mcp__penpot__execute_code`, `mcp__penpot__export_shape`, `mcp__penpot__import_image`, `mcp__penpot__penpot_api_info` | ✅ Active (requires running server) | `penpot-uiux-design` |
| 4 | **Context7** | `api` (HTTP) | `https://context7.com/api/v2` (curl-based) | `MCP_DOCKER_resolve-library-id`, `MCP_DOCKER_get-library-docs` (Docker MCP) + direct `curl` API | ✅ Active | `context7` |
| 5 | **Figma** | `custom` (OAuth) | Figma API via MCP plugin | `mcp__figma__use_figma`, `mcp__figma__get_screenshot` | ✅ Active | `figma-use` |
| 6 | **Notion** | Docker (via MCP Docker) | `MCP_DOCKER_notion-*` tools | `MCP_DOCKER_notion-fetch`, `MCP_DOCKER_notion-search`, `MCP_DOCKER_notion-update-page`, `MCP_DOCKER_notion-create-pages`, `MCP_DOCKER_notion-create-database`, `MCP_DOCKER_notion-get-comments`, `MCP_DOCKER_notion-create-comment`, `MCP_DOCKER_notion-move-pages`, `MCP_DOCKER_notion-duplicate-page` | ✅ Active | `notion-brand-publisher`, `notion-policy-reader` |
| 7 | **Semantic Graph (RuVector)** | Governed gateway | `${ALLURA_GATEWAY_URL:-http://localhost:5888}` | `allura-brain_memory_search`, `allura-brain_memory_add`, `allura-brain_memory_promote`, `allura-brain_memory_get`, `allura-brain_memory_list`, `allura-brain_memory_update`, `allura-brain_memory_delete` | ✅ Active | `allura-brain` |
| 8 | **PostgreSQL** | Docker (via MCP Docker) | `host.docker.internal:5432` | `MCP_DOCKER_query_database`, `MCP_DOCKER_execute_sql`, `MCP_DOCKER_execute_unsafe_sql`, `MCP_DOCKER_insert_data`, `MCP_DOCKER_update_data`, `MCP_DOCKER_delete_data`, `MCP_DOCKER_list_tables`, `MCP_DOCKER_describe_table`, `MCP_DOCKER_create_table` | ✅ Active | `mcp-docker-memory` |
| 9 | **Perplexica** | `remote` (self-hosted) | `http://127.0.0.1:7722/mcp` | `perplexica_search` | ✅ Active | `perplexica-mcp` |
| 10 | **fal.ai** | `custom` (API) | `@fal-ai/client` npm package | Fal.ai image generation tools | ✅ Active | `fal-ideogram-executor`, `falai-runner` |
| 11 | **Tavily** | Docker (via MCP Docker) | `MCP_DOCKER_tavily_*` tools | `MCP_DOCKER_tavily_search`, `MCP_DOCKER_tavily_extract`, `MCP_DOCKER_tavily_crawl`, `MCP_DOCKER_tavily_map`, `MCP_DOCKER_tavily_research` | ✅ Active | — |

### Runtime Types Explained

| Type | Description | How to Connect | Example |
|------|-------------|----------------|---------|
| `local` | Docker MCP Gateway (runs via `docker mcp gateway run`) | Auto-configured in `opencode.json` | MCP_DOCKER |
| `remote` | HTTP/SSE MCP server on a URL | Requires server running + config in `opencode.json` or `.claude.json` | Penpot (`localhost:4401/mcp`) |
| `api` | Direct HTTP API (no MCP server wrapper) | curl-based skill instructions | Context7 |
| `custom` | Proprietary SDK/OAuth integration | Agent-specific setup | Figma, fal.ai |

---

## Quick Lookup: Tool → Server

When you know a tool name but not which server provides it:

| Tool Prefix | Server | Runtime |
|-------------|--------|---------|
| `MCP_DOCKER_` | MCP Docker Gateway | `local` |
| `allura-brain_` | Allura Brain (native) | Native MCP |
| `mcp__penpot__` | Penpot MCP | `remote` |
| `mcp__figma__` | Figma MCP | `custom` |
| `perplexica_` | Perplexica | `remote` |
| `curl` (context7.com) | Context7 | `api` |

---

## Setup Instructions by Server

### Penpot MCP Setup

```bash
# 1. Start the MCP server (if not already running)
npx -y @penpot/mcp@latest

# 2. Verify connectivity
# Try calling mcp__penpot__penpot_api_info — if it succeeds, done.

# 3. In Penpot browser: Plugins → Load plugin from URL → http://localhost:4400/manifest.json
#    Click "Connect to MCP server" in plugin UI

# Server endpoints:
# - Plugin server: http://localhost:4400/manifest.json
# - MCP HTTP/SSE: http://localhost:4401/mcp
# - WebSocket: ws://localhost:4402
# - Debug REPL: http://localhost:4403
```

### Context7 Setup

Context7 is **not** an MCP Docker server. It uses direct HTTP API calls:

```bash
# Search for a library
curl -s "https://context7.com/api/v2/libs/search?libraryName=react&query=hooks" | jq '.results[0]'

# Fetch documentation
curl -s "https://context7.com/api/v2/context?libraryId=/vercel/next.js&query=app+router&type=txt"
```

**Note:** Context7 is also available via `MCP_DOCKER_resolve-library-id` and `MCP_DOCKER_get-library-docs` when the Docker MCP catalog has a Context7 server registered.

### Allura Brain Setup

Allura Brain has two access pathways:

1. **Primary (native MCP tools):** `allura-brain_memory_search`, `allura-brain_memory_add`, etc.
   - Currently degraded due to SASL bug
   - Fall back to MCP Docker pathway when unavailable

2. **Fallback (MCP Docker):** `MCP_DOCKER_execute_sql` + `MCP_DOCKER_search_memories`
   - These connect to the same PostgreSQL (episodic) and semantic graph backends
   - Use when `allura-brain_*` tools are unavailable

### Notion Setup

Notion is accessed entirely through MCP Docker gateway tools:
- Requires `NOTION_TOKEN` and `NOTION_VERSION` in `.env.local`
- Tools: `MCP_DOCKER_notion-*` (20+ tools available)

---

## Agent Permission Matrix

Which agents can use which MCP servers:

| Agent | DB (PG / semantic graph) | Notion | Penpot | Figma | fal.ai | Context7 | Perplexica |
|-------|---------------|--------|--------|-------|--------|----------|------------|
| Kotler | ✅ Write | ✅ Write | ✅ Read | ✅ Read | — | ✅ | ✅ |
| Aaker | ✅ Write | ✅ Write | — | ✅ Read | — | ✅ | ✅ |
| Glaser | ✅ Write | ✅ Comment | ✅ Write | ✅ Write | ✅ Write | ✅ | ✅ |
| Rand | ✅ Write | ✅ Write | ✅ Write | ✅ Write | ✅ Write | ✅ | ✅ |
| Ogilvy | ❌ Read | ✅ Write | — | — | — | ✅ | ✅ |
| Munari | ❌ Read | ❌ Comment | ✅ Read | ✅ Read | — | ✅ | ✅ |
| Tufte | ❌ Read | ❌ Read | — | — | — | ✅ | ✅ |
| Scout | ❌ Read | ❌ Read | ✅ Read | ✅ Read | — | ✅ | ✅ |

---

## How to Add a New MCP Server

### If the server exists in Docker Hub MCP Catalog:

```bash
# 1. Find the server
MCP_DOCKER_mcp-find --query "server-name"

# 2. Configure credentials
MCP_DOCKER_mcp-config-set --server server-name --config '{...}'

# 3. Add and activate
MCP_DOCKER_mcp-add --name server-name --activate

# 4. Update this registry
# Add entry to .claude/skills/global-mcp-lookup/references/mcp-registry.yaml
```

### If the server is a remote HTTP MCP server:

1. Start the server locally or confirm it's running
2. Add to `opencode.json` under `"mcp"` with `"type": "remote"` and `"url"`
3. Add tool permissions to `.claude/settings.local.json`
4. Add entry to `mcp-registry.yaml`
5. Create a companion skill in `.claude/skills/` if needed

### If the server is an API-only service:

1. Create a skill in `.claude/skills/` with curl/API instructions
2. Add entry to `mcp-registry.yaml` with `runtime: api`
3. Cross-reference from `global-mcp-lookup/SKILL.md`

---

## Canonical Registry File

The YAML companion to this skill lives at:

```
.claude/skills/global-mcp-lookup/references/mcp-registry.yaml
```

That file is the **machine-readable** source of truth. This SKILL.md is the **human-readable** guide. Keep both in sync.

---

## Cross-Reference Map

| Companion File | Purpose |
|----------------|---------|
| `references/mcp-registry.yaml` | Machine-readable server index |
| `../mcp-docker/SKILL.md` | Dynamic MCP Docker workflow |
| `../mcp-docker-memory/SKILL.md` | Memory tool reference |
| `../mcp-integration.md` (rules) | Permission matrix and non-overload rules |
| `../allura-memory-skill/SKILL.md` | Allura Brain governance |
| `../penpot-uiux-design/SKILL.md` | Penpot design workflow |
| `../context7/SKILL.md` | Context7 API instructions |
| `../mcp-validation-gate/validate-mcp.js` | MCP server health checks |

---

## Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| Penpot tools not appearing | Is `npx -y @penpot/mcp@latest` running? | Start server, verify `localhost:4401/mcp` |
| Allura Brain tools failing | SASL bug on native MCP | Use `MCP_DOCKER_*` fallback tools |
| Context7 returning 403 | Rate limit reached | Wait or use `MCP_DOCKER_get-library-docs` |
| `MCP_DOCKER_*` tools missing | Is Docker MCP Gateway running? | Run `docker mcp gateway run` or restart session |
| PostgreSQL connection refused | Is PG container running? | `docker ps \| grep postgres` |
| Permission denied on tool | Check `.claude/settings.local.json` allowlist | Add `mcp__server__tool` to permissions |