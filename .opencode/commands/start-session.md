---
description: "Session initialization - prepare context, and use optional memory/infrastructure when configured"
allowed-tools: ["Bash", "mcp__MCP_DOCKER__mcp-find", "mcp__MCP_DOCKER__mcp-config-set", "mcp__MCP_DOCKER__mcp-add", "mcp__MCP_DOCKER__notion-fetch"]
---

# Session Start Protocol

Run at the start of every session. Prepare local repo context first. If this project has optional MCP-backed memory or external infrastructure configured, discover that setup and report what is available. If not, continue with local repo context only.

## Step 1: Establish Local Context

- Confirm the active repo and working area
- Read the task or user request carefully
- Identify whether this session needs only local repo context or also optional external context

## Step 2: Discover Optional MCP and Memory Setup

Use the available MCP discovery/config tools only to determine what is configured for this project.

- Check whether relevant MCP servers are present
- Report which optional services appear available
- If a configured service looks missing or unhealthy, warn the user before continuing
- If no memory or external service is configured, say so plainly and proceed

## Step 3: Load Local Context Files When Present

If this repo uses local context files or a memory-bank convention, read the relevant files that actually exist.

Examples:

1. `memory-bank/activeContext.md` — current focus and blockers
2. `memory-bank/progress.md` — what has been done
3. `memory-bank/systemPatterns.md` — architecture decisions
4. `memory-bank/techContext.md` — tech stack details

If those files do not exist, do not invent them.

## Step 4: Hand Off Cleanly

Summarize the starting state:

- local context loaded
- optional services discovered or absent
- blockers or warnings
- recommended next action

## Never Do This

- Assume memory is mandatory for every project
- Claim memory hydration or logging happened unless the needed tools are actually available
- Proceed past a clearly broken configured dependency without warning the user
