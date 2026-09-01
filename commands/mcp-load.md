---
description: "Load an approved MCP server and activate its tools."
---

# /mcp-load

Load an approved MCP server and activate its tools.

## Usage

```
/mcp-load <server-name>
```

## Examples

```
/mcp-load database-server      # Load PostgreSQL database tools
# neo4j-cypher removed (AD-50) — use allura-brain_memory_* tools
# neo4j-memory removed (AD-50) — use allura-brain_memory_* tools
```

## How It Works

1. Validates server is available in MPC Docker catalog
2. Uses `MCP_DOCKER_mcp-add` to register the server
3. Optionally configures with `MCP_DOCKER_mcp-config-set` if needed
4. Logs `MCP_LOADED` event to PostgreSQL
5. New tools become available immediately

## Prerequisites

- Server must be in the MCP Docker catalog
- Configuration may be required for some servers
- Example: Database URL for database-server

## Result

```json
{
  "event": "MCP_LOADED",
  "server_id": "database-server",
  "tools_available": [
    "MCP_DOCKER_query_database",
    "MCP_DOCKER_execute_sql",
    "MCP_DOCKER_insert_data"
  ]
}
```

**Note:** Loading is idempotent (safe to repeat).