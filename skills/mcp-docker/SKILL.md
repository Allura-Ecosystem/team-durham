---
name: mcp-docker
description: Discover, configure, and manage MCP servers from Docker Hub's MCP Catalog using MCP_DOCKER tools. Use this skill when you need to add new MCP tools like Neo4j, PostgreSQL, GitHub, web search, databases, or any containerized MCP server. This skill provides workflows for finding MCP servers with MCP_DOCKER_mcp-find, configuring them with MCP_DOCKER_mcp-config-set, adding them with MCP_DOCKER_mcp-add, and executing their tools with MCP_DOCKER_mcp-exec.
---

# MCP Docker

## Overview

This skill enables dynamic discovery and management of MCP (Model Context Protocol) servers from Docker Hub's MCP Catalog using the MCP_DOCKER toolset. Rather than pre-installing all possible MCP tools, you can discover, configure, and add MCP servers on-demand during your session.

Prefer tools already present in the session first. Use MCP_DOCKER when you need a missing capability, not as a replacement for repo-native tools.

## When to Use This Skill

- **Adding new capabilities**: Need web search, database access, file system operations, or browser automation?
- **Dynamic tool discovery**: Want to find the right MCP server for a specific task
- **Configuring credentials**: Need to set up API keys, connection strings, or authentication tokens
- **Managing MCP servers**: Adding, updating, or removing MCP servers mid-session

## Core Workflow

### Step 1: Find the Right MCP Server

Use `MCP_DOCKER_mcp-find` to search Docker Hub's MCP catalog:

```
MCP_DOCKER_mcp-find --query "neo4j postgres mysql mongodb"
MCP_DOCKER_mcp-find --query "browser playwright crawl scrape"
MCP_DOCKER_mcp-find --query "perplexica brave search web"
```

**Common search patterns:**
- `database postgres mysql redis` - Database connectors
- `browser crawl scrape fetch` - Web scraping and browser automation
- `github git gitlab` - Version control and code repositories
- `notion slack teams` - Productivity and collaboration
- `aws azure gcp` - Cloud providers

### Step 2: Configure the Server

Use `MCP_DOCKER_mcp-config-set` to provide connection details and credentials:

```
MCP_DOCKER_mcp-config-set --server neo4j --config '{"url":"bolt://localhost:7687","username":"neo4j","password":"password"}'
MCP_DOCKER_mcp-config-set --server perplexica --config '{"api_url":"http://127.0.0.1:7722/mcp"}'
MCP_DOCKER_mcp-config-set --server filesystem --config '{"paths":["/home/user/projects"]}'
```

**Security notes:**
- Never hardcode credentials in skill files
- Use environment variables when possible
- The config is validated before being applied

### Step 3: Add and Activate

Use `MCP_DOCKER_mcp-add` to register the configured server:

```
MCP_DOCKER_mcp-add --name neo4j --activate
MCP_DOCKER_mcp-add --name perplexica --activate
MCP_DOCKER_mcp-add --name filesystem --activate
```

### Step 4: Use the Activated Tools

Once added, the server's tools usually surface directly in the session. Call the surfaced tool directly.

Use `MCP_DOCKER_mcp-exec` only when a server tool exists in the session but is not exposed in the normal tool list.

## Complete Examples

### Example 1: Adding Neo4j for Knowledge Graph

```
# 1. Find Neo4j servers
MCP_DOCKER_mcp-find --query "neo4j graph database cypher"

# 2. Configure with your credentials
MCP_DOCKER_mcp-config-set --server neo4j --config '{
  "url": "bolt://knowledge-neo4j:7687",
  "username": "neo4j",
  "password": "your-password"
}'

# 3. Add to session
MCP_DOCKER_mcp-add --name neo4j --activate

# 4. Execute Cypher queries
MCP_DOCKER_mcp-exec --name neo4j --tool read_neo4j_cypher --arguments '{
  "query": "MATCH (n) RETURN count(n) as node_count"
}'
```

### Example 2: Adding Web Search with Perplexica

```
# Configure Perplexica
MCP_DOCKER_mcp-config-set --server perplexica --config '{
  "api_url": "http://127.0.0.1:7722/mcp"
}'

MCP_DOCKER_mcp-add --name perplexica --activate

# Search the web
MCP_DOCKER_mcp-exec --name perplexica --tool search --arguments '{
  "query": "OpenCode MCP server announcement",
  "max_results": 5,
  "search_depth": "comprehensive"
}'
```

### Example 3: File System Access

```
# Configure filesystem (restrict to project directories)
MCP_DOCKER_mcp-config-set --server filesystem --config '{
  "paths": ["${CLAUDE_PROJECT_DIR}"]
}'

MCP_DOCKER_mcp-add --name filesystem --activate

# Read a file
MCP_DOCKER_mcp-exec --name filesystem --tool read_file --arguments '{
  "path": "${CLAUDE_PROJECT_DIR}/README.md"
}'
```

