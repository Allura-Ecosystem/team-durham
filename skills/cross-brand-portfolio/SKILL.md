---
name: cross-brand-portfolio
description: "Multi-brand portfolio architecture and naming conventions for brand families. Trigger when designing brand portfolios, sub-brands, or naming architecture. Use when agent_id=aaker runs PA (Portfolio Architecture) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Cross-Brand Portfolio Architecture

> **Phase:** 1 (Strategy, extended)
> **Executor:** @Aaker (brand-strategist)
> **group_id:** `allura-team-durham`

---

## Purpose

Manage brand architecture when a client has multiple brands, sub-brands, or product lines. Currently, Team Durham only supports single-brand workflows. This skill extends Strategy Pack (Phase 1) to handle parent/child/sibling brand relationships.

---

## Trigger Conditions

- Client has multiple brands or product lines
- Client mentions "house brand" or "master brand"
- New sub-brand being created under existing parent
- Brand consolidation or portfolio rationalization needed

---

## Architecture Models

| Model | Structure | Example | Best For |
|-------|-----------|---------|----------|
| **Monolithic** | Single brand, no sub-brands | Virgin | Simplicity, maximum equity |
| **Endorsed** | Sub-brand + parent endorsement | Courtyard by Marriott | Balance of distinction + trust |
| **Sub-brand** | Independent sub with parent link | Amazon Prime | Product differentiation |
| **Independent** | Completely separate brands | Procter & Gamble | Market segment isolation |

---

## Workflow

### 1. Portfolio Mapping
- Map all current brands/sub-brands
- Identify relationships (parent→child, sibling)
- Document shared assets (colors, logos, voice)

### 2. Architecture Decision
- Select architecture model
- Define relationship rules (visual, verbal, strategic)
- Set naming conventions across portfolio

### 3. Equity Flow Analysis
| Relationship | Equity Flow | Risk |
|-------------|-----------|------|
| Parent → Child | Trust transfer | Child failure damages parent |
| Child → Parent | Innovation halo | Limited upside |
| Sibling ↔ Sibling | Cross-pollination | Confusion risk |

### 4. Visual System Rules
- Shared elements (must follow parent)
- Flexible elements (sub-brand can customize)
- Forbidden elements (sub-brand cannot change)
- Connection points (how parent brand is shown)

### 5. Voice System Rules
- Shared voice parameters (all brands)
- Adjustable voice dimensions (per sub-brand)
- Prohibited deviations (never violate)

---

## Output

```markdown
# Brand Portfolio Architecture — [Client Name]

## Architecture Model: [Monolithic / Endorsed / Sub-brand / Independent]

## Portfolio Map
```
[Parent Brand]
  ├── [Sub-brand A] (endorsed)
  ├── [Sub-brand B] (endorsed)
  └── [Product Line C] (independent)
```

## Relationship Rules
| Element | Rule | Shared? |
|---------|------|---------|
| Logo mark | Parent mark always present | Yes |
| Primary color | Sub-brands use parent primary | Yes |
| Secondary color | Sub-brands define own | No |
| Voice | Same formality, different enthusiasm | Partial |

## Shared Assets
- Primary color: [Parent HEX]
- Logo mark: [Parent mark file]
- Typography: [Parent primary font]

## Per-Brand Unique Assets
### [Sub-brand A]
- Secondary color: [unique HEX]
- Voice adjustment: [+2 enthusiasm]
- Visual differentiation: [description]

## Naming Convention
- Parent: [Convention]
- Sub-brands: [Convention]
- Products: [Convention]
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- Portfolio decisions **locked before** any individual brand work
- Aaker must approve architecture model before Phase 2
- Every sub-brand still gets its own Strategy Pack
- Parent brand assets take precedence in conflicts