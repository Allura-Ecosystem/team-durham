---
name: fal-ai-image-prompt-engineering
description: fal.ai visual generation prompt engineering workflow for Team Durham. Use when agent_id=glaser runs FP (Fal.ai Prompt) command or when generating brand visuals. Translates brand archetype, visual direction, and design specifications into optimized fal.ai prompts with style parameters, negative prompts, and iteration protocol.
---

# fal.ai Image Prompt Engineering Skill

> **Executor:** @Glaser (Visual Director)
> **Type:** Visual production (AI-assisted)
> **Prerequisite:** Approved Logo Directions or Visual Direction
> **group_id:** `allura-team-durham`

---

## Purpose

Translate brand strategy and visual direction into optimized fal.ai prompts that produce consistent, on-brand visual assets. Every prompt must trace back to an approved archetype and visual direction — no generic "make it look nice" prompts.

---

## fal.ai Model Selection

### Primary Models

| Model | Best For | Aspect Ratios | Notes |
|-------|---------|---------------|-------|
| `fal-ai/flux/schnell` | Fast iterations, concept exploration | 1:1, 16:9, 9:16, 4:3 | Fastest, good for direction testing |
| `fal-ai/flux/dev` | High-quality brand assets | 1:1, 16:9, 9:16, 4:3 | Best quality, slower |
| `fal-ai/flux/pro` | Final production assets | 1:1, 16:9, 9:16, 4:3 | Maximum quality, longest |

### Selection Rule

- **Iteration/exploration:** Use `schnell` (fast feedback loop)
- **Direction confirmation:** Use `dev` (quality + speed balance)
- **Final production:** Use `pro` (publication quality)

---

## Prompt Architecture

### Structure

Every fal.ai prompt follows this structure:

```
[SUBJECT], [COMPOSITION], [STYLE/ARCHETYPE ALIGNMENT], [COLOR DIRECTIVE], [TECHNICAL QUALITY], [BACKGROUND], [EXCLUSION/NEGATIVE]
```

### Component Breakdown

| Component | Description | Example |
|-----------|-------------|---------|
| **SUBJECT** | What is the central element | "A geometric logo mark" |
| **COMPOSITION** | Layout, orientation, cropping | "centered composition, symmetrical" |
| **STYLE** | Visual style aligned to archetype | "minimal Swiss design, bold geometric shapes" |
| **COLOR** | Specific color directive | "navy blue #1a365d and gold #d4a843" |
| **QUALITY** | Technical quality markers | "vector quality, clean edges, professional" |
| **BACKGROUND** | Background treatment | "on pure white background" |
| **EXCLUSION** | What NOT to include | "no photorealistic elements, no gradients, no shadows" |

---

## Archetype-to-Prompt Mapping

| Archetype | Style Keywords | Avoid Keywords |
|-----------|---------------|----------------|
| Caregiver | soft, warm, organic, enveloping, rounded | harsh, aggressive, cold, sharp |
| Creator | expressive, crafted, artistic, bold | generic, corporate, safe, plain |
| Explorer | open, adventurous, expansive, dynamic | confined, restrictive, tame, settled |
| Hero | bold, decisive, strong, commanding, sharp | weak, passive, gentle, tentative |
| Outlaw | raw, disruptive, edgy, high-contrast | corporate, sanitized, safe, polished |
| Sage | measured, clear, elevated, refined | simplistic, childish, cluttered, flashy |
| Lover | sensuous, elegant, luxurious, refined | cheap, casual, harsh, clinical |
| Jester | playful, energetic, surprising, bright | serious, boring, formal, rigid |
| Magician | transforming, mysterious, elegant, layered | ordinary, mundane, flat, simple |
| Ruler | authoritative, commanding, refined, structured | casual, playful, messy, informal |
| Regular Guy | friendly, approachable, honest, warm | elitist, exclusive, cold, pretentious |
| Innocent | pure, bright, optimistic, clean | dark, complex, cynical, heavy |

---

## Prompt Templates by Asset Type

### Logo Mark

