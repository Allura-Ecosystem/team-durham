---
name: brand-consistency-review
description: "Score brand compliance with the Munari QA rubric."
globs: ["clients/**", ".claude/**"]
---

# Brand Consistency Review Skill — Phase 5 QA Numeric Scoring System

> **Executor:** @Munari (QA Reviewer)
> **Type:** Read-only review with numeric scoring
> **group_id:** `allura-team-durham`
> **Pass Gate:** 85% (51/60 items minimum)

---

## Purpose

Validates brand consistency across all assets in the Brand Maker workspace using a rigorous 60-item numeric scoring system. Checks alignment with brand truth, strategy, and visual direction with pass/fail enforcement.

---

## Scoring Architecture

### Weight Distribution (100 points total)

| Category | Weight | Items | Max Points |
|----------|--------|-------|------------|
| Strategy Completeness | 20% | 12 | 20 |
| Naming Quality | 15% | 9 | 15 |
| Visual Consistency | 25% | 15 | 25 |
| Brand Kit Completeness | 25% | 15 | 25 |
| Cross-Reference Accuracy | 15% | 9 | 15 |
| **TOTAL** | **100%** | **60** | **100** |

### Pass Gate Enforcement

| Result | Threshold | Action |
|--------|-----------|--------|
| **PASS** | ≥85% (51+/60 items) | Proceed to Phase 6 (Allura Memory) |
| **CONDITIONAL** | 70-84% (42-50 items) | Fix critical issues, re-review required |
| **FAIL** | <70% (<42 items) | Return to producing agents, major revision |

---

## 60-Item Checklist with Scoring

### Category 1: Strategy Completeness (20 points)

*Source: `01_strategist_strategy-pack.md`*

| # | Item | Points | Check |
|---|------|--------|-------|
| S1 | Client intake fields fully populated | 2 | All 7 fields have non-placeholder values |
| S2 | One archetype is locked and documented | 2 | Primary archetype specified with attributes |
| S3 | Promise, desire, fear defined | 2 | All three core attributes documented |
| S4 | Voice rules are concrete and actionable | 2 | Specific do/don't examples provided |
| S5 | One Big Idea is one clear sentence | 2 | Positioning statement is concise |
| S6 | Must-not list is explicit | 2 | Prohibited terms/styles listed |
| S7 | Competitive swipe summary exists | 2 | 3-5 competitors analyzed |
| S8 | Proof points are evidence-based | 2 | At least 3 proof points with rationale |
| S9 | Target audience is clearly defined | 2 | Demographics + psychographics documented |
| S10 | Brand personality dimensions set | 2 | Aaker dimensions specified |
| S11 | Definition of success is measurable | 1 | Success criteria include metrics |
| S12 | Deliverables expected are listed | 1 | Complete deliverable list provided |

**Category 1 Max: 20 points**

### Category 2: Naming Quality (15 points)

*Source: `02_namer_naming-pack.md`*

| # | Item | Points | Check |
|---|------|--------|-------|
| N1 | Strategy summary references locked Strategy Pack | 2 | Links to Phase 1 deliverables |
| N2 | 5 name options provided | 2 | Safe, Strong (3), Wildcard categories |
| N3 | Each name has category assigned | 1 | Safe/Strong/Wildcard classification |
| N4 | Each name has meaning/rationale | 2 | Etymology or strategic reasoning |
| N5 | Archetype fit assessed for each | 2 | Alignment with locked archetype |
| N6 | Vibe keywords provided | 1 | Descriptive keywords for each name |
| N7 | Domain/handle ideas suggested | 1 | Availability considerations noted |
| N8 | Shortlist has primary selection | 2 | Clear primary name chosen |
| N9 | Shortlist has secondary backup | 2 | Secondary option documented |

**Category 2 Max: 15 points**

### Category 3: Visual Consistency (25 points)

*Sources: `03_visual-director_logo-pack.md`, `03_visual-director_fal-ai-runs.json`, `generated-images/`*

