---
name: penpot-use
description: Read-only Penpot reconnaissance — health checks, file inspection, layer audit. Must run before any write operation.
trigger: penpot health, penpot status, penpot inspect, penpot check, penpot recon
agents: [glaser, rand, munari, kotler, scout]
tools: [MCP_DOCKER_mcp-exec, allura-brain_memory_search, MCP_DOCKER_insert_data]
retryPolicy: 3x exponential backoff (2s, 4s, 8s)
fallback: log BLOCKED event to PostgreSQL, return error
timeout: 30000ms
---

# penpot-use — Read-Only Penpot Foundation

## Purpose
Inspect Penpot state before any write. All other penpot-* skills MUST call this first.

## Prerequisites
- Penpot MCP server reachable (port 4401 or 8787)
- `client` name known (for manifest path resolution)

## Workflow

### 1. Health Check (with retry)
```javascript
// Retry 3x with exponential backoff
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const health = await MCP_DOCKER_mcp-exec({
      name: "penpot-full",
      arguments: { tool: "health_check" }
    });
    if (health.status === "ok") break;
  } catch (err) {
    if (attempt === 3) {
      // Log BLOCKED to Allura Brain
      await MCP_DOCKER_insert_data({
        table_name: "events",
        columns: "event_type, group_id, agent_id, status, metadata",
        values: `'BLOCKED', 'allura-team-durham', 'glaser', 'failed', '{"skill": "penpot-use", "error": "${err.message}", "server": "penpot-full"}'`
      });
      throw new Error("Penpot MCP unreachable after 3 retries. Logged BLOCKED to Brain.");
    }
    await sleep(2000 * attempt);
  }
}
```

### 2. File Discovery
```javascript
const files = await MCP_DOCKER_mcp-exec({
  name: "penpot-full",
  arguments: { tool: "list_files", project_id: "team-durham" }
});
```

### 3. Layer Inspection
```javascript
const layers = await MCP_DOCKER_mcp-exec({
  name: "penpot-full",
  arguments: { tool: "get_layers", file_id: "abc123", page_id: "01" }
});
```

### 4. Log Recon Event
```javascript
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `'AGENT_INVOKED', 'allura-team-durham', 'glaser', 'completed', '{"skill": "penpot-use", "files_found": ${files.length}, "client": "faith-meats"}'`
});
```

## Error Handling

| Failure | Retry | Fallback |
|---------|-------|----------|
| MCP unreachable | 3x, 2s backoff | Log BLOCKED, abort |
| File not found | No retry | Log TASK_FAILED, return null |
| Layer parse error | No retry | Log TASK_FAILED, return partial |

## Output
Returns `{ healthy: boolean, files: [], layers: [], logged: boolean }`
