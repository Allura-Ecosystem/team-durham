---
name: figma-brand-automation
description: >
  Brand-guided image generation and Figma automation for Team Durham's pipeline.
  Reads ACTUAL brand deliverables (brand kit, logo pack, brand truth) and injects
  them into every fal.ai prompt. Multi-model stack: Seedream (typography), Nano Banana
  (UI/hero), Flux Dev (layout/background), Recraft (vector). Post-generation validation
  against brand rules. Winning prompt tracking in Allura Brain + Notion.
  KEY PRINCIPLE: Images must be FROM the brand, not just ABOUT it.
---

# Figma Brand Automation Skill v5.0

> **Executor:** Any Team Durham agent (Glaser, Rand, Ogilvy)
> **Type:** Brand-Guided Generation + Figma Automation
> **Prerequisites:** Brand Kit + Logo Pack + Brand Truth + fal.ai API
> **group_id:** `allura-team-durham`

---

## Core Principle

**Images must be FROM the brand, not just ABOUT it.**

Every generated image must reference:
- The droplet philosophy from the logo pack
- The exact color ratios from the brand truth
- The typography specs from the brand kit
- The photography style from the brand truth
- The shadow system from the brand kit
- The actual logo files from assets/

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  BRAND DELIVERABLES (Source of Truth)                       │
│  ├── brand-kit-v3.2-final.md (colors, typography, shadows)  │
│  ├── 03_visual-director_logo-pack.md (droplet philosophy)   │
│  ├── 06_allura-memory_brand-truth.json (archetype, voice)   │
│  └── assets/ (logos, mood image, favicons)                  │
└────────────────────┬──────────────────────────────────────┘
                     │ reads
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  BRAND CONTEXT INJECTOR                                     │
│  Extracts: colors, typography, shapes, photography,         │
│  logo philosophy, voice rules, shadow system                │
│  Injects: into every prompt BEFORE generation                │
└────────────────────┬──────────────────────────────────────┘
                     │ enriches
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  MULTI-MODEL STACK                                          │
│  ├── Seedream v4.5 → typography, posters, text-heavy        │
│  ├── Nano Banana 2 → UI, hero images, clean composition     │
│  ├── Flux Dev → backgrounds, patterns, abstract layouts    │
│  └── Recraft V3 → vector logos, icons, scalable patterns    │
└────────────────────┬──────────────────────────────────────┘
                     │ generates
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  BRAND VALIDATION                                           │
│  Checks: color accuracy, shape philosophy, mood,            │
│  forbidden combos, voice rules, logo misuse                  │
└────────────────────┬──────────────────────────────────────┘
                     │ logs
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  ALLURA BRAN + NOTION                                       │
│  PostgreSQL: events, generation logs, cost tracking         │
│  Neo4j: Brand→Prompt→Model→Metrics graph                    │
│  Notion: Winning prompts database, team visibility          │
└─────────────────────────────────────────────────────────────┘
```

---

## 7-Step Workflow

### Step 1: Load Brand Context
Read actual deliverables, extract brand DNA.

**Source files:**
| File | What It Provides |
|------|-----------------|
| `brand-kit-v3.2-final.md` | Colors, typography, shadow system, visual language |
| `03_visual-director_logo-pack.md` | Droplet philosophy, allura gesture, logo variants |
| `06_allura-memory_brand-truth.json` | Archetype, positioning, voice, photography style |
| `assets/logos/` | Actual logo files for reference images |
| `assets/mood/` | Mood reference image |

### Step 2: Generate Brand-Guided Prompts
Inject brand context into every prompt.

**Before (v4 — random AI art):**
```
"Abstract brand imagery... Warm Yellow (#FFC300)... No text, no logos..."
```

**After (v5 — brand-guided):**
```
"Brand: allura — Warm technology that brings communities together.
Archetype: Warm + Connected. Droplet philosophy: every 'a' carries
a subtle droplet curve — water represents connection, nourishment,
adaptability. The allura gesture: gentle upward curve of the final 'a'.
Shapes: Droplet curves — fluid, organic shapes. Avoid sharp corners.
Colors with ratios: Warm Yellow #FFC300 (7%), Deep Blue #0581A7 (15%),
Warm Green #BDBD0D (3%), Dark Gray #142329 (25%), White #F5F5F5 (50%).
Typography: Outfit for headings, Inter for body.
Shadows: 3-layer editorial shadows.
[...then the creative direction...]"
```

### Step 3: Select Optimal Model
Match use case to best model.

| Use Case | Model | Why |
|----------|-------|-----|
| Typography/posters | Seedream v4.5 | Best-in-class text rendering |
| Hero images/UI | Nano Banana 2 | Clean composition, 4K output |
| Backgrounds/patterns | Flux Dev | Best abstract layouts, cheap |
| Vector logos/icons | Recraft V3 | Vector output, scalable |
| Quick drafts | Flux Schnell | Sub-second, ultra-cheap |

### Step 4: Execute Generation
Call fal.ai with brand-enriched prompts + reference images.

### Step 5: Validate Against Brand Kit
Post-generation QA checks:

| Check | Rule | Source |
|-------|------|--------|
| Color accuracy | Must match brand palette hex values | Brand truth |
| Color ratios | Yellow ~7%, Blue ~15%, White ~50% | Brand truth |
| Shape philosophy | No sharp corners, droplet curves | Logo pack |
| Mood | Must be warm, not cold/clinical | Brand truth |
| Forbidden combos | No Deep Blue on Warm Yellow | Brand kit |
| Voice rules | No forbidden words in text | Brand truth |
| Logo misuse | No stretch, rotation, effects | Logo pack |

### Step 6: Log to Allura Brain + Notion
Every generation logged to PostgreSQL + Neo4j + Notion.

**PostgreSQL events:**
- `workflow_started` — Brand context loaded
- `prompts_generated` — Prompts created with brand injection
- `image_generated` — Each image with model, cost, validation
- `workflow_complete` — Final summary

**Neo4j graph:**
```cypher
(Brand)-[:HAS_WINNING_PROMPT]->(Prompt)-[:USES_MODEL]->(AIModel)
(Prompt)-[:HAS_METRICS]->(PromptMetrics)
(Prompt)-[:TAGGED_AS]->(Tag)
```

**Notion sync:**
- Database: "Winning Prompts"
- Columns: Prompt ID | Model | Score | Cost | Tags | Status

### Step 7: Save + Report
Save to `generated-images/` directory, generate performance report.

---

## Allura Model Assignments

| Image | Token Set | Model | Brand Context Used |
|-------|-----------|-------|-------------------|
| Hero Abstract | IMG-1-NB | Nano Banana 2 | archetype, droplet philosophy, colors, shapes |
| Community | IMG-2-NBP | Nano Banana Pro | archetype, photography style, colors |
| Pattern | IMG-3-FLUX | Flux Dev | droplet philosophy, shapes, color ratios |
| Craft Detail | IMG-4-FLUX | Flux Dev | archetype, photography style, craft value |
| Logo Hero UI | LOGO-1-SEEDREAM | Seedream v4.5 | logo gesture, typography, shadows, shapes |
| Social Cards | LOGO-2-SEEDREAM | Seedream v4.5 | logo gesture, typography, shadows, shapes |
| Logo Pattern | LOGO-3-RECRAFT | Recraft V3 | droplet philosophy, shapes, vector style |
| Presentation | LOGO-4-SEEDREAM | Seedream v4.5 | logo gesture, typography, shadows, color ratios |

---

## Cost Summary

| Approach | 8 Images | Quality | Brand Accuracy |
|----------|----------|---------|----------------|
| Single (Flux LoRA) | $0.096 | ⭐⭐⭐ | ❌ No brand context |
| Multi-Model (v4) | $0.144 | ⭐⭐⭐⭐ | ⚠️ Partial |
| Brand-Guided (v5) | $0.144 | ⭐⭐⭐⭐⭐ | ✅ Full brand injection |

---

## File Structure

```
src/
├── index.ts                          # Main entry (exports all tools)
├── prompts/
│   ├── brand-context-injector.ts     # Reads deliverables, injects into prompts
│   ├── allura-brand-guided.ts        # Brand-guided prompts with validation
│   ├── brand-guided-workflow.ts      # 7-step workflow pipeline
│   ├── model-selection.ts            # Model registry + selection engine
│   ├── model-stack.ts                # Multi-model chaining
│   ├── allura-optimized.ts           # v4 prompts (legacy)
│   ├── winning-prompts-tracking.ts   # Brain + Notion tracking
│   └── index.ts                      # Prompt barrel export
├── tools/
│   ├── duplicate-template.ts         # Figma Community duplication
│   ├── analyze-template.ts          # AI Vision analysis
│   ├── customize-brand.ts           # Brand customization
│   ├── export-deliverable.ts        # PDF/PNG export
│   └── qa-validation.ts             # QA checks
└── utils/
    └── allura-brain.ts              # PostgreSQL + Neo4j logging
