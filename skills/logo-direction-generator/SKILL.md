---
name: logo-direction-generator
description: Five-direction logo generation workflow for Team Durham. Use when agent_id=glaser runs LD (Logo Directions) or VL (Validate Logo) commands. Maps brand archetype to visual direction through 5 distinct concepts, with evaluation criteria, archetype-to-visual mapping tables, and iteration protocol.
---

# Logo Direction Generator Skill

> **Executor:** @Glaser (Visual Director)
> **Type:** Visual production
> **Prerequisite:** Locked Strategy Pack with archetype + positioning + personality
> **group_id:** `allura-team-durham`

---

## Purpose

Generate exactly 5 logo directions per brand. Every visual decision must trace back to the brand archetype. Decoration without purpose is noise. The logo is not the brand — but it is the brand's most concentrated expression.

---

## Prerequisites

1. **Locked Strategy Pack** — archetype, positioning, personality dimensions
2. **Brand Voice Guide** (optional but preferred) — ensures visual matches verbal
3. **Competitive Analysis** (preferred) — ensures differentiation

If Strategy Pack is not approved, STOP and delegate to @Aaker.

---

## Archetype-to-Visual Mapping

Before generating directions, map the brand archetype to visual territory:

### Primary Archetype Visual Territories

| Archetype | Visual Territory | Color Territory | Typography Territory | Shape Language |
|-----------|-----------------|-----------------|---------------------|---------------|
| Caregiver | Soft, enveloping, organic | Warm neutrals, soft greens, muted blues | Rounded sans-serif, humanist serif | Curves, ovals, protective enclosures |
| Creator | Expressive, bold, crafted | Rich purples, deep blues, golden yellows | Expressive serif, art-directed sans | Asymmetric, hand-crafted marks |
| Explorer | Vast, open, adventurous | Earth tones, sky blues, desert oranges | Clean sans-serif, condensed | Arrows, paths, open horizons |
| Hero | Bold, decisive, strong | Reds, blacks, metallics | Bold condensed, impact sans | Upward diagonals, shields, stars |
| Outlaw | Raw, disruptive, unapologetic | Dark, neon, high contrast | Sharp sans-serif, distressed | Angular, broken, deconstructed |
| Sage | Measured, clear, elevated | Deep blues, greys, forest green | Classic serif, geometric sans | Circles, grids, balanced proportions |
| Lover | Sensuous, intimate, luxurious | Deep reds, purples, golds, pinks | Elegant serif, thin sans | Curves, symmetry, flourishes |
| Jester | Playful, energetic, surprising | Bright primaries, unexpected combos | Rounded sans, playful display | Circles, bouncing shapes, asymmetric fun |
| Magician | Transformative, mysterious, elegant | Deep purples, blacks, iridescent | Thin serif, geometric sans | Transformation shapes, eyes, circles |
| Ruler | Authoritative, commanding, refined | Navy, gold, burgundy, platinum | Classic serif, authoritative sans | Rectangles, crests, symmetrical |
| Regular Guy | Friendly, approachable, honest | Warm neutrals, soft primaries | Friendly sans-serif, humanist | Rounded, balanced, no sharp edges |
| Innocent | Pure, bright, optimistic | Light blues, whites, soft yellows | Clean round sans-serif | Circles, suns, clouds, simple shapes |

### The 5-Direction Framework

Each direction MUST be conceptually distinct. No two directions should share the same core visual idea.

**Direction 1: Archetype-True**
The purest expression of the brand archetype. What does this brand look like if it fully embodies its primary archetype? This is the safe-but-strong direction.

**Direction 2: Archetype-Contrast**
What if the brand leans into its secondary archetype instead? This tests whether the secondary personality creates a more memorable visual. Often the most interesting direction.

**Direction 3: Category-Disruptive**
Deliberately break the visual conventions of the category. If competitors are all round, go angular. If they're all blue, use orange. This direction forces differentiation.

**Direction 4: Minimalist Essence**
Strip everything away until only the brand's core idea remains. What's the most reduced visual that still communicates the brand? This direction tests conceptual strength.

**Direction 5: Aspirational Stretch**
Where could this brand evolve visually in 3-5 years? Push the archetype toward its edge — not breaking it, but stretching it. This direction gives the brand room to grow.

---

## Workflow

### Step 1: Load Strategy & Visual Brief

```sql
SELECT * FROM events
WHERE agent_id IN ('aaker', 'glaser')
  AND group_id = 'allura-team-durham'
  AND event_type IN ('DESIGN_DECISION', 'DDR_CREATED')
ORDER BY created_at DESC LIMIT 10;
```

Read the Strategy Pack and any existing visual direction files.

### Step 2: Generate 5 Directions

For each direction, produce:

```markdown
## Direction [N]: [Name]

### Concept
[2-3 sentences explaining the core visual idea]

### Archetype Alignment
- Primary: [how it serves the primary archetype]
- Secondary: [how it serves the secondary archetype, if applicable]

### Visual Elements
- **Shape language:** [description]
- **Color palette:**
  - Primary: [HEX] — [name, rationale]
  - Secondary: [HEX] — [name, rationale]
  - Accent: [HEX] — [name, rationale]
- **Typography:** [typeface family, weight, rationale]
- **Symbol/Mark:** [description of the mark concept]

### Scale
- **Large (hero):** [how it works at 500px+]
- **Medium (header):** [how it works at 100-200px]
- **Small (favicon):** [how it works at 16-32px]
- **Monochrome:** [how it works in single color]

### Differentiation
[How this direction differs from the other 4 and from competitors]

### Risks
[What could go wrong with this direction — be honest]
```

### Step 3: Internal Evaluation

Rate each direction against 5 criteria (1-5 score):

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Archetype Alignment** | 30% | Does it embody the brand archetype? |
| **Differentiation** | 25% | Is it distinct from competitors? |
| **Scalability** | 15% | Does it work at all sizes? |
| **Versatility** | 15% | Does it work across media and contexts? |
| **Timelessness** | 15% | Will it age well (5+ years)? |

**Weighted score = Σ(score × weight)**

Present all 5 directions with scores in a comparison matrix.

### Step 4: Recommend Top 3

From the 5 directions, recommend the top 3 based on weighted scores + strategic judgment. Provide:

1. **Primary recommendation** — highest score + strongest archetype alignment
2. **Contrast recommendation** — most differentiated from category
3. **Evolution recommendation** — best for brand growth over 3-5 years

### Step 5: Generate Visual Proofs

For each recommended direction, craft a fal.ai prompt using the `fal-ai-image-prompt-engineering` skill. Generate:
- Full mark at large scale
- Wordmark + mark combination
- Small-scale application (favicon size)

### Step 6: Log & Write

```sql
INSERT INTO events (event_type, group_id, agent_id, status, metadata)
VALUES ('DESIGN_DECISION', 'allura-team-durham', 'glaser', 'completed',
  '{"decision": "logo_directions_generated", "directions": 5, "recommended": 3, "top_score": N}');
```

Write to: `clients/{client-slug}/03-visual/logo-directions.md`

---

## Logo Validation (VL Command)

After direction selection and refinement, validate the chosen logo:

### Validation Checklist

- [ ] **Archetype Traceability:** Every visual element traces to archetype decision
- [ ] **Competitive Differentiation:** No competitor could use this logo
- [ ] **Scalability Test:** Logo is legible at 16px and impactful at 500px
- [ ] **Monochrome Test:** Logo works in single color (black on white)
- [ ] **Reversed Test:** Logo works in reverse (white on dark)
- [ ] **Accessibility:** Color combinations meet WCAG 2.1 AA contrast
- [ ] **Cultural Sensitivity:** Logo has no negative connotations in target markets
- [ ] **Production Feasibility:** Logo can be printed, embroidered, and rendered digitally
- [ ] **Timelessness:** Logo does not rely on current design trends

### Decision Gate

If the chosen direction passes 8/9 or more: **APPROVED** → proceed to logo lock.
If 6-7/9: **NEEDS REFINEMENT** → iterate with specific fixes.
If below 6/9: **REJECTED** → return to Step 2 with a different approach.

---

## Allura Brain Integration

- Read prior visual events before generating (avoid repeating same concepts)
- Write `DESIGN_DECISION` for each direction generated
- Write `DDR_CREATED` when a direction is selected and locked
- `group_id`: `allura-team-durham`
- `agent_id`: `glaser`

---

## Telemetry

Every invocation of this skill MUST log telemetry to the `events` table via MCP_DOCKER.
See `docs/TELEMETRY_SCHEMA.md` for the full schema.

### On Start

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_USED', 'allura-team-durham', 'glaser', 'completed',
    '{\"skill_name\": \"logo-direction-generator\", \"phase\": 3, \"trigger\": \"<trigger phrase>\", \"prerequisites_met\": true}'"
})
```

### On Completion

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_COMPLETED', 'allura-team-durham', 'glaser', 'completed',
    '{\"skill_name\": \"logo-direction-generator\", \"phase\": 3, \"duration_sec\": <N>, \"output_artifact_path\": \"<path>\", \"tool_calls\": [<tools used>]}'"
})
```

### On Failure

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, error_message, metadata",
  values: "'SKILL_FAILED', 'allura-team-durham', 'glaser', 'failed', '<error>',
    '{\"skill_name\": \"logo-direction-generator\", \"phase\": 3, \"missing_prerequisites\": [<items>], \"fallback_used\": false}'"
})
```

**Never skip telemetry logging.** If MCP_DOCKER_insert_data fails, log an error to the user and continue.