| # | Item | Points | Check |
|---|------|--------|-------|
| V1 | 5 logo directions provided | 3 | Complete set of concepts |
| V2 | Each direction has concept description | 2 | Shape language documented |
| V3 | Typography specified per direction | 2 | Font choices documented |
| V4 | Color approach defined per direction | 2 | Color strategy for each |
| V5 | Do/Don't rules specified | 2 | Usage guidelines per direction |
| V6 | Logo works at 24px (favicon) | 2 | Scalability verified |
| V7 | Logo works in 1-color | 2 | Monochrome version exists |
| V8 | Visual aligns with archetype | 2 | Caregiver/Explorer/etc. reflected |
| V9 | Color palette matches brand spec | 2 | HEX values align |
| V10 | WCAG 2.1 AA contrast ratios met | 2 | 4.5:1 text, 3:1 large text |
| V11 | Logo legibility at small sizes | 2 | Actual PNG/JPG analysis |
| V12 | Visual consistency across directions | 1 | Cohesive visual language |
| V13 | Typography legibility in overlays | 1 | Text readable on images |
| V14 | Production readiness (no artifacts) | 1 | Clean, sharp renders |
| V15 | White/background space intentional | 1 | Proper spacing observed |

**Category 3 Max: 25 points**

### Category 4: Brand Kit Completeness (25 points)

*Source: `04_brand-kit-builder_brand-kit.md`*

| # | Item | Points | Check |
|---|------|--------|-------|
| K1 | All 4 input files validated | 3 | Checkmarks in Section 0 |
| K2 | Section 1: Logo specifications complete | 2 | Clear space, min sizes, variants |
| K3 | Section 2: Color system documented | 3 | HEX, RGB, CMYK, Pantone |
| K4 | Section 3: Typography system complete | 3 | Primary, secondary, scale |
| K5 | Section 4: Visual language defined | 2 | Imagery, patterns, textures |
| K6 | Section 5: Voice & tone documented | 2 | Writing guidelines |
| K7 | Section 6: Application examples | 3 | 6+ applications shown |
| K8 | Section 7: Do/Don't rules | 2 | Clear usage guidelines |
| K9 | Section 8: File delivery specs | 2 | Formats, naming, organization |
| K10 | Section 9: Brand story present | 1 | Narrative component |
| K11 | Section 10: Asset library cataloged | 1 | Complete file inventory |
| K12 | Primary color specified | 1 | Main brand color defined |
| K13 | Secondary colors (2-3) specified | 1 | Supporting palette |
| K14 | Accent color specified | 1 | Highlight color |
| K15 | Neutral palette defined | 1 | Grays, blacks, whites |

**Category 4 Max: 25 points**

### Category 5: Cross-Reference Accuracy (15 points)

*Cross-phase validation*

| # | Item | Points | Check |
|---|------|--------|-------|
| C1 | Strategy → Naming alignment | 2 | Naming reflects strategy |
| C2 | Strategy → Visual alignment | 2 | Visuals match archetype |
| C3 | Naming → Visual alignment | 2 | Logo works with name |
| C4 | All phases reference same archetype | 2 | Consistent archetype throughout |
| C5 | Brand Kit references Strategy Pack | 2 | Links to Phase 1 |
| C6 | Brand Kit references Naming Pack | 2 | Links to Phase 2 |
| C7 | Brand Kit references Logo Pack | 2 | Links to Phase 3 |
| C8 | No contradictions between phases | 2 | All phases agree |
| C9 | File naming follows convention | 1 | `XX_agent_description.ext` |

**Category 5 Max: 15 points**

---

## Output Format

### Markdown Report: `05_qa-reviewer_qa-report.md`

```markdown
# QA Report — [Brand Name]

## Summary
- **Date:** [timestamp]
- **Reviewer:** Munari
- **Overall Score:** [X]/100 ([X]%) — [X]/60 items passed
- **Result:** [PASS / CONDITIONAL / FAIL]

## Scores by Category

| Category | Weight | Score | Items Passed | Percentage |
|----------|--------|-------|--------------|------------|
| Strategy Completeness | 20% | [X]/20 | [X]/12 | [X]% |
| Naming Quality | 15% | [X]/15 | [X]/9 | [X]% |
| Visual Consistency | 25% | [X]/25 | [X]/15 | [X]% |
| Brand Kit Completeness | 25% | [X]/25 | [X]/15 | [X]% |
| Cross-Reference Accuracy | 15% | [X]/15 | [X]/9 | [X]% |
| **TOTAL** | **100%** | **[X]/100** | **[X]/60** | **[X]%** |

## Critical Issues (Must Fix for Pass)
<!-- Items that caused score < 85% -->
1. **[Category-Item]** — [Description] — [Location] — [Fix required]

## Major Issues (Should Fix)
1. **[Category-Item]** — [Description] — [Recommended fix]

## Minor Issues (Nice to Fix)
1. **[Category-Item]** — [Description] — [Recommended fix]

## Positive Observations
1. **[Observation]**

## Next Steps
- [Action item based on result]
```

