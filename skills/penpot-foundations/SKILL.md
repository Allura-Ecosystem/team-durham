---
name: penpot-foundations
description: Inject design tokens from brand-truth.json onto Penpot page 01. Maps strategy to visual system.
trigger: penpot tokens, penpot foundations, penpot colors, penpot typography, penpot design system
agents: [glaser]
tools: [MCP_DOCKER_mcp-exec, allura-brain_memory_search, MCP_DOCKER_insert_data]
retryPolicy: 3x exponential backoff (2s, 4s, 8s)
fallback: log BLOCKED event, preserve existing tokens
timeout: 60000ms
---

# penpot-foundations — Design Token Injection

## Purpose
Read `brand-truth.json` and create color swatches, type specimens, and spacing scales on Penpot page 01.

## Prerequisites (STRICT)
- `clients/{client}/brand-truth.json` MUST exist
- `penpot-create-board` MUST have run (file_key required)
- `penpot-use` MUST return healthy

## Guard Implementation
```javascript
// 1. Verify brand-truth.json
const truthPath = `clients/${client}/brand-truth.json`;
if (!fs.existsSync(truthPath)) {
  await MCP_DOCKER_insert_data({
    table_name: "events",
    columns: "event_type, group_id, agent_id, status, metadata",
    values: `'BLOCKED', 'allura-team-durham', 'glaser', 'blocked', '{"skill": "penpot-foundations", "reason": "brand-truth.json missing", "client": "${client}"}'`
  });
  throw new Error("STP not locked. brand-truth.json required.");
}

// 2. Read and validate
const truth = JSON.parse(fs.readFileSync(truthPath, 'utf8'));
if (!truth.colors?.primary || !truth.typography?.heading) {
  throw new Error("brand-truth.json incomplete: missing colors.primary or typography.heading");
}
```

## Token Mapping
```javascript
// From brand-truth.json → Penpot elements
const tokens = {
  colors: {
    primary: truth.colors.primary,      // #FF6B35
    secondary: truth.colors.secondary, // #2EC4B6
    neutral: truth.colors.neutral,     // #1A1A1A
    accent: truth.colors.accent        // #FFD166
  },
  typography: {
    heading: truth.typography.heading,   // "Inter Bold 48px"
    body: truth.typography.body,         // "Inter Regular 16px"
    mono: truth.typography.mono          // "JetBrains Mono 14px"
  },
  spacing: {
    base: truth.spacing.base,            // 8px
    scale: truth.spacing.scale           // [8, 16, 24, 32, 48, 64]
  }
};
```

## Penpot Write (with retry)
```javascript
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await MCP_DOCKER_mcp-exec({
      name: "penpot-full",
      arguments: {
        tool: "create_color",
        file_id: fileKey,
        page_id: "01",
        name: "color/primary",
        hex: tokens.colors.primary
      }
    });
    break;
  } catch (err) {
    if (attempt === 3) {
      await MCP_DOCKER_insert_data({
        table_name: "events",
        columns: "event_type, group_id, agent_id, status, metadata",
        values: `'TASK_FAILED', 'allura-team-durham', 'glaser', 'failed', '{"skill": "penpot-foundations", "error": "${err.message}", "token": "color/primary"}'`
      });
      throw err;
    }
    await sleep(2000 * attempt);
  }
}
```

## Logging
```javascript
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `'BRAND_INTERFACE_DEFINED', 'allura-team-durham', 'glaser', 'completed', '{"tokens": ${JSON.stringify(tokens)}, "file_key": "${fileKey}", "client": "${client}"}'`
});
```

## Error Handling

| Failure | Retry | Fallback |
|---------|-------|----------|
| Color write timeout | 3x | Skip color, continue with typography |
| Page 01 missing | No retry | Log TASK_FAILED, abort |
| Invalid hex value | No retry | Log TASK_FAILED, skip token |

## Output
Returns `{ tokensInjected: number, file_key: string, page_id: "01", logged: boolean }`
