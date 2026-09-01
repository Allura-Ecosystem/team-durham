---
name: brand-strategy
description: Use this skill when defining brand positioning, personality using Aaker's 5 dimensions, STP framework, or voice rules. Trigger when the user mentions brand strategy, positioning statement, Aaker dimensions, brand personality, target audience, or competitive differentiation. This skill provides the complete workflow for creating a locked Strategy Pack.
---

# Brand Strategy Skill

> **Executor:** @Aaker (Brand Strategist)
> **Type:** Strategy definition
> **group_id:** `allura-team-durham`

---

## Purpose

Define brand positioning, personality, promise, and proof points. This is the foundation that all other brand work builds on. **No creative work proceeds without a locked Strategy Pack.**

---

## Workflow

### Step 1: Discover
- Query Allura Brain for existing brand truth
- Research competitive landscape via WebFetch
- Identify target audience and market positioning
- Interview stakeholders if needed

### Step 2: Define Brand Personality
Use Aaker's 5 Brand Personality Dimensions:

| Dimension | Traits | Best For |
|-----------|--------|----------|
| **Sincerity** | Down-to-earth, honest, wholesome, cheerful | Family brands, non-profits |
| **Excitement** | Daring, spirited, imaginative, up-to-date | Youth brands, tech startups |
| **Competence** | Reliable, intelligent, successful | B2B, professional services |
| **Sophistication** | Upper class, charming | Luxury, fashion, premium |
| **Ruggedness** | Outdoorsy, tough | Outdoor gear, automotive |

**Rule:** Lock on exactly 1-2 dimensions. Never more.

### Step 3: Articulate Brand Positioning
Use the STP framework:
- **Segmentation:** Who are the distinct market segments?
- **Targeting:** Which segment(s) will we serve?
- **Positioning:** How will we win in that space?

Positioning Statement Template:
```
For [target audience] who [need/frame of reference],
[brand name] is a [category] that [point of difference]
because [reason to believe].
```

### Step 4: Define Brand Promise
One sentence that captures what the brand delivers. Must be:
- Credible (backed by proof points)
- Differentiated (not generic)
- Ownable (unique to this brand)

### Step 5: Create Proof Points
3-5 evidence-based reasons the brand promise is credible:
- Facts, not aspirations
- Verifiable claims
- Specific, not vague

---

## Output Format

```markdown
# Brand Strategy Pack — [Brand Name]

## Brand Personality
- Primary: [dimension] ([score]/5)
- Secondary: [dimension] ([score]/5)
- Rationale: [why these dimensions]

## Positioning Statement
For [target] who [need], [brand] is a [category] that [point of difference] because [reason to believe].

## Brand Promise
[One sentence]

## Proof Points
1. [Evidence-based reason]
2. [Evidence-based reason]
3. [Evidence-based reason]

## Brand Voice
- Tone: [description]
- Language: [description]
- Perspective: [description]
- Must-Never List: [prohibited terms]

## Target Audience
- Primary: [demographic + psychographic]
- Secondary: [if applicable]
- Personas: [key user types]

## Competitive Frame
- Direct competitors: [list]
- Indirect competitors: [list]
- Aspirational benchmarks: [list]

## Strategic Rationale
[Why this strategy will win]

## Lock Status
**LOCKED:** [Yes/No] — Date: [timestamp]
**Locked by:** [Aaker]
**Next phase:** [Naming/Visual Direction]
```

---

## Allura Brain Integration

- Write `DESIGN_DECISION` events for all positioning decisions
- Write `DDR_CREATED` for major strategic pivots
- `group_id`: `allura-team-durham`

---

## Validation Checklist

Before marking Strategy Pack as LOCKED:
- [ ] Personality locked on 1-2 Aaker dimensions
- [ ] Positioning statement is complete and specific
- [ ] Brand promise is credible and differentiated
- [ ] Proof points are evidence-based
- [ ] Voice rules are actionable
- [ ] Target audience is clearly defined
- [ ] No contradictions or gaps
- [ ] Kotler has reviewed and approved

---

## Telemetry

Every invocation of this skill MUST log telemetry to the `events` table via MCP_DOCKER.
See `docs/TELEMETRY_SCHEMA.md` for the full schema.

### On Start

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_USED', 'allura-team-durham', 'aaker', 'completed',
    '{\"skill_name\": \"brand-strategy\", \"phase\": 1, \"trigger\": \"<trigger phrase>\", \"prerequisites_met\": true}'"
})
```

### On Completion

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_COMPLETED', 'allura-team-durham', 'aaker', 'completed',
    '{\"skill_name\": \"brand-strategy\", \"phase\": 1, \"duration_sec\": <N>, \"output_artifact_path\": \"<path>\", \"tool_calls\": [<tools used>]}'"
})
```

### On Failure

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, error_message, metadata",
  values: "'SKILL_FAILED', 'allura-team-durham', 'aaker', 'failed', '<error>',
    '{\"skill_name\": \"brand-strategy\", \"phase\": 1, \"missing_prerequisites\": [<items>], \"fallback_used\": false}'"
})
```

**Never skip telemetry logging.** If MCP_DOCKER_insert_data fails, log an error to the user and continue.

---

## Common Mistakes

1. **Trying to be everything** — "We're sincere AND exciting AND competent" ❌
2. **Vague positioning** — "For everyone who wants quality" ❌
3. **Aspirational proof points** — "We will be the best" ❌
4. **Generic voice** — "Professional yet approachable" ❌
5. **Skipping validation** — Moving to creative without locking ❌