### JSON Report: `05_qa-reviewer_qa-scores.json`

```json
{
  "brand": "[brand-name]",
  "date": "[ISO-8601 timestamp]",
  "reviewer": "munari",
  "group_id": "allura-team-durham",
  "overall": {
    "score": [0-100],
    "items_passed": [0-60],
    "items_total": 60,
    "percentage": [0-100],
    "result": "PASS|CONDITIONAL|FAIL"
  },
  "categories": {
    "strategy": {
      "weight": 0.20,
      "max_points": 20,
      "earned_points": [0-20],
      "items_passed": [0-12],
      "items_total": 12,
      "percentage": [0-100],
      "items": {
        "S1": { "passed": true|false, "points": 2, "evidence": "..." },
        "S2": { "passed": true|false, "points": 2, "evidence": "..." },
        "...": "..."
      }
    },
    "naming": { "...": "..." },
    "visual": { "...": "..." },
    "brand_kit": { "...": "..." },
    "cross_reference": { "...": "..." }
  },
  "critical_issues": [...],
  "major_issues": [...],
  "minor_issues": [...],
  "recommendations": [...]
}
```

---

## Execution

### Automated Scoring

Run the scoring script:

```bash
node .claude/skills/brand-consistency-review/score-checklist.js [brand-slug]
```

### Manual Review Override

Munari can override automated scores with justification:
- Add `manual_override: true` to JSON
- Document reason in `override_reason` field
- Log to Allura Brain as `QA_OVERRIDE` event

---

## Allura Brain Integration

### Read Operations
- Brand truth from `06_allura-memory_brand-truth.json`
- Phase deliverables from `clients/{brand}/`

### Write Operations
- `QA_SCORED` event: Score calculation complete
- `QA_PASSED` event: Brand achieved ≥85%
- `QA_FAILED` event: Brand below threshold
- `QA_CONDITIONAL` event: Brand 70-84%, fixes required
- `LESSON_LEARNED` event: Recurring issues identified

### Event Schema

```json
{
  "agent_id": "munari",
  "group_id": "allura-team-durham",
  "event_type": "QA_SCORED|QA_PASSED|QA_FAILED|QA_CONDITIONAL",
  "payload": {
    "brand": "[brand-slug]",
    "score": [0-100],
    "items_passed": [0-60],
    "result": "PASS|CONDITIONAL|FAIL",
    "critical_issues_count": [N],
    "report_path": "clients/[brand]/05_qa-reviewer_qa-report.md",
    "json_path": "clients/[brand]/05_qa-reviewer_qa-scores.json"
  }
}
```

---

## Telemetry

Every invocation of this skill MUST log telemetry to the `events` table via MCP_DOCKER.
See `docs/TELEMETRY_SCHEMA.md` for the full schema.

### On Start

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_USED', 'allura-team-durham', 'munari', 'completed',
    '{\"skill_name\": \"brand-consistency-review\", \"phase\": 5, \"trigger\": \"<trigger phrase>\", \"prerequisites_met\": true}'"
})
```

### On Completion

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SKILL_COMPLETED', 'allura-team-durham', 'munari', 'completed',
    '{\"skill_name\": \"brand-consistency-review\", \"phase\": 5, \"duration_sec\": <N>, \"output_artifact_path\": \"<path>\", \"tool_calls\": [<tools used>]}'"
})
```

### On Failure

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, error_message, metadata",
  values: "'SKILL_FAILED', 'allura-team-durham', 'munari', 'failed', '<error>',
    '{\"skill_name\": \"brand-consistency-review\", \"phase\": 5, \"missing_prerequisites\": [<items>], \"fallback_used\": false}'"
})
```

**Never skip telemetry logging.** If MCP_DOCKER_insert_data fails, log an error to the user and continue.

---

## Invariants

- `group_id = 'allura-team-durham'` for all events
- `agent_id = 'munari'` for all QA activities
- **85% is the hard pass gate** — no exceptions
- QA is **READ-ONLY** — flags issues but never implements fixes
- Fixes route back to producing agents (Aaker, Ogilvy, Glaser, Rand)
- All scores must be evidence-based with file references
- JSON and Markdown reports must be generated together