```

---

## Invariants

- **Brand context FIRST** — Every prompt must be enriched before generation
- **No random art** — Images must reference actual brand deliverables
- **Color ratios enforced** — Yellow 7%, Blue 15%, White 50%, etc.
- **Droplet philosophy** — Every image references the logo's droplet concept
- **No sharp corners** — Brand philosophy avoids rigid geometric forms
- **3-layer shadows** — Editorial shadow system in all UI mockups
- **Validation required** — Every image checked against brand rules
- **Everything logged** — All actions to Allura Brain + Notion
- **group_id** — `allura-team-durham` on all operations
- **agent_id** — Tracked on every action

---

## Event Types

| Event | When |
|-------|------|
| `workflow_started` | Brand context loaded |
| `prompts_generated` | Prompts created with injection |
| `image_generated` | Each image generated |
| `workflow_complete` | Pipeline finished |
| `winning_prompt_logged` | Prompt logged to Brain |
| `prompt_metrics_updated` | Quality score updated |
| `brand_validation_failed` | Image fails brand rules |
| `notion_sync_complete` | Prompts synced to Notion |

---

## Quick Reference

```typescript
// Full workflow
const result = await executeBrandGuidedWorkflow({
  brandSlug: 'allura-memory',
  agentId: 'glaser',
  groupId: 'allura-team-durham',
  priority: 'quality'
});

// Quick single generation
const image = await quickGenerate('allura-memory', 'hero-image');

// Compare approaches
const comparison = await compareApproaches('allura-memory');

// Get winning prompts
const topPrompts = await getTopPromptsForUseCase('hero', 'allura-memory');
```