### Example 4: Repo Policy Guardrail

For this repository, do **not** configure or add a local `allura-memory` MCP server through MCP_DOCKER.

Use:
- first-party `allura-brain_*` tools when available
- `MCP_DOCKER` for approved Docker-backed servers such as Neo4j, PostgreSQL, GitHub, Perplexica, and Context7

## Essential MCP Servers

### Databases & Storage

| Server | Description | Required Config |
|--------|-------------|---------------|
| `neo4j` | Neo4j graph database | url, username, password |
| `postgres` | PostgreSQL database | connection_string |
| `mongodb` | MongoDB & Atlas | connection_string |
| `redis` | Redis key-value store | host, port, password |
| `elasticsearch` | Elasticsearch search | host, port, username, password |

### Web & Search

| Server | Description | Required Config |
|--------|-------------|---------------|
| `perplexica` | Web search and extraction | api_url |
| `brave` | Brave Search API | api_key |
| `playwright` | Browser automation | none |
| `firecrawl` | Web scraping | api_key |

### Developer Tools

| Server | Description | Required Config |
|--------|-------------|---------------|
| `github` | GitHub API operations | personal_access_token |
| `docker` | Docker Hub API | none |
| `filesystem` | Local file system access | paths (array) |
| `context7` | Code documentation | none |

### Productivity

| Server | Description | Required Config |
|--------|-------------|---------------|
| `notion` | Notion workspace | integration_token |
| `slack` | Slack workspace | bot_token |

## Tool Reference

### MCP_DOCKER_mcp-find

Search Docker Hub's MCP catalog for available servers.

**Parameters:**
- `query` (string): Search terms (space-separated for OR matching)
- `limit` (number, optional): Maximum results to return

**Returns:** List of matching MCP servers with descriptions.

### MCP_DOCKER_mcp-config-set

Configure an MCP server with connection details and credentials.

**Parameters:**
- `server` (string): Server name from mcp-find results
- `config` (string): JSON configuration object

**Note:** Must be called before `mcp-add`. Configuration persists for the session.

### MCP_DOCKER_mcp-add

Add and optionally activate an MCP server.

**Parameters:**
- `name` (string): Server name
- `activate` (boolean, optional): Immediately activate server

### MCP_DOCKER_mcp-exec

Execute a tool from a configured MCP server.

**Parameters:**
- `name` (string): Server name
- `tool` (string): Tool name to execute
- `arguments` (string, optional): JSON arguments for the tool

### MCP_DOCKER_mcp-remove

Remove an MCP server from the session.

**Parameters:**
- `name` (string): Server name to remove

## Best Practices

1. **Discover before adding**: Always use `MCP_DOCKER_mcp-find` first to find the right server
2. **Use environment variables**: Never hardcode credentials in skills or prompts
3. **Limit filesystem access**: Only allow specific directories, never root (`/`)
4. **One-time setup**: Configure once per session, reuse multiple times
5. **Clean up**: Remove servers when done if experiencing context bloat: `MCP_DOCKER_mcp-remove --name unused-server`
6. **Check documentation**: Some servers have specific configuration requirements
7. **Respect repo policy**: Avoid local ad hoc memory servers when the repo defines a governed memory surface

## Troubleshooting

### Server not found
- Check spelling in `MCP_DOCKER_mcp-find` query
- Try broader search terms
- Verify the server exists in Docker Hub MCP catalog

### Configuration fails
- Verify all required fields are provided
- Check credentials (API keys, passwords)
- Ensure network connectivity to the service

### Tool execution fails
- Verify server is activated (`--activate` flag)
- Check tool name matches exactly (case-sensitive)
- Review tool-specific parameter requirements

### Context bloat
- Remove unused servers: `MCP_DOCKER_mcp-remove --name server-name`
- Only add servers when needed
- Use `MCP_DOCKER_mcp-find` to preview without adding

## Resources

### References

- `@references/docker-mcp-catalog.md` - Full Docker MCP catalog reference with 50+ servers
- `@references/mcp-server-configs.md` - Common configuration patterns

## Cross-References

- **`global-mcp-lookup` skill** — Unified MCP phonebook (all servers, tools, runtimes)
- **`global-mcp-lookup/references/mcp-registry.yaml`** — Machine-readable server index
- **`context7` skill** — Context7 is an API skill (no MCP Docker server), not available via MCP Docker catalog
- **`penpot-uiux-design` skill** — Penpot is a remote MCP server, not a Docker MCP server
- **`mcp-integration.md` rules** — Permission matrix and non-overload rules

## See Also

- Global MCP Registry: `.claude/skills/global-mcp-lookup/SKILL.md`
- Docker MCP Catalog: https://hub.docker.com/mcp
- MCP Specification: https://modelcontextprotocol.io
- OpenCode Documentation: https://opencode.ai/docs
