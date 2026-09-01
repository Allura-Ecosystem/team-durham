---
description: "Request approval for a pending MCP server (Brooks only)"
argument-hint: "<server-id>"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# /mcp-approve

Request approval for a pending MCP server (Brooks only).

## Usage

```
/mcp-approve <server-id>
```

## Examples

```
/mcp-approve postgresql         # Approve PostgreSQL client
/mcp-approve neo4j              # Approve Neo4j Cypher executor
/mcp-approve github             # Approve GitHub integration
```

## How It Works

1. Validates server exists in pending list
2. Logs `MCP_APPROVED` event to PostgreSQL
3. Moves server to approved section in registry
4. Shows next step: load with `/mcp-load`

## Prerequisites

- Brooks (orchestrator) approval required
- Server must be in pending list
- All environment variables must be documented

## Result

```json
{
  "event": "MCP_APPROVED",
  "server_id": "postgresql",
  "approved_by": "brooks",
  "next_step": "/mcp-load postgresql"
}
```

**Note:** Approval is permanent (logged to audit trail). Use only for vetted servers.
