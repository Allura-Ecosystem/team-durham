---
description: "Discover available MCP servers in the catalog."
---

# /mcp-discover

Discover available MCP servers in the catalog.

## Usage

```
/mcp-discover [keyword]
```

## Examples

```
/mcp-discover                  # List all available servers
/mcp-discover database         # Filter for database-related servers
/mcp-discover search           # Filter for search-related servers
```

## How It Works

1. Uses `MCP_DOCKER_mcp-find` to search the catalog
2. Returns available servers with their tool counts
3. Shows how to load approved servers with `mcp-add`

## Result

Returns JSON with:
- Available servers and their tool descriptions
- Instructions for adding servers with `mcp-add`

**Note:** Use `/mcp-approve` before loading new servers.