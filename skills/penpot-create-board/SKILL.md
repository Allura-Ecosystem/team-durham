---
name: penpot-create-board
description: Create 9-page Penpot skeleton idempotently. Safe to re-run — checks existence first.
trigger: penpot create board, penpot new file, penpot scaffold, penpot setup pages
agents: [glaser]
tools: [MCP_DOCKER_mcp-exec, allura-brain_memory_search, MCP_DOCKER_insert_data]
retryPolicy: 3x exponential backoff (2s, 4s, 8s)
fallback: log BLOCKED event, alert Kotler
timeout: 60000ms
---

# penpot-create-board — 9-Page Skeleton Creation

## Purpose
Scaffold a new Penpot file with 9 canonical pages for Team Durham brand work.

## Prerequisites (STRICT)
- `clients/{client}/brand-truth.json` MUST exist (Aaker Phase 1 output)
- Kotler approval REQUIRED
- `penpot-use` MUST run first and return `healthy: true`

## Guard Implementation
```javascript
// 1. Check brand-truth.json exists
const fs = require('fs');
const truthPath = `clients/${client}/brand-truth.json`;
if (!fs.existsSync(truthPath)) {
  await MCP_DOCKER_insert_data({
    table_name: "events",
    columns: "event_type, group_id, agent_id, status, metadata",
    values: `'BLOCKED', 'allura-team-durham', 'glaser', 'blocked', '{"skill": "penpot-create-board", "reason": "brand-truth.json missing", "client": "${client}"}'`
  });
  throw new Error("STP not locked. Run Aaker Phase 1 first. Event logged to Brain.");
}

// 2. Run penpot-use recon
const recon = await runSkill('penpot-use', { client });
if (!recon.healthy) {
  throw new Error("Penpot health check failed. See BLOCKED event in Brain.");
}
```

## Page Structure
| Page | Name | Purpose |
|------|------|---------|
| 01 | Foundations | Colors, typography, spacing tokens |
| 02 | Logo | Logo marks, clearspace, variants |
| 03 | Color | Full palette, gradients, usage rules |
| 04 | Typography | Type scale, pairings, specimens |
| 05 | Iconography | Icon set, grid, construction |
| 06 | Applications | Mockups: business card, letterhead, social |
| 07 | Photography | Image style, treatments, examples |
| 08 | Motion | Animation principles, examples |
| 09 | Guidelines | Usage do's/don'ts, voice + tone |

## Idempotency
```javascript
// Check if file already exists
const existing = await MCP_DOCKER_mcp-exec({
  name: "penpot-full",
  arguments: { tool: "get_file", name: `${client}-brand-system` }
});

if (existing) {
  // Return existing file_key, don't recreate
  return { file_key: existing.id, created: false, pages: existing.pages };
}

// Create new file
const file = await MCP_DOCKER_mcp-exec({
  name: "penpot-full",
  arguments: { tool: "create_file", name: `${client}-brand-system`, pages: 9 }
});
```

## Logging
```javascript
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `'DESIGN_DECISION', 'allura-team-durham', 'glaser', 'completed', '{"decision": "9_page_skeleton", "file_key": "${file.id}", "client": "${client}", "pages": ["01", "02", "03", "04", "05", "06", "07", "08", "09"]}'`
});
```

## Error Handling

| Failure | Retry | Fallback |
|---------|-------|----------|
| File creation timeout | 2x | Log TASK_FAILED, return partial |
| Page creation fails | No retry | Log TASK_FAILED, file may be incomplete |
| Name collision | No retry (idempotent) | Return existing file_key |

## Output
Returns `{ file_key: string, created: boolean, pages: string[], logged: boolean }`
