---
name: brand-kit-10-section
description: Master brand kit assembly workflow defining all 10 sections, their content requirements, prerequisite validation, and output format. Use when agent_id=rand runs BK (Brand Kit), SC (Section Check), VP (Validate Prerequisites), or UB (Update Brand Kit) commands. The brand kit IS the single source of truth.
---

# Brand Kit — 10-Section Assembly Skill

> **Executor:** @Rand (Brand Kit Builder)
> **Type:** Assembly — single source of truth
> **Prerequisites:** Approved Strategy Pack + Naming Pack + Logo Pack + Copy Pack
> **group_id:** `allura-team-durham`

---

## Purpose

Assemble the definitive brand document. Every section must be populated from an approved deliverable — no gaps, no placeholders, no fiction. A brand kit that contains assumptions is worse than no brand kit at all.

---

## The 10 Sections

### Section 1: Brand Overview

**Source:** Strategy Pack (Aaker)
**Content:**
- Brand name and legal entity
- Brand promise (one sentence)
- Positioning statement (for [target] who [need], [brand] is a [category] that [point of difference] because [reason to believe])
- Brand personality (primary + secondary Aaker dimensions with scores)
- Brand archetype (primary + secondary)

**Validation:** Must match locked Strategy Pack exactly. No paraphrasing.

---

### Section 2: Brand Story

**Source:** Strategy Pack + Copy Pack
**Content:**
- Origin narrative (why this brand exists)
- Mission statement
- Vision statement
- Core values (3-5, ranked)
- Brand anthem paragraph (the emotional heart)

**Validation:** Mission and vision must be from approved Copy Pack. Origin narrative must be factually verifiable.

---

### Section 3: Logo System

**Source:** Logo Pack (Glaser)
**Content:**
- Primary logo (description, usage rules)
- Secondary logo variants (horizontal, vertical, icon-only, wordmark-only)
- Logo clear space (minimum margins in x-heights)
- Logo minimum sizes (digital and print)
- Logo misuse examples (stretch, rotate, recolor, add effects)
- Co-branding rules (how logo appears with partners)

**Validation:** Must reference actual logo files in `generated-images/`. Glaser must have approved all variants.

---

### Section 4: Color Palette

**Source:** Logo Pack / Visual Direction (Glaser)
**Content:**
- Primary color (1 color, HEX + RGB + CMYK + Pantone)
- Secondary colors (2-3 colors, all formats)
- Accent color (1 color, all formats)
- Neutral palette (black, white, grays)
- Usage ratios (primary:secondary:accent percentages)
- Accessibility pairings (WCAG 2.1 AA contrast ratios)
- Do NOT use colors (off-brand list)

**Validation:** Every color must have all 4 format values. Contrast ratios must meet WCAG 2.1 AA (4.5:1 for text, 3:1 for large text).

---

### Section 5: Typography

**Source:** Visual Direction (Glaser)
**Content:**
- Primary typeface (family, weights used, fallbacks)
- Secondary typeface (family, weights, fallbacks)
- Type scale (heading sizes H1-H6, body, caption, overline)
- Line height standards
- Letter spacing standards
- Paragraph spacing
- Web font loading strategy (FOUT/FOIT approach)

**Validation:** Must include web-safe fallbacks. All sizes must be in a consistent unit system (rem preferred).

---

### Section 6: Brand Voice & Copy Standards

**Source:** Copy Pack (Ogilvy)
**Content:**
- Voice definition (tone, language, perspective, personality — 4 dimensions)
- Voice spectrum (formality, enthusiasm, complexity, humor scales)
- Must-not list (prohibited words, tones, clichés)
- Headline standards (length, structure, CTA style)
- Body copy standards (reading level, evidence requirement)
- Platform-specific voice adjustments
- Tagline (approved version with usage rules)

**Validation:** Must match locked Copy Pack exactly. Must-not list must be enforceable by Munari.

---

### Section 7: Iconography & Graphic Elements

**Source:** Visual Direction (Glaser)
**Content:**
- Icon style (line, filled, duotone, etc.)
- Icon grid/sizing standard
- Illustration style (if applicable)
- Photography style (composition, color treatment, subject matter)
- Graphic pattern library
- Do NOT use examples (clip art, watermarked stock, etc.)

**Validation:** Icon style must be consistent. Photography style must reference moodboard examples.

---

### Section 8: Applications

**Source:** Logo Pack + Copy Pack (Glaser + Ogilvy)
**Content:**
- Business card (front/back)
- Letterhead
- Email signature
- Social media profiles (at minimum: Instagram, LinkedIn, X)
- Website header/footer
- Presentation template
- Packaging (if applicable)
- Signage (if applicable)
- Advertising templates (digital + print)

