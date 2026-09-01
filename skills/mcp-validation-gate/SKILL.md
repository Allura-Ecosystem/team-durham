---
name: mcp-validation-gate
description: Validate MCP tool calls before dispatch and verify results after execution. Prevents hallucinated tool calls, checks server connectivity, validates response schemas, and implements retry patterns. Use at phase start to gate execution, before any MCP call to ensure availability, and after MCP calls to verify results. Logs all validation results to PostgreSQL with group_id='allura-team-durham'.
---

# MCP Validation Gate Skill v1.0

> **Purpose:** Prevent hallucinated MCP tool calls and ensure reliable execution
> **Agent:** Any Team Durham agent requiring MCP tools
> **Group ID:** `allura-team-durham`
> **Fail Mode:** Fast with clear, actionable errors

---

## Core Principle

**Never assume an MCP tool exists.** Validate before dispatch, verify after execution.

---

## When to Use This Skill

| Scenario | Action |
|----------|--------|
| Phase start | Run full validation gate before any work begins |
| Before MCP call | Check server connectivity and tool availability |
| After MCP call | Verify result structure and data integrity |
| Transient failure | Apply retry pattern with exponential backoff |
| Blocking issue | Log to PostgreSQL and halt phase with clear error |

---

## Validation Rules

### Rule 1: Server Connectivity Check

Before any MCP call, verify the server is connected:

```javascript
// Check if MCP server is available
const serverHealth = await validateMCPServer('fal-ai');
if (!serverHealth.connected) {
  throw new MCPValidationError(
    `MCP server 'fal-ai' unavailable: ${serverHealth.error}`,
    'SERVER_UNREACHABLE'
  );
}
```

### Rule 2: Tool Availability Check

Verify the specific tool exists on the server:

```javascript
// Check if specific tool is available
const toolHealth = await validateMCPTool('fal-ai', 'generate_image');
if (!toolHealth.available) {
  throw new MCPValidationError(
    `Tool 'generate_image' not found on 'fal-ai': ${toolHealth.error}`,
    'TOOL_UNAVAILABLE'
  );
}
```

### Rule 3: Result Structure Validation

After MCP call, verify result matches expected schema:

```javascript
// Validate result structure
const result = await callMCPTool('fal-ai', 'generate_image', params);
const validation = validateResultStructure(result, {
  required: ['image_url', 'seed', 'cost'],
  types: { image_url: 'string', seed: 'number', cost: 'number' }
});
if (!validation.valid) {
  throw new MCPValidationError(
    `Invalid result structure: ${validation.errors.join(', ')}`,
    'INVALID_RESULT'
  );
}
```

### Rule 4: Retry Pattern for Transient Failures

Implement exponential backoff for retryable errors:

```javascript
// Retry pattern with exponential backoff
async function callWithRetry(server, tool, params, maxRetries = 3) {
  const delays = [1000, 2000, 4000]; // 1s, 2s, 4s

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Pre-validation
      await validateMCPServer(server);
      await validateMCPTool(server, tool);

      // Execute
      const result = await executeMCPTool(server, tool, params);

      // Post-validation
      return validateResult(result);
    } catch (error) {
      if (attempt === maxRetries || !isRetryable(error)) {
        throw error;
      }
      await sleep(delays[attempt]);
    }
  }
}
```

---

## Required MCP Servers

| Server | Purpose | Critical Tools |
|--------|---------|----------------|
| `fal-ai` | Image generation | `generate_image`, `get_generation_status` |
| `figma` | Design system | `use_figma`, `get_design_context` |
| `notion` | Documentation | `create_page`, `update_page` |
| `mcp-docker` | Database/memory | `query_database`, `execute_sql` |

---

## Validation Gate Protocol

### Phase Start Gate

Run at the beginning of each pipeline phase:

