---
description: "Request approval for a pending MCP server."
---

# /mcp-approve

Request approval for a pending MCP server.

## Usage

```
/mcp-approve <server-id>
```

## Examples

```
/mcp-approve database        # Approve database server
/mcp-approve ruvector         # Approve RuVector graph adapter
```

## How It Works

1. Validates server exists in MCP Docker catalog
2. Logs `MCP_APPROVED` event to PostgreSQL
3. Shows next step: load with `/mcp-load`

## Prerequisites

- Server must be available in MCP Docker catalog
- Use `mcp-find` to discover available servers first

## Result

```json
{
  "event": "MCP_APPROVED",
  "server_id": "database",
  "next_step": "/mcp-load database"
}
```

**Note:** Approval is permanent (logged to audit trail). Use only for vetted servers.