**Validation:** Each application must show specific logo, color, type, and voice — not just a placeholder.

---

### Section 9: Brand in Motion

**Source:** Visual Direction (Glaser)
**Content:**
- Motion principles (how the brand moves)
- Animation guidelines (easing, duration, choreography)
- Video intro/outro standards
- Audio brand guidelines (if applicable)
- Social media video templates
- Micro-interaction patterns (buttons, transitions, loading)

**Validation:** Motion principles must be specific enough for a developer/designer to implement without asking questions.

---

### Section 10: Governance & Maintenance

**Source:** Strategy Pack + QA (Aaker + Munari)
**Content:**
- Brand steward (who approves changes)
- Change request process (how to propose changes)
- Approval workflow (who signs off on what)
- Version history (change log format)
- Audit schedule (quarterly review cycle)
- Contact directory (who to ask about what)
- Legal protections (trademark, copyright notices)

**Validation:** Must name real roles, not just "the team." Must include specific change process.

---

## Prerequisite Validation (VP Command)

Before assembling the Brand Kit, validate ALL prerequisites:

```markdown
# Prerequisite Checklist

| # | Prerequisite | Source Agent | Status | File |
|---|-------------|-------------|--------|------|
| 1 | Strategy Pack | Aaker | ☐ Approved | brand-strategy-pack.md |
| 2 | Naming Pack | (Namer) | ☐ Approved | naming-pack.md |
| 3 | Logo Pack | Glaser | ☐ Approved | logo-pack.md |
| 4 | Visual Direction | Glaser | ☐ Approved | visual-direction.md |
| 5 | Copy Pack | Ogilvy | ☐ Approved | copy-pack.md |
| 6 | Brand Voice Guide | Ogilvy | ☐ Approved | brand-voice-guide.md |
| 7 | Must-Not List | Ogilvy | ☐ Approved | must-not-list.md |
| 8 | QA Review | Munari | ☐ Approved | qa-report.md |

**Rule:** If ANY prerequisite is missing or not approved, assembly is BLOCKED.
```

---

## Section Check (SC Command)

Verify which sections have approved content:

```markdown
# Section Check

| Section | Content Source | Approved | Notes |
|---------|---------------|----------|-------|
| 1. Brand Overview | Strategy Pack | ☐/✅ | — |
| 2. Brand Story | Strategy + Copy | ☐/✅ | — |
| 3. Logo System | Logo Pack | ☐/✅ | — |
| 4. Color Palette | Logo Pack / Visual | ☐/✅ | — |
| 5. Typography | Visual Direction | ☐/✅ | — |
| 6. Voice & Copy | Copy Pack | ☐/✅ | — |
| 7. Iconography | Visual Direction | ☐/✅ | — |
| 8. Applications | Logo + Copy | ☐/✅ | — |
| 9. Brand in Motion | Visual Direction | ☐/✅ | — |
| 10. Governance | Strategy + QA | ☐/✅ | — |
```

---

## Output Format

The assembled Brand Kit file:

```
clients/{client-slug}/05-brand-kit/brand-kit.md
```

Must contain exactly 10 sections, numbered and named as above. No extra sections. No missing sections. Every piece of content must trace to an approved deliverable.

---

## Allura Brain Integration

- Read all prior events before assembly (verify all approvals logged)
- Write `DDR_CREATED` event when brand kit is assembled
- Write `DESIGN_DECISION` events for any structural choices (e.g., "combined sections 7 & 8" — not allowed)
- Write `TASK_COMPLETE` when all 10 sections are approved
- `group_id`: `allura-team-durham`
- `agent_id`: `rand`

---

## Telemetry

Every invocation of this skill MUST log telemetry to the `events` table via MCP_DOCKER.
See `docs/TELEMETRY_SCHEMA.md` for the full schema.

### On Start

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_USED', 'allura-team-durham', 'rand', 'completed',
    '{\"skill_name\": \"brand-kit-10-section\", \"phase\": 4, \"trigger\": \"<trigger phrase>\", \"prerequisites_met\": true}'"
})
```

### On Completion

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_COMPLETED', 'allura-team-durham', 'rand', 'completed',
    '{\"skill_name\": \"brand-kit-10-section\", \"phase\": 4, \"duration_sec\": <N>, \"output_artifact_path\": \"<path>\", \"tool_calls\": [<tools used>]}'"
})
```

### On Failure

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, error_message, metadata",
  values: "'SKILL_FAILED', 'allura-team-durham', 'rand', 'failed', '<error>',
    '{\"skill_name\": \"brand-kit-10-section\", \"phase\": 4, \"missing_prerequisites\": [<items>], \"fallback_used\": false}'"
})
```

**Never skip telemetry logging.** If MCP_DOCKER_insert_data fails, log an error to the user and continue.