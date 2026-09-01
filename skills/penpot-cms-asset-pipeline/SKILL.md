---
name: penpot-cms-asset-pipeline
description: "Prepare Penpot brand assets for Payload CMS delivery."
trigger: penpot assets, cms pipeline, image optimization, responsive variants, payload cms media, brand asset pipeline, webp conversion, image metadata
agents: [rand]
tools: [MCP_DOCKER_mcp-exec, MCP_DOCKER_insert_data, MCP_DOCKER_execute_sql, fs, sharp, crypto]
retryPolicy: 3x exponential backoff (2s, 4s, 8s) for Penpot uploads; 1x for sharp processing
fallback: Log BLOCKED or TASK_FAILED to PostgreSQL; preserve local copies
prerequisites:
  - file: "clients/{client}/brand-truth.json"
    source: "Aaker Phase 1 output"
    gate: "Kotler approval required"
  - file: "clients/{client}/assets/"
    source: "Raw brand images or penpot-upload-media output"
    gate: "Directory must exist with read permissions"
timeout: 300000ms
---

# Penpot CMS Asset Pipeline

> **Purpose:** Transform raw brand images into production-ready, CMS-compatible asset packages.
>
> **Agent:** Rand (Brand Kit Builder) — owns deliverable packaging.
>
> **Prerequisites:** `penpot-upload-media` completed or `clients/{client}/assets/` populated with raw images.

## Pipeline Overview

```
Raw Images → Preprocess → Optimize → Variants → Metadata → Penpot Upload → CMS JSON
```

This skill closes the gap between Penpot asset management and Payload CMS ingestion. It does not replace `penpot-upload-media` — it **feeds** it with optimized assets and **extends** the output with CMS-ready metadata.

## When to Use

- Preparing logo packs, mockups, or brand imagery for Penpot ingestion
- Generating responsive image variants (1x/2x/3x, WebP/AVIF fallbacks)
- Building a `payload-cms.json` with populated `MediaAssets` collection
- Ensuring all brand images meet web performance standards before delivery
- Post-`penpot-export-handoff`: converting exported PNGs/SVGs into CMS-compatible formats

## When NOT to Use

- AI image generation (use `fal-ideogram-executor` or `falai-runner`)
- Direct CMS API upload (no Payload CMS MCP server registered yet)
- Image editing or creative manipulation (use design tools)

## Input Contract

| Source | Path Pattern | Expected Contents |
|--------|-----------|-------------------|
| Raw assets | `clients/{client}/assets/*.{png,jpg,jpeg,webp,svg}` | Unoptimized brand images |
| Penpot exports | `clients/{client}/delivery/penpot-exports/*` | PNG/SVG from `penpot-export-handoff` |
| Brand truth | `clients/{client}/brand-truth.json` | Color tokens for dominant-color extraction |

## Output Contract

| Artifact | Path | Format |
|----------|------|--------|
| Optimized images | `clients/{client}/assets/optimized/` | WebP primary + PNG fallback |
| Responsive variants | `clients/{client}/assets/variants/` | 400w, 800w, 1200w, 1600w |
| Asset manifest | `clients/{client}/delivery/ASSET-MANIFEST.json` | Metadata + variant map |
| Payload CMS schema | `clients/{client}/delivery/payload-cms.json` | Populated MediaAssets collection |
| Penpot upload log | `clients/{client}/delivery/penpot-upload-log.json` | Asset ID mappings |

## Phase 0: MCP Validation Gate (Pre-Flight)

Before any work begins, validate MCP availability per `mcp-validation-gate` skill:

```javascript
// 1. Validate penpot-full MCP server connectivity
const serverHealth = await validateMCPServer('penpot-full');
if (!serverHealth.connected) {
  throw new MCPValidationError(
    `MCP server 'penpot-full' unavailable: ${serverHealth.error}`,
    'SERVER_UNREACHABLE'
  );
}

// 2. Validate upload_media tool exists
const toolHealth = await validateMCPTool('penpot-full', 'upload_media');
if (!toolHealth.available) {
  throw new MCPValidationError(
    `Tool 'upload_media' not found on 'penpot-full': ${toolHealth.error}`,
    'TOOL_UNAVAILABLE'
  );
}

// 3. Validate sharp dependency
const sharp = require('sharp');
const sharpVersion = sharp.version;
console.log(`sharp v${sharpVersion} available`);
```

