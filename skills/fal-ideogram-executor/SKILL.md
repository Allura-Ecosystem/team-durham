---
name: fal-ideogram-executor
description: >
  Execute image generation via fal.ai Ideogram V3 API for brand visual assets. Use when
  (1) agent needs to generate logo marks, wordmarks, mockups, or application images,
  (2) user asks to 'generate images', 'run ideogram', 'create logos with AI', 'make brand visuals',
  (3) any Team Durham agent needs visual asset production beyond SVG/CSS, (4) logo directions
  need AI-rendered previews, (5) application mockups need photo-realistic rendering.
  Models: Ideogram V3 (primary), with style presets, color palettes, style codes, negative
  prompts, and custom image sizes. Includes queue submit/status/result pattern, download,
  and metadata logging.
---

# fal.ai Ideogram V3 Executor

> **Executor:** @Glaser (Visual Director) or any agent
> **Type:** Visual production (AI image generation)
> **Prerequisite:** FAL_KEY environment variable, brand strategy documents
> **group_id:** `allura-team-durham`

---

## Purpose

Generate brand visual assets using Ideogram V3 via the fal.ai API. Ideogram V3 excels at typography-in-image, logo concepts, and design-forward outputs that Flux models struggle with. Use this skill when the brand needs rendered visuals — logos with type, application mockups, social assets — not abstract pattern generation.

---

## Setup

### Install Client

```bash
npm install --save @fal-ai/client
```

The `@fal-ai/serverless-client` package is deprecated — always use `@fal-ai/client`.

### API Key

```bash
export FAL_KEY="your-api-key-here"
```

Or configure programmatically:

```javascript
import { fal } from "@fal-ai/client";
fal.config({ credentials: process.env.FAL_KEY });
```

---

## Model: `fal-ai/ideogram/v3`

### Key Capabilities

| Feature | Details |
|---------|---------|
| **Typography** | Best-in-class text rendering in images — logos, headlines, signage |
| **Style Presets** | 60+ built-in style presets (see reference file) |
| **Color Palette** | Explicit hex-based color control with weights |
| **Style Codes** | 8-char hex codes for fine style control |
| **Rendering Speed** | TURBO / BALANCED / QUALITY |
| **Image Sizes** | Preset + custom (any WxH) |
| **Negative Prompt** | Exclude unwanted elements |
| **Style Modes** | AUTO / GENERAL / REALISTIC / DESIGN |

---

## Execution Pattern

### Recommended: `fal.subscribe` (blocking)

Simplest pattern — handles submit, poll, and return in one call:

```javascript
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY });

const result = await fal.subscribe("fal-ai/ideogram/v3", {
  input: {
    prompt: "YOUR_PROMPT_HERE",
    style_preset: "MINIMAL_ILLUSTRATION",
    rendering_speed: "QUALITY",
    expand_prompt: true,
    num_images: 1,
    image_size: "square_hd",
    negative_prompt: ""
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});

console.log(result.data);        // { images: [{ url: "..." }], seed: 12345 }
console.log(result.requestId);   // For logging
```

### Alternative: Queue Pattern (long-running)

For batch generations or when you need the request ID immediately:

```javascript
// Step 1: Submit
const { request_id } = await fal.queue.submit("fal-ai/ideogram/v3", {
  input: { prompt: "...", style_preset: "..." },
  webhookUrl: "https://optional.webhook.url/for/results"
});

// Step 2: Poll status
const status = await fal.queue.status("fal-ai/ideogram/v3", {
  requestId: request_id,
  logs: true
});

// Step 3: Fetch result when COMPLETED
const result = await fal.queue.result("fal-ai/ideogram/v3", {
  requestId: request_id
});
```

---

## Input Schema

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | *required* | The image generation prompt |
| `style_preset` | enum | *none* | 60+ presets — see `references/style-presets.md` |
| `style` | enum | AUTO | AUTO / GENERAL / REALISTIC / DESIGN — cannot use with `style_codes` |
| `style_codes` | list\<string\> | *none* | 8-char hex codes for fine style — cannot use with `style` or `style_preset` |
| `rendering_speed` | enum | BALANCED | TURBO (fast) / BALANCED / QUALITY (best) |
| `image_size` | enum or object | square_hd | Preset: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9. Custom: `{ width: 1280, height: 720 }` |
| `num_images` | integer | 1 | Number of images (1-4) |
| `expand_prompt` | boolean | true | Use MagicPrompt expansion |
| `negative_prompt` | string | "" | What to exclude |
| `seed` | integer | *random* | Reproducibility seed |
| `color_palette` | object | *none* | Preset name OR explicit `{ members: [{ rgb: {r,g,b}, color_weight: 0.5 }] }` |
| `image_urls` | list\<string\> | *none* | Style reference images (max 10MB total) |
| `sync_mode` | boolean | false | Return as data URI (no request history) |

### Color Palette Presets

EMBER, FRESH, JUNGLE, MAGIC, MELON, MOSAIC, PASTEL, ULTRAMARINE

### Custom Color Palette Example

```javascript
color_palette: {
  members: [
    { rgb: { r: 212, g: 43, b: 43 }, color_weight: 0.5 },   // AMaysIn Red
    { rgb: { r: 232, g: 168, b: 56 }, color_weight: 0.3 },  // AMaysIn Amber
    { rgb: { r: 26, g: 26, b: 26 }, color_weight: 0.2 }      // Charcoal
  ]
}
```

---

## Brand-Specific Prompt Patterns

### Logo Mark Generation

