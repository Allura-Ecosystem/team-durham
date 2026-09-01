---
description: "Show the harness health, loaded servers, and available skills"
argument-hint: ""
allowed-tools:
  - Read
  - Grep
  - Glob
---

# /harness-status

Show the harness health, loaded servers, and available skills.

## Usage

```bash
/harness-status
```

## How It Works

1. Checks harness configuration
2. Lists loaded MCP servers (from settings.json)
3. Shows available skills with preferred executors
4. Displays recent events (when memory logging is enabled)
5. Reports any errors or pending approvals

## Result

```json
{
  "harness": {
    "group_id": "<group_id>",
    "agent_id": "<agent_id>",
    "postgres_available": true
  },
  "loaded_servers": ["<server-name>", "perplexica", "context7"],
  "approved_pending": ["<pending-server>"],
  "available_skills": [
    {"name": "code-review", "executor": "pike"},
    {"name": "postgres-optimization", "executor": "knuth"}
  ],
  "recent_events": 12
}
```

**Note:** Values depend on project configuration. Use this to verify the harness is healthy before running operations.