**Failure:** Log `BLOCKED` to PostgreSQL and abort immediately.

## Phase 1: Ingest & Validate

1. **Discover** all images in `clients/{client}/assets/`
2. **Validate** formats: accept `png`, `jpg`, `jpeg`, `webp`, `svg`. Reject others with warning.
3. **Check** prerequisites:
   - `sharp` and `canvas` available (from root `package.json`)
   - `clients/{client}/` directory exists
   - Write permissions on `assets/optimized/` and `assets/variants/`
4. **Log** `AGENT_INVOKED` event to PostgreSQL with `group_id='allura-team-durham'`

```javascript
await MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: `'AGENT_INVOKED', 'allura-team-durham', 'rand', 'started', '{"skill": "penpot-cms-asset-pipeline", "client": "${client}", "phase": "ingest"}'`
});
```

## Phase 2: Preprocess & Optimize

For each valid image, run `sharp` pipeline with error recovery:

```javascript
async function optimizeImage(inputPath, outputPath) {
  try {
    const optimize = sharp(inputPath)
      .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .withMetadata({ exif: { IFD0: { Copyright: 'Allura Brand Systems' } } });

    await optimize.toFile(outputPath);

    // Verify output exists and is valid
    const stats = fs.statSync(outputPath);
    if (stats.size === 0) throw new Error('Output file is empty');

    return { success: true, size: stats.size };
  } catch (err) {
    // Log per-file failure but continue with others
    await MCP_DOCKER_insert_data({
      table_name: "events",
      columns: "event_type, group_id, agent_id, status, metadata",
      values: `'TASK_FAILED', 'allura-team-durham', 'rand', 'failed', '{"skill": "penpot-cms-asset-pipeline", "phase": "optimize", "file": "${path.basename(inputPath)}", "error": "${err.message}"}'`
    });
    return { success: false, error: err.message };
  }
}
```

**Rules:**
- Max dimension: 2048px (prevents oversized uploads)
- Quality: 85 (balance of size and fidelity)
- Strip GPS and sensitive EXIF, preserve copyright
- SVGs: pass through unchanged but validate XML well-formedness
- **Per-file error isolation:** One bad file does not abort the entire pipeline

## Phase 3: Responsive Variant Generation

Generate 4 width breakpoints for every raster image:

| Variant | Width | Use Case |
|---------|-------|----------|
| `xs` | 400w | Mobile thumbnails |
| `sm` | 800w | Tablet, small cards |
| `md` | 1200w | Desktop standard |
| `lg` | 1600w | Hero, full-bleed |

**Format strategy:**
- Primary: WebP (`image/webp`)
- Fallback: Original format (PNG for transparency, JPEG for photos)
- Skip variant generation for SVG (vector is resolution-independent)

**Naming convention:**
```
{original-name}-{variant}.{ext}
// e.g., logo-primary-md.webp, logo-primary-md.png
```

## Phase 4: Metadata Extraction

For each processed asset, extract and record:

| Field | Source | Example |
|-------|--------|---------|
| `id` | SHA-256 of file content | `a1b2c3...` |
| `filename` | Base name | `logo-primary` |
| `originalFormat` | Input extension | `png` |
| `optimizedFormat` | Output extension | `webp` |
| `dimensions` | `sharp` metadata | `{ width: 1200, height: 800 }` |
| `aspectRatio` | Calculated | `1.5` |
| `fileSize` | FS stat | `{ original: 245000, optimized: 89000 }` |
| `dominantColor` | `sharp` stats | `#1a1a1a` |
| `altText` | Placeholder rule (see below) | `Allura brand logo mark` |
| `tags` | Derived from path/filename | `["logo", "primary", "brand-mark"]` |
| `penpotAssetId` | Post-upload | `uuid-from-penpot` |
| `variants` | Array of variant objects | `[{ width: 400, url: "...", size: 12000 }]` |

### Alt-Text Placeholder Rules

Derive alt-text from filename and brand-truth context:

```
{brand-name} {asset-type} {variant-purpose}
// e.g., "Allura primary logo mark for light backgrounds"
```

If `brand-truth.json` contains `brand.name`, prepend it. If not, use generic descriptor.

**Note:** This skill generates *placeholder* alt-text. Final alt-text should be reviewed by Ogilvy (Copywriter) for voice alignment.