```javascript
{
  prompt: `A [ARCHETYPE_STYLE] logo mark for [BRAND NAME], [SHAPE_LANGUAGE], [COLOR_DIRECTIVE], centered composition, clean vector quality, sharp edges, on pure white background. No photorealistic elements, no gradients, no shadows, no 3D effects.`,
  style_preset: "MINIMAL_ILLUSTRATION",  // or GEO_MINIMALIST, FLAT_VECTOR
  rendering_speed: "QUALITY",
  negative_prompt: "photorealistic, 3D, gradient, shadow, blur, noise, texture"
}
```

### Application Mockup

```javascript
{
  prompt: `[APPLICATION_TYPE] mockup for [BRAND NAME], featuring [BRAND_ELEMENTS], [ARCHETYPE_STYLE] brand identity, [COLOR_DIRECTIVE], professional product photography, soft directional lighting, on neutral grey background. No photorealistic people, no stock photos.`,
  style_preset: "EDITORIAL",  // or MAGAZINE_EDITORIAL
  rendering_speed: "QUALITY",
  image_size: "landscape_4_3"
}
```

### Style Preset Selection by Archetype

| Archetype | Best Presets | Avoid |
|-----------|-------------|-------|
| Lover | MINIMAL_ILLUSTRATION, EDITORIAL, GOLDEN_HOUR | DARK_AURA, HIGH_CONTRAST |
| Everyman | FLAT_VECTOR, FLAT_ART, MINIMAL_ILLUSTRATION | AVANT_GARDE, SURREAL_COLLAGE |
| Jester | BRIGHT_ART, POP_ART, RIVIERA_POP | MONOCHROME, EMOTIONAL_MINIMAL |
| Hero | HIGH_CONTRAST, DRAMATIC_CINEMA | CHILDRENS_BOOK, DOODLE |
| Sage | GEO_MINIMALIST, EDITORIAL, BLUEPRINT | GRAFFITI, WEIRD |
| Ruler | ART_DECO, ICONIC, BAUHAUS | DOODLE, COLLAGE |
| Outlaw | GRAFFITI_I, DARK_AURA, AVANT_GARDE | PASTEL, WATERCOLOR |
| Creator | MIXED_MEDIA, ART_BRUT, PAINT_GESTURE | FLAT_VECTOR, MONOCHROME |
| Explorer | TRAVEL_POSTER, FOREST_REVERIE | BLUEPRINT, CUBISM |
| Innocent | WATERCOLOR, CHILDRENS_BOOK, EMOTIONAL_MINIMAL | DARK_AURA, HIGH_CONTRAST |

Full 60+ preset list → `references/style-presets.md`

---

## Rendering Speed Selection

| Speed | Use When | Approx. Time |
|-------|---------|-------------|
| TURBO | Exploration, quick direction testing | ~10s |
| BALANCED | Direction confirmation, iteration | ~20s |
| QUALITY | Final production deliverables | ~40s |

**Rule:** Start TURBO for Round 1 (exploration), QUALITY for Round 3 (production). Never use TURBO for client-facing deliverables.

---

## Output Schema

```json
{
  "images": [
    {
      "url": "https://v3.fal.media/files/...",
      "content_type": "image/png",
      "file_name": "image.png",
      "file_size": 1234567
    }
  ],
  "seed": 123456
}
```

### Download Images

```javascript
import fs from "fs/promises";
import path from "path";

const imageUrl = result.data.images[0].url;
const response = await fetch(imageUrl);
const buffer = Buffer.from(await response.arrayBuffer());
await fs.writeFile(path.join(outputDir, `${promptId}.png`), buffer);
```

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid FAL_KEY | Verify env var is set correctly |
| 429 Rate Limit | Too many concurrent requests | Add 2-3s delay between requests |
| Content Policy | Flagged prompt terms | Rephrase; avoid violent/explicit terms |
| Timeout (>5min) | Queue backlog | Use webhook pattern instead of blocking |
| Blank/low-quality output | Wrong preset or prompt | Switch preset; add negative_prompt; use QUALITY speed |

---

## Metadata Logging

Every generation must be logged to `clients/{client-slug}/generated-images/`:

```json
{
  "id": "logo-direction-1",
  "prompt": "full prompt text...",
  "model": "fal-ai/ideogram/v3",
  "style_preset": "MINIMAL_ILLUSTRATION",
  "rendering_speed": "QUALITY",
  "request_id": "uuid",
  "image_url": "https://v3.fal.media/...",
  "seed": 123456,
  "timestamp": "2026-04-16T12:00:00Z"
}
```

---

## Additional Endpoints

Ideogram V3 supports these specialized operations:

| Endpoint | Purpose |
|----------|---------|
| `fal-ai/ideogram/v3/remix` | Remix an existing image with a new prompt + strength (0-1) |
| `fal-ai/ideogram/v3/edit` | Inpainting with mask (mask_url required, same dimensions as image_url) |
| `fal-ai/ideogram/v3/reframe` | Change aspect ratio of existing image |
| `fal-ai/ideogram/v3/replace-background` | Replace background keeping subject |
| `fal-ai/ideogram/v3/transparent` | Generate with transparent background |
| `fal-ai/ideogram/v3/character` | Character-consistent generation with reference_image_urls |
| `fal-ai/ideogram/v3/character-remix` | Character consistency + remix |
| `fal-ai/ideogram/v3/character-edit` | Character consistency + inpainting |
| `fal-ai/ideogram/v3/layerize-design` | Extract text layers from flat design images |

All endpoints use the same queue submit/status/result pattern.