---
description: "Discover available MCP servers in the Allura registry"
argument-hint: "[keyword]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# /mcp-discover

Discover available MCP servers in the Allura registry.

## Usage

```
/mcp-discover [keyword]
```

## Examples

```
/mcp-discover                  # List all approved + pending servers
/mcp-discover database         # Filter for database-related servers
/mcp-discover search           # Filter for search-related servers
```

## How It Works

1. Harness reads `mcp-registry.yaml`
2. Returns approved servers (ready to load) + pending servers (need approval)
3. Shows next steps: approve pending servers or load approved ones

## Result

Returns JSON with:
- `approved`: Ready-to-load servers
- `pending`: Servers awaiting Brooks approval
- `nextSteps`: Recommended actions

**Note:** Only Brooks can approve pending servers via `/mcp-approve`.