## Phase 5: Penpot Upload (with Idempotency)

1. **Read** `penpot-upload-log.json` if exists (idempotency — skip already-uploaded)
2. **Validate** MCP server before each upload call (per `mcp-validation-gate`)
3. **Upload** optimized primary image (not variants) to Penpot via `upload_media`
4. **Record** Penpot asset ID in manifest
5. **Retry** on failure: 3 attempts with exponential backoff (2s, 4s, 8s)
6. **Fallback:** If Penpot unavailable, preserve local optimized copies and flag `BLOCKED` in events table

```javascript
async function uploadToPenpot(filePath, fileKey, client) {
  const logPath = `clients/${client}/delivery/penpot-upload-log.json`;
  let uploadLog = {};

  if (fs.existsSync(logPath)) {
    uploadLog = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  }

  const fileHash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

  // Idempotency check
  if (uploadLog[fileHash]) {
    console.log(`Skipping ${path.basename(filePath)} — already uploaded (ID: ${uploadLog[fileHash].penpotId})`);
    return { skipped: true, penpotId: uploadLog[fileHash].penpotId };
  }

  // MCP validation before upload
  await validateMCPServer('penpot-full');
  await validateMCPTool('penpot-full', 'upload_media');

  // Upload with retry
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await MCP_DOCKER_mcp-exec({
        name: "penpot-full",
        arguments: {
          tool: "upload_media",
          file_id: fileKey,
          path: filePath,
          name: path.basename(filePath)
        }
      });

      // Record in log
      uploadLog[fileHash] = {
        penpotId: result.id,
        filename: path.basename(filePath),
        uploadedAt: new Date().toISOString()
      };
      fs.writeFileSync(logPath, JSON.stringify(uploadLog, null, 2));

      return { success: true, penpotId: result.id };
    } catch (err) {
      if (attempt === 3) {
        await MCP_DOCKER_insert_data({
          table_name: "events",
          columns: "event_type, group_id, agent_id, status, metadata",
          values: `'BLOCKED', 'allura-team-durham', 'rand', 'blocked', '{"skill": "penpot-cms-asset-pipeline", "phase": "upload", "file": "${path.basename(filePath)}", "error": "${err.message}"}'`
        });
        return { success: false, error: err.message };
      }
      await sleep(2000 * attempt);
    }
  }
}
```

## Phase 6: Payload CMS JSON Assembly

Populate the `MediaAssets` collection in `payload-cms.json`:

```json
{
  "collections": [
    {
      "name": "MediaAssets",
      "fields": [
        { "name": "id", "type": "text", "required": true },
        { "name": "filename", "type": "text", "required": true },
        { "name": "altText", "type": "text" },
        { "name": "tags", "type": "array", "of": "text" },
        { "name": "dimensions", "type": "group", "fields": [
          { "name": "width", "type": "number" },
          { "name": "height", "type": "number" },
          { "name": "aspectRatio", "type": "number" }
        ]},
        { "name": "dominantColor", "type": "text" },
        { "name": "variants", "type": "array", "of": "group", "fields": [
          { "name": "width", "type": "number" },
          { "name": "format", "type": "text" },
          { "name": "url", "type": "text" },
          { "name": "fileSize", "type": "number" }
        ]},
        { "name": "penpotAssetId", "type": "text" },
        { "name": "sourceFile", "type": "text" }
      ],
      "docs": []
    }
  ],
  "globals": {
    "designSystem": {
      "assetManifestVersion": "1.0.0",
      "generatedAt": "ISO-8601-timestamp",
      "totalAssets": 0,
      "totalVariants": 0
    }
  }
}
```

Each asset from Phase 4 becomes one document in `collections[0].docs`.

## Phase 7: QA Validation

Run validation checks before marking complete:

| Check | Assertion | Failure Action |
|-------|-----------|----------------|
| All inputs processed | `processedCount === inputCount` | Log `TASK_FAILED`, report missing |
| Variants generated | `variantCount === inputCount * 4` (rasters only) | Log `LESSON_LEARNED` |
| WebP size reduction | `optimizedSize < originalSize * 0.9` | Flag warning, do not block |
| JSON schema valid | `payload-cms.json` parses, has `MediaAssets.docs` | Log `TASK_FAILED` |
| Penpot IDs recorded | All uploaded assets have `penpotAssetId` | Log `BLOCKED` if Penpot down |