```
A [ARCHETYPE_STYLE] logo mark for [BRAND NAME], [SHAPE_LANGUAGE], [COLOR_DIRECTIVE], [COMPOSITION], clean vector quality, sharp edges, [BACKGROUND], designed by [DESIGNER_REF]. [EXCLUSION]

Example:
A bold geometric logo mark for Ember Fold, interlocking angular forms suggesting transformation, navy blue #1a365d and gold #d4a843, centered symmetric composition, clean vector quality, sharp edges, on pure white background, designed by Paul Rand. No photorealistic elements, no gradients, no shadows, no 3D effects.
```

### Logo Mark + Wordmark Combination

```
A [ARCHETYPE_STYLE] logo for [BRAND NAME], featuring [MARK_DESCRIPTION] alongside the wordmark "[BRAND NAME]" in [TYPEFACE_STYLE] type, [COLOR_DIRECTIVE], [COMPOSITION], professional brand identity, [BACKGROUND]. [EXCLUSION]

Example:
A refined geometric logo for Ember Fold, featuring an interlocking angular mark alongside the wordmark "Ember Fold" in clean geometric sans-serif type, navy blue #1a365d and gold #d4a843, centered balanced composition, professional brand identity, on pure white background. No photorealistic elements, no gradients.
```

### Brand Pattern

```
A [ARCHETYPE_STYLE] repeating pattern for [BRAND NAME], [PATTERN_DESCRIPTION], [COLOR_DIRECTIVE], seamless tile, professional surface design, [BACKGROUND]. [EXCLUSION]

Example:
A bold geometric repeating pattern for Ember Fold, interlocking angular shapes at 45-degree angles, navy blue #1a365d and gold #d4a843 on white, seamless tile, professional surface design. No photorealistic elements, no organic shapes.
```

### Application Mockup

```
[APPLICATION_TYPE] mockup for [BRAND NAME], featuring [BRAND_ELEMENTS], [ARCHETYPE_STYLE] brand identity, [COLOR_DIRECTIVE], professional product photography, [LIGHTING], [BACKGROUND]. [EXCLUSION]

Example:
Business card mockup for Ember Fold, featuring the angular interlocking mark and "Ember Fold" wordmark, refined geometric brand identity, navy blue and gold on white cotton stock, professional product photography, soft directional lighting, on neutral grey background. No photorealistic, no 3D effects.
```

---

## Iteration Protocol

### The 3-Round System

**Round 1: Exploration (5-8 generations, `schnell`)**
- Generate wide variations across the 5 directions
- Vary style keywords, compositions, and color proportions
- Purpose: Find the visual territory that resonates

**Round 2: Refinement (3-5 generations, `dev`)**
- Take the strongest 2-3 concepts from Round 1
- Refine composition, color balance, and detail
- Purpose: Narrow to the best direction

**Round 3: Production (2-3 generations, `pro`)**
- Take the selected direction from Round 2
- Generate final production-quality assets
- Purpose: Create the deliverable

### Iteration Rules

1. **Never iterate more than 3 rounds** — if it's not working after Round 2, reconsider the direction
2. **Every prompt must change at least one parameter** — no identical re-runs
3. **Document every prompt** — log the full prompt text and result assessment
4. **Rate every output** — 1-5 scale on archetype alignment, quality, and scalability
5. **Archive rejected outputs** — they inform future decisions

---

## Output Documentation

Every generation must be logged:

```markdown
# Visual Generation Log

## Round [N]: [Purpose]

### Generation [N].[M]
- **Model:** [schnell/dev/pro]
- **Prompt:** [full prompt text]
- **Seed:** [if applicable]
- **Dimensions:** [WxH]
- **Asset type:** [logo mark / combination / pattern / mockup]
- **Direction:** [1-5 direction number]
- **Rating:** [1-5] archetype alignment / [1-5] quality / [1-5] scalability
- **Assessment:** [1-2 sentence critique]
- **File:** `generated-images/[filename].png`
```

Files saved to: `clients/{client-slug}/generated-images/`

---

## Allura Brain Integration

- Read prior visual events (avoid repeating failed approaches)
- Write `DESIGN_DECISION` for each generation round result
- Write `DDR_CREATED` when a visual direction is locked
- `group_id`: `allura-team-durham`
- `agent_id`: `glaser`