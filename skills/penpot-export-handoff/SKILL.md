---
name: penpot-export-handoff
description: Export Penpot deliverables, assemble manifest, generate Payload CMS JSON, run QA report. Final phase gate before delivery.
trigger: penpot export, penpot handoff, penpot qa, penpot payload, penpot manifest, penpot delivery
agents: [munari]
tools: [MCP_DOCKER_mcp-exec, allura-brain_memory_search, MCP_DOCKER_insert_data, MCP_DOCKER_execute_sql]
retryPolicy: 3x exponential backoff (2s, 4s, 8s)
fallback: log TASK_FAILED, generate partial manifest
timeout: 180000ms
---

# penpot-export-handoff — Export, Manifest & QA

## Purpose
Export all Penpot pages as PNG/SVG, assemble final manifest, generate Payload CMS JSON, and produce QA report.

## Prerequisites (STRICT)
- `penpot-implement-mockups` MUST have completed
- All prior phases logged in PostgreSQL
- `penpot-use` MUST return healthy

## Guard Implementation
```javascript
// 1. Verify prior phases complete
const events = await MCP_DOCKER_execute_sql({
  sql_query: `SELECT event_type, status FROM events WHERE group_id = 'allura-team-durham' AND agent_id IN ('glaser', 'rand') AND status = 'completed' AND metadata->>'client' = '${client}' ORDER BY created_at DESC LIMIT 10`
});

const hasFoundations = events.some(e => e.event_type === 'BRAND_INTERFACE_DEFINED');
const hasMockups = events.some(e => e.event_type === 'DESIGN_DECISION' && e.metadata?.mockups);

if (!hasFoundations || !hasMockups) {
  await MCP_DOCKER_insert_data({
    table_name: "events",
    columns: "event_type, group_id, agent_id, status, metadata",
    values: `'BLOCKED', 'allura-team-durham', 'munari', 'blocked', '{"skill": "penpot-export-handoff", "reason": "Prior phases incomplete", "hasFoundations": ${hasFoundations}, "hasMockups": ${hasMockups}, "client": "${client}"}'`
  });
  throw new Error("Prior phases incomplete. Complete Glaser Phase 3 and Rand Phase 4 first.");
}
```

## Export Workflow
```javascript
const exports = [];
const pages = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];

for (const pageId of pages) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const png = await MCP_DOCKER_mcp-exec({
        name: "penpot-full",
        arguments: { tool: "export_page", file_id: fileKey, page_id: pageId, format: "png" }
      });
      const svg = await MCP_DOCKER_mcp-exec({
        name: "penpot-full",
        arguments: { tool: "export_page", file_id: fileKey, page_id: pageId, format: "svg" }
      });
      exports.push({ pageId, png: png.url, svg: svg.url });
      break;
    } catch (err) {
      if (attempt === 3) {
        await MCP_DOCKER_insert_data({
          table_name: "events",
          columns: "event_type, group_id, agent_id, status, metadata",
          values: `'TASK_FAILED', 'allura-team-durham', 'munari', 'failed', '{"skill": "penpot-export-handoff", "error": "${err.message}", "page": "${pageId}"}'`
        });
        exports.push({ pageId, png: null, svg: null, error: err.message });
      }
      await sleep(2000 * attempt);
    }
  }
}
```

## Manifest Assembly
```javascript
const manifest = {
  version: "1.0.0",
  client: client,
  file_key: fileKey,
  exportedAt: new Date().toISOString(),
  pages: exports,
  designTokens: await getTokensFromPage01(fileKey),
  mediaAssets: await getAssetsFromManifest(client),
  qaScore: null // filled after QA
};

fs.writeFileSync(
  `clients/${client}/delivery/PENPOT-MANIFEST.json`,
  JSON.stringify(manifest, null, 2)
);
```

## Payload CMS JSON Generation
```javascript
const payload = {
  collections: [
    { name: "BrandColors", fields: manifest.designTokens.colors },
    { name: "Typography", fields: manifest.designTokens.typography },
    { name: "MediaAssets", fields: manifest.mediaAssets }
  ],
  globals: {
    designSystem: {
      file_key: manifest.file_key,
      version: manifest.version
    }
  }
};

fs.writeFileSync(
  `clients/${client}/delivery/payload-cms.json`,
  JSON.stringify(payload, null, 2)
);
```

## QA Report
```javascript
const qa = {
  timestamp: new Date().toISOString(),
  checks: [
    { name: "All pages exported", pass: exports.every(e => e.png && e.svg) },
    { name: "Tokens bound", pass: manifest.designTokens?.colors?.length > 0 },
    { name: "Assets referenced", pass: manifest.mediaAssets?.length > 0 },
    { name: "Manifest valid", pass: validateManifest(manifest) },
    { name: "Payload CMS JSON valid", pass: validatePayload(payload) }
  ]
};

qa.score = Math.round((qa.checks.filter(c => c.pass).length / qa.checks.length) * 100);
manifest.qaScore = qa.score;
```

## Phase Gate (85%)
```javascript
if (qa.score < 85) {
  await MCP_DOCKER_insert_data({
    table_name: "events",
    columns: "event_type, group_id, agent_id, status, metadata",
    values: `'BLOCKED', 'allura-team-durham', 'munari', 'blocked', '{"skill": "penpot-export-handoff", "reason": "QA score below 85%", "score": ${qa.score}, "client": "${client}"}'`
  });
  throw new Error(`QA score ${qa.score}% below 85% gate. Fix issues and re-run.`);
}
```

## Logging
```javascript
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `'TASK_COMPLETE', 'allura-team-durham', 'munari', 'completed', '{"skill": "penpot-export-handoff", "qa_score": ${qa.score}, "exports": ${exports.length}, "client": "${client}"}'`
});
```

## Error Handling

| Failure | Retry | Fallback |
|---------|-------|----------|
| Export timeout | 3x | Skip page, continue with others |
| Manifest write fail | No retry | Log TASK_FAILED, abort |
| QA score < 85% | No retry | Log BLOCKED, abort |
| Payload JSON invalid | No retry | Log TASK_FAILED, abort |

## Output
Returns `{ qaScore: number, exports: [], manifestPath: string, payloadPath: string, logged: boolean }`
