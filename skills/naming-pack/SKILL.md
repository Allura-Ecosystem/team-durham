---
name: naming-pack
description: Brand naming workflow for Team Durham. Phase 2 of the brand production pipeline. Generates 5 naming directions with linguistic analysis, trademark screening protocol, and strategic evaluation. Bridges Strategy Pack to Visual Direction. Use when creating or evaluating brand names after Strategy Pack is locked.
---

# Naming Pack Skill

> **Executor:** @Kotler (orchestrating) with @Aaker (strategy alignment) and @Ogilvy (linguistic quality)
> **Type:** Phase 2 — Naming
> **Pipeline Position:** After Strategy Pack, before Visual Direction
> **Prerequisite:** Locked Strategy Pack with archetype + positioning
> **group_id:** `allura-team-durham`

---

## Purpose

A name is the first creative act of branding. It must embody the archetype, support the positioning, and be legally defensible. This skill produces 5 naming directions — each grounded in strategy, not preference.

---

## Naming Principles

1. **The name serves the brand, not the founder's ego.** Personal preference is not a strategy.
2. **Names are not logos.** A name doesn't need to describe; it needs to evoke.
3. **Distinctiveness beats descriptiveness.** "Google" > "SearchEngineCompany"
4. **Sound matters as much as meaning.** The name must sound right when spoken aloud.
5. **The name must work everywhere.** Domain, social, legal, international.

---

## The 5 Naming Directions

### Direction 1: Archetype-True Name

The name that most purely embodies the brand archetype. If you're a Hero brand, this name sounds strong and decisive. If you're a Caregiver, it sounds warm and protective.

**Technique:** Free association from archetype personality traits → filter for availability → refine for sonority.

### Direction 2: Metaphorical Name

A name that uses metaphor, analogy, or symbolism to suggest the brand promise without stating it directly. This is often the most memorable direction.

**Technique:** List the brand's core promise → find metaphors that embody it → test for cultural associations.

### Direction 3: Invented/Coined Name

A name that doesn't exist in the dictionary but is constructed from meaningful morphemes. Highly protectable, often the strongest for trademark.

**Technique:** Identify key morphemes from archetype + promise → combine → test for pronunciation and unintended meanings → assess phonetics.

### Direction 4: Descriptive-Evocative Name

A name that uses real words but in an unexpected combination or context. Balances descriptiveness with distinctiveness.

**Technique:** List words associated with the brand territory → combine in unusual pairings → test for clarity and memorability.

### Direction 5: Aspirational-Gap Name

A name that occupies the white space between what the brand is and what it aspires to become. The name stretches the brand forward without breaking it.

**Technique:** Identify the aspiration gap (where the brand is vs. where it wants to be) → find names that bridge that gap → test for credibility.

---

## Workflow

### Step 1: Strategic Foundation

Load the locked Strategy Pack:

```sql
SELECT * FROM events
WHERE agent_id = 'aaker'
  AND group_id = 'allura-team-durham'
  AND event_type IN ('DESIGN_DECISION', 'DDR_CREATED')
ORDER BY created_at DESC LIMIT 5;
```

Extract:
- Brand archetype (primary + secondary)
- Positioning statement
- Brand promise
- Personality dimensions
- Point of difference
- Target audience

### Step 2: Generate Names for Each Direction

For each of the 5 directions, generate a **primary name** and **2 alternates**:

```markdown
## Direction [N]: [Direction Name]

### Primary: [NAME]

**Rationale:** [2-3 sentences connecting name to archetype, positioning, and promise]
**Archetype alignment:** [How it serves the archetype]
**Phonetics:** [How it sounds — hard/soft, long/short, memorable qualities]
**Associations:** [What it evokes — intended and potential unintended]
**Legal note:** [Preliminary assessment - NOT legal advice]

### Alternate A: [NAME]
[Rationale, 1 sentence]

### Alternate B: [NAME]
[Rationale, 1 sentence]
```

### Step 3: Linguistic Analysis

For each primary name (5 total), evaluate:

| Criterion | Score (1-5) | Notes |
|-----------|-------------|-------|
| **Memorability** | — | How easily is it recalled? |
| **Pronunciation** | — | Can anyone say it correctly on first read? |
| **Spelling** | — | Can anyone spell it after hearing it? |
| **Brevity** | — | Shorter = better (ideally 2-3 syllables) |
| **Distinctiveness** | — | Does it stand out in the category? |
| **International** | — | Does it work across target languages? |
| **Negative associations** | — | Any unwanted connotations? |
| **Digital viability** | — | Domain, social handle availability |

