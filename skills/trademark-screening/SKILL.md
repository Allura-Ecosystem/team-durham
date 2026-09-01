---
name: trademark-screening
description: "Trademark conflict screening and linguistic analysis for brand names. Trigger when screening trademarks, checking name availability, or evaluating legal risks. Use when agent_id=scout runs TS (Trademark Screening) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Trademark Screening

> **Phase:** 2 (Naming)
> **Executor:** @Scout (recon) with @Tufte validation
> **group_id:** `allura-team-durham`

---

## Purpose

Perform automated availability screening for brand names during the Naming Pack phase. Currently, the Naming Pack requires "availability check (domain, trademark)" but no skill actually performs these lookups. This skill operationalizes that requirement.

---

## Trigger Conditions

- Brand strategist or copywriter generates name candidates
- Client requests trademark validation on preferred name
- Naming Pack (Phase 2) requires completion before Visual Direction begins

---

## Workflow

### 1. Domain Availability Check
For each name candidate:
- Check `.com`, `.io`, `.co` availability via web search
- Record: Available / Taken / Parked / Active site
- Flag premium/premium-reserved domains

### 2. Social Handle Availability
For each name candidate:
- Check Twitter/X, Instagram, LinkedIn, TikTok handle availability
- Record: Available / Taken (active) / Taken (inactive/squatted)

### 3. USPTO Trademark Search
For each name candidate:
- Search USPTO TESS database for live trademarks
- Classify: Clear / Similar exists / Direct conflict
- Note jurisdiction and class of existing marks

### 4. Common Law Search
- Web search for unregistered uses of the name
- Check industry-specific usage
- Flag potential conflicts even without formal registration

### 5. Risk Assessment
| Risk Level | Criteria | Action |
|-----------|----------|--------|
| 🟢 **Clear** | No conflicts found | Proceed |
| 🟡 **Low Risk** | Similar marks in unrelated classes | Proceed with legal review |
| 🟠 **Medium Risk** | Similar marks in adjacent classes | Recommend alternative or legal opinion |
| 🔴 **High Risk** | Direct conflict or same class | Do not proceed |

---

## Output

```markdown
# Trademark Screening Report — [Brand Name Candidates]

## Executive Summary
| Name | Domain | Social | USPTO | Common Law | Overall Risk |
|------|--------|--------|-------|------------|-------------|
| Name 1 | ✅ | ⚠️ | ✅ | ✅ | 🟢 Clear |
| Name 2 | ❌ | ✅ | ⚠️ | ✅ | 🟠 Medium |
| Name 3 | ✅ | ✅ | ❌ | ❌ | 🔴 High |

## Detailed Results

### Name 1: [Name]
- **Domain:** [name].com — ✅ Available / ❌ Taken by [owner]
- **Social:** @name — ✅ Available on [platforms]
- **USPTO:** No live marks found in relevant classes
- **Common Law:** [findings]
- **Recommendation:** Proceed with registration application

### Name 2: [Name]
[Same format]

## Recommended Action
- **Primary:** [Name] — lowest risk profile
- **Secondary:** [Name] — acceptable with legal review
- **Avoid:** [Name] — high risk of infringement

## Disclaimer
This screening provides preliminary risk assessment only. It does not constitute legal advice. Engage a trademark attorney for formal clearance.
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- Scout performs searches; Tufte validates findings
- **NOT legal advice** — always include disclaimer
- Screen early (Phase 2) before visual investment (Phase 3)
- Log results to PostgreSQL as `TRADEMARK_SCREENED`