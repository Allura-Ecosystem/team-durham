---
name: omni-tool-compose
description: Composes prompts.chat, grep-mcp (GitHub code search), MCP Docker (DB + web + MCP gateway), and Context7 (library docs) into unified research-build workflows. Use when (1) user asks to 'compose', 'combine', or 'wire' tools together, (2) multi-source research spanning docs, code, and data is needed, (3) user references 'prompts.chat', 'grep-mcp', 'context7', or 'mcp docker' in a composable context, (4) building a pipeline that needs library docs AND code search AND database AND prompt templates.
---

# Omni-Tool Compose

> Unified gateway that chains **prompts.chat** + **grep-mcp** + **MCP Docker** + **Context7** into composable workflows.

---

## Tool Inventory

| Family | Tools (subset) | Purpose |
|--------|---------------|---------|
| **prompts.chat** | `prompts_chat_search_prompts`, `prompts_chat_get_prompt`, `prompts_chat_save_prompt`, `prompts_chat_improve_prompt`, `prompts_chat_save_skill`, `prompts_chat_get_skill`, `prompts_chat_search_skills`, `prompts_chat_add_file_to_skill`, `prompts_chat_update_skill_file`, `prompts_chat_remove_file_from_skill` | Prompt template CRUD, skill management, prompt improvement |
| **grep-mcp** | `grep_query` | Real-time GitHub code search by pattern, language, repo |
| **MCP Docker** | `execute_sql`, `query_database`, `insert_data`, `update_data`, `delete_data`, `create_table`, `list_tables`, `describe_table`, `connect_to_database`, `perplexica_search`, `perplexica_extract`, `perplexica_crawl`, `perplexica_map`, `perplexica_research`, `web_search_exa`, `resolve-library-id`, `get-library-docs`, `mcp-find`, `mcp-add`, `mcp-config-set`, `mcp-exec`, `code-mode` | Database CRUD, web search/crawl/research, MCP gateway orchestration, dynamic server add |
| **Context7** | `resolve-library-id`, `get-library-docs` | Resolve library names to IDs, fetch current library documentation |

---

## Workflow Patterns

### Pattern A: Research → Docs → Code → Knowledge

**When:** Investigating a new technology stack or building a feature from scratch.

```
1. Context7  →  resolve-library-id  →  get-library-docs
2. grep-mcp →  grep_query           →  find real-world usage patterns
3. MCP Docker→  perplexica_search     →  get latest blog posts / changelog
4. MCP Docker→  execute_sql          →  log findings to events table
5. prompts.chat→ improve_prompt      →  generate implementation prompt from all data
```

**Output:** A structured research brief + an improved implementation prompt ready to execute.

### Pattern B: Code Audit → Docs → Fix → Verify

**When:** Auditing existing code for issues or deprecations.

```
1. grep-mcp  →  grep_query          →  find all usages of target pattern
2. Context7  →  resolve-library-id  →  get-library-docs (current API)
3. MCP Docker→  query_database       →  check past audit records
4. prompts.chat→ search_prompts      →  find relevant review/audit prompt
5. prompts.chat→ get_prompt          →  load and fill template
6. MCP Docker→  insert_data          →  log audit result
```

**Output:** Audit report with code snippets, current API docs, and logged findings.

### Pattern C: Skill Build → Test → Ship

**When:** Creating a new composable skill or agent capability.

```
1. prompts.chat→ search_skills       →  check if similar skill exists
2. grep-mcp  →  grep_query          →  find reference implementations
3. Context7  →  get-library-docs    →  get current SDK/API docs
4. prompts.chat→ save_skill         →  create SKILL.md + bundled files
5. prompts.chat→ improve_prompt     →  optimize skill description
6. MCP Docker→  insert_data          →  log skill creation event
```

**Output:** Published skill on prompts.chat with optimized description.

### Pattern D: Competitive Intelligence → Analysis → Decision

