---
name: brand-audit-existing
description: "Pre-phase 0 brand audit for existing brands. Trigger when auditing current brand assets, assessing existing brand health, or benchmarking before rebrand. Use when agent_id=tufte runs BA (Brand Audit) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Brand Audit — Existing Brand Assessment

> **Phase:** 0 (Pre-Phase 0, before Intent Gate)
> **Executor:** @Tufte (data-analyst)
> **group_id:** `allura-team-durham`

---

## Purpose

Assess a client's existing brand assets, identity, and market position BEFORE starting the pipeline. Currently Phase 0 assumes a blank slate. Many clients come with existing brands that need auditing first — what works, what's broken, what must be preserved.

---

## Trigger Conditions

- Client has an existing brand (logo, website, social presence)
- Client says "refresh" or "rebrand" (not "create from scratch")
- Client provides existing brand assets for review
- Competitive landscape shift requires repositioning

---

## Workflow

### 1. Asset Inventory
- Catalog all existing brand assets (logo files, color codes, fonts, imagery)
- Record current usage across touchpoints (web, print, social, packaging)
- Document file formats and quality

### 2. Visual Identity Assessment
| Dimension | Evaluate |
|-----------|----------|
| **Logo** | Legibility, scalability, versatility, age |
| **Colors** | Accessibility, differentiation, consistency |
| **Typography** | Readability, personality fit, web readiness |
| **Imagery** | Quality, style consistency, strategic alignment |

### 3. Market Position Assessment
- Current positioning statement (explicit or inferred)
- Perceived personality (compare to intended)
- Competitive standing in market
- Audience perception gaps

### 4. Consistency Audit
- Cross-channel consistency score (0-100)
- Touchpoint coverage (web, social, print, packaging, environmental)
- Brand guideline compliance (if guidelines exist)

### 5. Preservation Recommendations
- **Must Keep:** Elements with high equity/recognition
- **Can Evolve:** Elements that need modernization
- **Must Change:** Elements that contradict strategy
- **Missing:** Gaps that need new creation

---

## Output

```markdown
# Brand Audit Report — [Client Name]

## Executive Summary
- **Audit Date:** [date]
- **Overall Brand Health:** [X]/100
- **Recommendation:** [Preserve / Evolve / Replace]

## Asset Inventory
| Asset | Format | Quality | Status |
|-------|--------|---------|--------|
| Logo | PNG, SVG | Production | Keep |
| Colors | HEX only | Incomplete | Redefine |

## Visual Identity Score: [X]/100
- Logo: [X]/25
- Colors: [X]/25
- Typography: [X]/25
- Imagery: [X]/25

## Market Position Score: [X]/100
- Positioning clarity: [X]/25
- Personality alignment: [X]/25
- Competitive differentiation: [X]/25
- Audience recognition: [X]/25

## Consistency Score: [X]/100
- Cross-channel consistency: [X]/50
- Guideline compliance: [X]/50

## Preservation Matrix
| Element | Verdict | Rationale |
|---------|---------|-----------|
| [Brand color] | MUST KEEP | High recognition equity |
| [Old logo] | MUST CHANGE | Contradicts new strategy |

## Recommended Pipeline Entry Point
- **Phase 0** (fresh brief) — if brand is broken
- **Phase 1** (strategy) — if brand has no strategic foundation
- **Phase 3** (visual) — if strategy is sound but visuals are outdated
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- Auditor is @Tufte — evidence-based, no creative decisions
- Audit **does not produce creative work** — only assessment
- Findings gate into Phase 0 or skip phases based on preservation matrix
- All findings logged to PostgreSQL as `BRAND_AUDIT_COMPLETE`