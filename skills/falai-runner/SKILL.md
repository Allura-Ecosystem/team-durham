---
name: falai-runner
description: >
  Execute fal.ai image generation from brand-guided prompts. Reads the fal.ai JSON
  from Phase 3 output, calls the fal.ai API for each prompt, downloads results to
  generated-images/, and logs every generation to Allura Brain (PostgreSQL (episodic)
  + RuVector semantic graph).
  Supports the multi-model stack: Seedream (typography), Nano Banana (UI/hero),
  Flux Dev (layout/background), Recraft (vector). Post-generation validation
  against brand rules. Winning prompt tracking in Allura Brain + Notion.
  KEY PRINCIPLE: Every image must be FROM the brand, not just ABOUT it.
---

# fal.ai Runner Skill v1.0

> **Executor:** Glaser (Visual Director) or any agent needing image generation
> **Type:** Image Generation Runner
> **Prerequisites:** Phase 3 fal.ai JSON + `FAL_API_KEY` env var
> **group_id:** `allura-team-durham`

---

## Purpose

Execute fal.ai image generation from the brand-guided prompts produced in Phase 3.
This skill bridges the gap between "prompts ready" and "assets rendered."

---

## Workflow

### Step 1: Load fal.ai Runs JSON

Read the Phase 3 output file:
```
clients/{brand-slug}/03_visual-director_fal-ai-runs.json
```

This JSON contains an array of prompt objects, each with:
- `tokenSet`: Unique identifier (e.g., "IMG-1-NB")
- `model`: fal.ai model endpoint (e.g., "fal-ai/nano-banana-2")
- `prompt`: Brand-enriched prompt text
- `negativePrompt`: Brand-aware negative prompt
- `seed`: Reproducibility seed
- `resolution`: Target resolution
- `direction`: Human-readable description

### Step 2: Validate Prerequisites

Before execution, verify:
- [ ] `FAL_API_KEY` environment variable is set
- [ ] Output directory `clients/{brand-slug}/generated-images/` exists
- [ ] Brand context files are present (brand kit, logo pack, brand truth)
- [ ] fal.ai runs JSON is valid and contains prompts

### Step 3: Execute Generation

For each prompt in the JSON:

```bash
# Using the fal.ai Node.js client
node scripts/fal-runner.mjs --client {brand-slug} --prompt-index {i}
```

Or execute all at once:
```bash
node scripts/fal-runner.mjs --client {brand-slug} --all
```

### Step 4: Download and Save

Each generated image is saved to:
```
clients/{brand-slug}/generated-images/{tokenSet}-{timestamp}.{ext}
```

### Step 5: Log to Allura Brain

Every generation is logged:
- **PostgreSQL**: `image_generated` event with model, cost, validation status
- **Semantic graph**: Brand→Prompt→Model→Metrics graph relationship
- **Notion**: Winning prompts database sync

### Step 6: Validate Against Brand Kit

Post-generation validation checks:
- Color accuracy (brand palette hex values)
- Shape philosophy (no sharp corners, droplet curves)
- Mood (warm, not cold/clinical)
- Forbidden combos (no Deep Blue on Warm Yellow)
- Voice rules (no forbidden words in text)

---

## Model Stack

| Use Case | Model | Cost/Image | Why |
|----------|-------|------------|-----|
| Typography/posters | `fal-ai/seedream-v4.5` | $0.020 | Best text rendering |
| Hero images/UI | `fal-ai/nano-banana-2` | $0.015 | Clean composition, 4K |
| Backgrounds/patterns | `fal-ai/flux-dev` | $0.012 | Best abstract layouts |
| Vector logos/icons | `fal-ai/recraft-v3` | $0.020 | Vector output, scalable |
| Quick drafts | `fal-ai/flux-schnell` | $0.003 | Sub-second, ultra-cheap |

---

## Error Handling

- **Rate limits**: Exponential backoff (1s, 2s, 4s, 8s, max 30s)
- **API errors**: Log to PostgreSQL as `AGENT_FAILED`, continue with next prompt
- **Invalid images**: Skip and flag in validation report
- **Missing API key**: Fail fast with clear error message

---

## Cost Tracking

All costs are tracked per generation and aggregated:
- Per-image cost from model registry
- Total campaign cost in workflow report
- Cost alerts if exceeding budget thresholds

---

## Integration Points

- **Phase 3 (Glaser)**: Produces the fal.ai JSON that this skill consumes
- **Phase 4 (Rand)**: Uses generated images in Brand Kit assembly
- **Phase 5 (Munari)**: Validates images against brand rules
- **Allura Brain**: All events logged to PostgreSQL (episodic) + RuVector semantic graph
- **Notion**: Winning prompts synced for team visibility