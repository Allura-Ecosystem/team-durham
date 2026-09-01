---
name: penpot-upload-media
description: Upload images to Penpot with manifest-driven deduplication. Serves local assets via HTTP if needed.
trigger: penpot upload, penpot images, penpot media, penpot assets, penpot import
agents: [glaser]
tools: [MCP_DOCKER_mcp-exec, allura-brain_memory_search, MCP_DOCKER_insert_data]
retryPolicy: 3x exponential backoff (2s, 4s, 8s)
fallback: log TASK_FAILED, preserve local copies
timeout: 120000ms
---

# penpot-upload-media — Asset Upload with Deduplication

## Purpose
Upload logo marks, photography, and reference images to Penpot media library. Prevents duplicates via manifest hash tracking.

## Prerequisites
- `clients/{client}/assets/` directory exists
- `penpot-use` healthy
- `penpot-create-board` has file_key

## Deduplication Logic
```javascript
// 1. Compute SHA-256 hash of file
const hash = crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');

// 2. Check manifest for existing upload
const manifestPath = `clients/${client}/PENPOT-MANIFEST.json`;
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const existing = manifest.mediaAssets?.find(a => a.hash === hash);

if (existing) {
  // Skip upload, return existing ID
  return { uploaded: false, asset_id: existing.penpotId, dedup: true };
}
```

## Upload with Retry
```javascript
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const result = await MCP_DOCKER_mcp-exec({
      name: "penpot-full",
      arguments: {
        tool: "upload_media",
        file_id: fileKey,
        path: assetPath,
        name: path.basename(assetPath)
      }
    });
    break;
  } catch (err) {
    if (attempt === 3) {
      await MCP_DOCKER_insert_data({
        table_name: "events",
        columns: "event_type, group_id, agent_id, status, metadata",
        values: `'TASK_FAILED', 'allura-team-durham', 'glaser', 'failed', '{"skill": "penpot-upload-media", "error": "${err.message}", "asset": "${assetPath}"}'`
      });
      throw err;
    }
    await sleep(2000 * attempt);
  }
}
```

## Local HTTP Server Pattern
If Penpot cannot access local filesystem:
```bash
# Start temporary HTTP server in assets directory
python3 -m http.server 8765 --directory clients/${client}/assets/
# Upload via URL instead of path
# Kill server after upload completes
```

## Manifest Update
```javascript
manifest.mediaAssets.push({
  name: path.basename(assetPath),
  hash: hash,
  penpotId: result.id,
  uploadedAt: new Date().toISOString()
});
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
```

## Logging
```javascript
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `'TASK_COMPLETE', 'allura-team-durham', 'glaser', 'completed', '{"skill": "penpot-upload-media", "assets_uploaded": ${uploaded}, "dedup_hits": ${deduped}, "client": "${client}"}'`
});
```

## Error Handling

| Failure | Retry | Fallback |
|---------|-------|----------|
| Upload timeout (>10MB) | 2x with compression | Log TASK_FAILED, keep local |
| File not found | No retry | Log TASK_FAILED, skip |
| Duplicate detected | No retry (intentional) | Return existing ID |
| HTTP server fail | No retry | Use direct path upload |

## Output
Returns `{ uploaded: number, deduped: number, failed: number, assetIds: [], logged: boolean }`