```javascript
// Full validation gate
const gate = await runValidationGate({
  phase: 'phase-3-visual-direction',
  requiredServers: ['fal-ai', 'mcp-docker'],
  requiredTools: {
    'fal-ai': ['generate_image'],
    'mcp-docker': ['execute_sql', 'insert_data']
  }
});

if (!gate.passed) {
  // Log blocking event
  await logValidationFailure(gate.errors);
  throw new PhaseBlockedError(gate.summary);
}
```

### Pre-Call Validation

Before any individual MCP call:

```javascript
// Quick validation before call
const quickCheck = await quickValidate('fal-ai', 'generate_image');
if (!quickCheck.ready) {
  await logValidationFailure([quickCheck.error]);
  return { blocked: true, reason: quickCheck.error };
}
```

### Post-Call Verification

After receiving MCP result:

```javascript
// Verify result integrity
const verification = verifyResult(result, expectedSchema);
if (!verification.valid) {
  await logValidationFailure(verification.errors);
  return { success: false, errors: verification.errors };
}
```

---

## Error Types

| Error Code | Meaning | Action |
|------------|---------|--------|
| `SERVER_UNREACHABLE` | MCP server not connected | Check Docker, restart server |
| `TOOL_UNAVAILABLE` | Tool not found on server | Verify tool name, check server config |
| `INVALID_PARAMS` | Parameters don't match schema | Fix parameter structure |
| `INVALID_RESULT` | Result missing required fields | Retry or escalate |
| `TIMEOUT` | Call exceeded time limit | Retry with backoff |
| `RATE_LIMITED` | Too many requests | Wait and retry |
| `AUTH_FAILED` | Authentication error | Check credentials |

---

## Logging to PostgreSQL

All validation results are logged:

```javascript
// Log validation event
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `
    'MCP_VALIDATION',
    'allura-team-durham',
    '${agentId}',
    '${status}',
    '${JSON.stringify({
      phase: phaseName,
      server: serverName,
      tool: toolName,
      passed: validationPassed,
      errors: validationErrors,
      duration_ms: duration
    })}'
  `
});
```

---

## Integration Points

### Phase Gate Integration

Each phase calls validation gate at start:

```javascript
// Phase 1: Strategy
await validatePhaseStart({
  phase: 'strategy',
  servers: ['mcp-docker'],
  tools: ['execute_sql', 'insert_data']
});

// Phase 3: Visual Direction
await validatePhaseStart({
  phase: 'visual-direction',
  servers: ['fal-ai', 'mcp-docker'],
  tools: {
    'fal-ai': ['generate_image'],
    'mcp-docker': ['execute_sql', 'insert_data']
  }
});
```

### Agent Integration

Agents call validation before MCP-dependent tasks:

```javascript
// Glaser (Visual Director) before image generation
await validateBeforeCall('fal-ai', 'generate_image');

// Rand (Brand Kit Builder) before Notion sync
await validateBeforeCall('notion', 'create_page');
```

---

## Validator Script

Use the bundled validator script for standalone checks:

```bash
# Validate all required MCP servers
node .claude/skills/mcp-validation-gate/validate-mcp.js

# Validate specific server
node .claude/skills/mcp-validation-gate/validate-mcp.js --server fal-ai

# Validate with verbose output
node .claude/skills/mcp-validation-gate/validate-mcp.js --verbose
```

---

## Success Criteria

- [ ] All required servers connected before phase starts
- [ ] Tool availability verified before each call
- [ ] Result structure validated after each call
- [ ] Transient failures retried with exponential backoff
- [ ] All validation results logged to PostgreSQL
- [ ] Clear error messages on validation failure
- [ ] Phase blocked if critical MCP unavailable

---

## Anti-Patterns

**Don't:**
- Call MCP tools without pre-validation
- Ignore validation errors and continue
- Retry non-retryable errors (auth failures)
- Log validation failures to console only
- Assume MCP availability across sessions

**Do:**
- Validate at phase start every time
- Fail fast with actionable error messages
- Log all validation events to PostgreSQL
- Use retry patterns for transient failures
- Check tool schemas before parameter construction