## Error Handling Matrix

| Scenario | Retry | Fallback | Event Logged |
|----------|-------|----------|--------------|
| `sharp` processing error | 1x | Skip file, continue | `TASK_FAILED` per file |
| Penpot upload timeout | 3x (exp backoff) | Local copy preserved, `penpotAssetId: null` | `BLOCKED` |
| Disk write failure | 1x | In-memory buffer, warn user | `TASK_FAILED` |
| Invalid input format | None | Skip file, log warning | `LESSON_LEARNED` |
| Missing `brand-truth.json` | None | Generic alt-text | `LESSON_LEARNED` |

## Tool Invocation Reference

| Step | Tool | Arguments |
|------|------|-----------|
| Discover | `fs.readdirSync` or `glob` | `clients/{client}/assets/*` |
| Optimize | `sharp` pipeline | `resize`, `webp`, `withMetadata` |
| Extract color | `sharp(stats).dominant` | `{ format: 'hex' }` |
| Upload | `MCP_DOCKER_mcp-exec` | `{ server: 'penpot', tool: 'upload_media', args: { file_key, url } }` |
| Log event | `MCP_DOCKER_insert_data` | `table_name: 'events', columns: '...'` |

## Example: Full Pipeline Run

**Input:**
```
clients/acme-corp/assets/
├── logo-primary.png
├── hero-photo.jpg
└── icon-set.svg
```

**Output:**
```
clients/acme-corp/assets/optimized/
├── logo-primary.webp
├── hero-photo.webp
└── icon-set.svg

clients/acme-corp/assets/variants/
├── logo-primary-xs.webp / .png
├── logo-primary-sm.webp / .png
├── logo-primary-md.webp / .png
├── logo-primary-lg.webp / .png
├── hero-photo-xs.webp / .jpg
├── hero-photo-sm.webp / .jpg
├── hero-photo-md.webp / .jpg
└── hero-photo-lg.webp / .jpg

clients/acme-corp/delivery/
├── ASSET-MANIFEST.json
├── payload-cms.json
└── penpot-upload-log.json
```

## Integration with Team Durham Pipeline

| Phase | Skill | Handoff |
|-------|-------|---------|
| 3 Visual Direction | `penpot-upload-media` | Raw images → Penpot |
| **3.5 Asset Pipeline** | **This skill** | Optimizes and catalogs |
| 4 Brand Kit | `penpot-export-handoff` | Exports from Penpot |
| 4 Brand Kit | **This skill (re-run)** | Processes exported PNGs/SVGs into CMS JSON |
| 5 QA | `brand-consistency-review` | Validates asset completeness |

## MCP Validation Gate Integration

This skill **requires** `mcp-validation-gate` as a dependency. Before any Penpot upload:

1. **Pre-flight:** Validate `penpot-full` server connectivity
2. **Pre-call:** Validate `upload_media` tool availability
3. **Post-call:** Verify result structure (must contain `id` field)
4. **Retry:** Apply exponential backoff only after validation passes

**Failure mode:** If validation fails, log `BLOCKED` and abort — do not retry a broken server.

## Allura Brain Logging

Every phase logs to PostgreSQL `events` table:

| Phase | Event Type | Metadata |
|-------|-----------|----------|
| 0 (MCP validation) | `BLOCKED` (if fail) or `AGENT_INVOKED` | server status, tool availability |
| 1 (Ingest) | `AGENT_INVOKED` | file count, formats found |
| 2 (Optimize) | `TASK_FAILED` per file (if any) | filename, error message |
| 5 (Upload) | `BLOCKED` (if Penpot down) or `TASK_COMPLETE` | penpot IDs, dedup count |
| 7 (QA) | `TASK_COMPLETE` or `TASK_FAILED` | qa score, asset count, variant count |

**Semantic graph promotion:** Only Kotler promotes asset metadata to the semantic knowledge graph after Phase 5 QA pass.

## Reflection Protocol

After every run, emit:

```
📝 Reflection
├─ Action Taken: Processed {n} assets, generated {m} variants
├─ Principle Applied: Asset-first design — measure before building
├─ Event Logged: TASK_COMPLETE or TASK_FAILED to Postgres
├─ Semantic Graph Promoted: No (episodic only unless pattern emerges)
└─ Confidence: High / Medium / Low
```

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-06 | Initial skill creation |
