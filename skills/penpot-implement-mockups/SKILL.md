---
name: penpot-implement-mockups
description: Build application mockups on pages 04-06. Place components, bind tokens, create responsive device frames.
trigger: penpot mockups, penpot applications, penpot components, penpot business card, penpot letterhead
agents: [rand]
tools: [MCP_DOCKER_mcp-exec, allura-brain_memory_search, MCP_DOCKER_insert_data]
retryPolicy: 3x exponential backoff (2s, 4s, 8s)
fallback: log BLOCKED, preserve existing mockups
timeout: 120000ms
---

# penpot-implement-mockups — Component Placement & Mockups

## Purpose
Build brand application mockups (business card, letterhead, social banners) on Penpot pages 04-06 using locked tokens.

## Prerequisites (STRICT)
- `penpot-foundations` MUST have completed (tokens on page 01)
- `penpot-upload-media` MUST have completed (assets available)
- `penpot-use` MUST return healthy

## Guard Implementation
```javascript
// 1. Verify tokens exist
const recon = await runSkill('penpot-use', { client, file_key: fileKey });
const page01 = recon.layers.find(p => p.id === '01');
if (!page01?.tokens?.length) {
  await MCP_DOCKER_insert_data({
    table_name: "events",
    columns: "event_type, group_id, agent_id, status, metadata",
    values: `'BLOCKED', 'allura-team-durham', 'rand', 'blocked', '{"skill": "penpot-implement-mockups", "reason": "No tokens found on page 01. Run penpot-foundations first.", "client": "${client}"}'`
  });
  throw new Error("Tokens not found. Run penpot-foundations first.");
}

// 2. Verify assets exist
const manifest = JSON.parse(fs.readFileSync(`clients/${client}/PENPOT-MANIFEST.json`, 'utf8'));
if (!manifest.mediaAssets?.length) {
  throw new Error("No media assets. Run penpot-upload-media first.");
}
```

## Mockup Templates
| Page | Mockup | Components |
|------|--------|------------|
| 04 | Business Card | Logo, primary color, heading type |
| 04 | Letterhead | Logo, address block, body type |
| 05 | Social Banner (LinkedIn) | Logo, tagline, accent color |
| 05 | Social Banner (Instagram) | Logo, photography, gradient |
| 06 | Email Signature | Logo, links, mono type |
| 06 | Presentation Slide | Heading, body, color blocks |

## Token Binding
```javascript
// Bind component to token (with retry)
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    await MCP_DOCKER_mcp-exec({
      name: "penpot-full",
      arguments: {
        tool: "bind_token",
        file_id: fileKey,
        element_id: elementId,
        token_name: "color/primary"
      }
    });
    break;
  } catch (err) {
    if (attempt === 3) {
      await MCP_DOCKER_insert_data({
        table_name: "events",
        columns: "event_type, group_id, agent_id, status, metadata",
        values: `'TASK_FAILED', 'allura-team-durham', 'rand', 'failed', '{"skill": "penpot-implement-mockups", "error": "${err.message}", "element": "${elementId}"}'`
      });
      // Continue with other elements, don't abort
      break;
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
  values: `'DESIGN_DECISION', 'allura-team-durham', 'rand', 'completed', '{"mockups": ["business_card", "letterhead", "social_linkedin", "social_instagram", "email_sig", "presentation"], "token_bindings": ${bindings}, "client": "${client}"}'`
});
```

## Error Handling

| Failure | Retry | Fallback |
|---------|-------|----------|
| Component placement fail | 3x | Skip component, continue |
| Token binding fail | 3x | Leave unbound, flag in QA |
| Asset reference missing | No retry | Use placeholder rectangle |
| Page missing | No retry | Log TASK_FAILED, abort |

## Output
Returns `{ mockupsCreated: number, tokenBindings: number, unboundElements: number, logged: boolean }`