**When:** Researching competitors, market positioning, or technology choices.

```
1. MCP Docker→  perplexica_research →  deep research on competitor/topic
2. MCP Docker→  perplexica_extract  →  extract specific competitor pages
3. grep-mcp  →  grep_query          →  find competitor OSS code patterns
4. Context7  →  get-library-docs    →  get dependency documentation
5. MCP Docker→  query_database       →  compare with past analyses
6. prompts.chat→ improve_prompt     →  generate strategic brief prompt
7. MCP Docker→  insert_data          →  log analysis with metadata
```

**Output:** Multi-source competitive brief with data, code evidence, and strategic prompt.

### Pattern E: MCP Server Discovery → Wire → Test

**When:** Finding and composing new MCP servers into workflows.

```
1. MCP Docker→  mcp-find             →  search catalog by keyword
2. MCP Docker→  mcp-add              →  add server to session
3. MCP Docker→  mcp-config-set       →  configure server if needed
4. MCP Docker→  mcp-exec             →  execute tool from new server
5. MCP Docker→  code-mode            →  compose into JS script
6. prompts.chat→ save_skill          →  save composition as reusable skill
```

**Output:** New MCP server wired into session, optionally saved as skill.

---

## Execution Rules

1. **Parallel when independent.** Steps 1-3 in Pattern A can run concurrently (no data dependencies).
2. **Sequential when dependent.** Step 4 in Pattern A depends on steps 1-3 results — must wait.
3. **Always log.** Final step in every pattern is an `insert_data` to the `events` table with:
   - `event_type`: `OMNI_TOOL_COMPOSE`
   - `group_id`: `allura-team-durham`
   - `agent_id`: current agent
   - `metadata`: JSON with pattern used, tools called, summary of results
4. **Fail gracefully.** If one tool family is unavailable (e.g., DB disconnected), skip its step and note the gap in the log.
5. **Prefer native tools over `mcp-exec`.** Use direct tool calls when available; fall back to `mcp-exec` for dynamically added servers.

---

## Quick-Start Example

**Task:** "Research the latest Stripe API for subscription handling and find how top OSS projects implement it."

```
// Step 1: Get Stripe docs (Context7)
resolve-library-id("stripe") → "/stripe/stripe-node"
get-library-docs("/stripe/stripe-node", topic="subscriptions")

// Step 2: Find real implementations (grep-mcp)
grep_query("stripe.subscriptions.create", language="TypeScript")

// Step 3: Get recent articles (MCP Docker)
perplexica_search("Stripe subscription API 2025 best practices")

// Step 4: Compose brief (prompts.chat)
improve_prompt("Write a Stripe subscription integration guide based on: [docs] [code patterns] [articles]")

// Step 5: Log (MCP Docker)
insert_data("events", "event_type, group_id, agent_id, status, metadata",
  "'OMNI_TOOL_COMPOSE', 'allura-team-durham', 'openagent', 'completed', '{...}'")
```

---

## Context7 Integration Notes

The project already has a `context7` skill at `.opencode/skills/context7/SKILL.md` with curl-based API usage. This skill **supersedes** that approach by using native `resolve-library-id` and `get-library-docs` tools when available, falling back to curl if those tools are unreachable.

## MCP Docker Integration Notes

The project has `mcp-docker-memory-system` skill at `.opencode/skills/mcp-docker-memory-system/SKILL.md`. This skill **extends** that contract by adding web search/crawl/research and MCP gateway orchestration on top of the existing DB CRUD patterns.

---

## Error Handling

| Condition | Action |
|-----------|--------|
| MCP Docker disconnected | Skip DB writes; use local file logging as fallback |
| Context7 rate limited | Fall back to `perplexica_search` for docs |
| grep-mcp no results | Expand query with broader terms, try `repo:` filter |
| prompts.chat auth error | Continue with raw prompt; note missing save capability |
| Tool timeout | Retry once; if still failing, skip and note in output |