**Weighted scoring:**
- Memorability: 25%
- Distinctiveness: 25%
- Pronunciation: 15%
- Brevity: 10%
- International: 10%
- Digital viability: 10%
- Spelling: 5%

### Step 4: Trademark Pre-Screening Protocol

**DISCLAIMER:** This is preliminary screening only. It does NOT constitute legal advice. Always consult a trademark attorney for final clearance.

#### Pre-Screening Checklist (per name):

1. **Exact match search**
   - USPTO trademark database (tess.uspto.gov)
   - Search for identical mark in same class
   - Result: Clear / Similar found / Conflict likely

2. **Live mark check**
   - Is the mark active/registered?
   - In what classes?
   - Result: No live mark / Live mark found (note classes)

3. **Common law search**
   - Google search for exact name + industry
   - Result: No usage found / Usage found (note details)

4. **Domain availability**
   - Is the .com available?
   - If not, what's the closest available?
   - Result: Available / Taken (note alternatives)

5. **Social handle availability**
   - Check major platforms (Instagram, X, LinkedIn)
   - Result: Available / Taken (note alternatives)

```markdown
## Pre-Screening: [NAME]

| Check | Result | Notes |
|-------|--------|-------|
| USPTO exact match | Clear/Similar/Conflict | — |
| Live mark (same class) | Clear/Found | — |
| Common law (Google) | Clear/Found | — |
| .com domain | Available/Taken | — |
| Social handles | Available/Taken | — |
| **Overall pre-screen** | 🟢/🟡/🔴 | — |

🟢 = No conflicts identified, proceed with confidence
🟡 = Potential conflicts, needs legal review
🔴 = Conflicts likely, strongly consider alternatives
```

### Step 5: Evaluation Matrix

Rank all 5 primary names:

```markdown
# Naming Evaluation Matrix

| Name | Archetype (25%) | Memorable (25%) | Distinctive (15%) | Phonetic (10%) | International (10%) | Digital (10%) | Legal (5%) | **Weighted Total** |
|------|---------|-----------|------------|---------|--------------|---------|--------|---------------|
| [1]  | —/5     | —/5       | —/5        | —/5     | —/5          | —/5     | —/5    | —%            |
| [2]  | —/5     | —/5       | —/5        | —/5     | —/5          | —/5     | —/5    | —%            |
| [3]  | —/5     | —/5       | —/5        | —/5     | —/5          | —/5     | —/5    | —%            |
| [4]  | —/5     | —/5       | —/5        | —/5     | —/5          | —/5     | —/5    | —%            |
| [5]  | —/5     | —/5       | —/5        | —/5     | —/5          | —/5     | —/5    | —%            |

## Recommendation

**Primary:** [name] — [rationale]
**Strong alternate:** [name] — [rationale]
**Wildcard:** [name] — [rationale]
```

### Step 6: Write the Naming Pack

```markdown
# Naming Pack

**Project:** [brand name or project codename]
**Date:** YYYY-MM-DD
**Based on:** Strategy Pack v[version], dated [date]
**Status:** Draft / Approved

## 1. Strategic Foundation
[Summary of archetype, positioning, promise from Strategy Pack]

## 2. Direction 1: Archetype-True — [NAME]
[Full analysis]

## 3. Direction 2: Metaphorical — [NAME]
[Full analysis]

## 4. Direction 3: Invented/Coined — [NAME]
[Full analysis]

## 5. Direction 4: Descriptive-Evocative — [NAME]
[Full analysis]

## 6. Direction 5: Aspirational-Gap — [NAME]
[Full analysis]

## 7. Evaluation Matrix
[Scoring table]

## 8. Pre-Screening Results
[Legal pre-screening for all 5 names]

## 9. Recommendation
[Top 3 with rationale]

## 10. Next Steps
- [ ] Client selects direction
- [ ] Legal trademark clearance (attorney)
- [ ] Domain registration
- [ ] Social handle registration
- [ ] Naming Pack locked → proceed to Visual Direction (Phase 3)
```

Write to: `clients/{client-slug}/02-naming/naming-pack.md`

---

## Allura Brain Integration

- Read Strategy Pack events before starting (naming must align to locked strategy)
- Write `DESIGN_DECISION` for each naming direction
- Write `DDR_CREATED` when a name direction is locked
- `group_id`: `allura-team-durham`
- `agent_id`: `kotler`