---
name: client-brief-intake
description: Client brief intake and qualification workflow for Team Durham. Use when agent_id=kotler runs CA (Create Architecture) command or when onboarding a new client. Validates brief completeness, qualifies fit, and produces a structured brief document that gates the entire pipeline. Phase 0 of the brand production pipeline.
---

# Client Brief Intake Skill

> **Executor:** @Kotler (Brand Orchestrator)
> **Type:** Phase 0 — Intent Gate
> **Pipeline Position:** Before all other phases
> **group_id:** `allura-team-durham`

---

## Purpose

A brand is only as good as the brief it's built on. Garbage in, garbage out. This skill structures, validates, and qualifies client briefs before any creative work begins. STP before everything.

---

## The Brief Structure

### Section 1: Business Fundamentals

| Field | Required | Notes |
|-------|----------|-------|
| Legal entity name | ✅ | Full legal name |
| Brand/project name | ✅ | Name to be branded |
| Industry/category | ✅ | What business are they in? |
| Business model | ✅ | How do they make money? |
| Company age | ✅ | Startup / growth / established |
| Team size | ⬜ | Helps set tone |
| Current revenue range | ⬜ | Influences positioning |
| Geographic scope | ✅ | Local / regional / national / global |

### Section 2: Target Audience (The "T" in STP)

| Field | Required | Notes |
|-------|----------|-------|
| Primary audience description | ✅ | Who is this brand for? |
| Demographics | ✅ | Age, income, education, location |
| Psychographics | ✅ | Values, lifestyle, aspirations |
| Pain points | ✅ | What problem does the audience have? |
| Current brand relationship | ⬜ | Are they aware? Engaged? Loyal? |
| Secondary audience | ⬜ | Who else matters? |

### Section 3: Competitive Landscape (The "F" in STP)

| Field | Required | Notes |
|-------|----------|-------|
| Top 3 competitors | ✅ | Named competitors in the same space |
| What competitors do well | ✅ | Honest assessment |
| What competitors do poorly | ✅ | Where's the opportunity? |
| Category visual conventions | ⬜ | What does this category look like? |
| Positioning white space | ⬜ | Where is the gap? |

### Section 4: Brand Vision (The "P" in STP — Positioning)

| Field | Required | Notes |
|-------|----------|-------|
| Brand promise | ✅ | What does the brand deliver? (1 sentence) |
| Point of difference | ✅ | Why choose this brand over others? |
| Reason to believe | ✅ | Evidence that the promise is real |
| Brand personality (3 adjectives) | ✅ | If the brand were a person... |
| Brand aspiration (3 years) | ✅ | Where should the brand be in 3 years? |
| Brand risks | ⬜ | What could go wrong? |

### Section 5: Project Scope

| Field | Required | Notes |
|-------|----------|-------|
| Deliverables requested | ✅ | What assets are needed? |
| Timeline | ✅ | When is this needed? |
| Budget range | ⬜ | Influences scope |
| Stakeholders | ✅ | Who approves? |
| Decision process | ✅ | How are decisions made? |
| Success criteria | ✅ | How will success be measured? |

### Section 6: Existing Assets & Constraints

| Field | Required | Notes |
|-------|----------|-------|
| Existing brand elements | ✅ | What exists already? |
| Must-keep elements | ⬜ | Any sacred cows? |
| Visual references | ⬜ | Brands they like or dislike |
| Tone references | ⬜ | Brands whose voice they admire |
| Hard constraints | ✅ | Legal, technical, cultural restrictions |
| Must-avoid list | ⬜ | Things they explicitly don't want |

---

## Qualification Gate

Before accepting a brief into the pipeline, it MUST pass this gate:

### Green Light (Proceed)

- [ ] Business name, category, and business model are clear
- [ ] Target audience is specific (not "everyone")
- [ ] At least 3 competitors are named
- [ ] Brand promise is articulated (even if rough)
- [ ] A point of difference exists (even if needs refinement)
- [ ] Deliverables are listed
- [ ] Timeline and stakeholders are defined
- [ ] No fundamental contradiction in the brief

**Score: 8/8 → GREEN — proceed to pipeline**

### Yellow Light (Proceed with Conditions)

- [ ] Missing up to 2 required fields
- [ ] Target audience is somewhat vague
- [ ] Competitor list is incomplete
- [ ] Brand promise needs significant refinement

**Score: 5-7/8 → YELLOW — proceed but @Aaker must refine gaps before Phase 1**

### Red Light (Do Not Proceed)

- [ ] Missing 3+ required fields
- [ ] Target audience is "everyone"
- [ ] No competitors identified
- [ ] No point of difference
- [ ] Fundamental contradictions in the brief
- [ ] Client cannot define success criteria

**Score: Below 5/8 → RED — return brief to client with specific questions**

---

## Intake Workflow

### Step 1: Receive Brief

Briefs arrive in 3 forms:

1. **Structured brief document** — Client has provided a complete brief
2. **Conversation** — Client has described their needs verbally
3. **Minimal** — Client has only a brand name

**For structured briefs:** Validate against the Section 1-6 template above.
**For conversations:** Extract information into the template, flag gaps.
**For minimal briefs:** Use the guided interview below.

### Step 2: Guided Interview (for minimal briefs)

If the brief is minimal, run this structured interview:

```
INTAKE INTERVIEW
================

1. Tell me about your business. What do you do, and who do you do it for?
2. If your brand were a person at a party, how would you describe them?
3. Who are your top 3 competitors? What do they do better than you? What do you do better than them?
4. What's the ONE thing you want people to remember about your brand?
5. What does success look like for this project? How will we know it worked?
6. Are there any brands whose visual identity you admire? Any you dislike?
7. Is there anything we absolutely must NOT do? Any constraints?
8. When do you need this, and who will be making decisions?
```

Map every answer to the brief template sections.

### Step 3: Validate & Score

Run the Qualification Gate checklist. Calculate score. Assign traffic light.

### Step 4: Write the Brief Document

```markdown
# Client Brief

**Project:** [brand name]
**Date:** YYYY-MM-DD
**Brief Status:** 🟢 GREEN / 🟡 YELLOW / 🔴 RED
**Qualification Score:** [N]/8
**Assigned Strategist:** @Aaker

---

## 1. Business Fundamentals
[Populated from intake]

## 2. Target Audience
[Populated from intake]

## 3. Competitive Landscape
[Populated from intake — delegate to @Tufte for deep analysis]

## 4. Brand Vision
[Populated from intake — may need @Aaker refinement]

## 5. Project Scope
[Populated from intake]

## 6. Existing Assets & Constraints
[Populated from intake]

---

## Qualification Gate

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Clear business identity | ✅/⬜ | — |
| 2 | Specific target audience | ✅/⬜ | — |
| 3 | 3+ competitors named | ✅/⬜ | — |
| 4 | Brand promise articulated | ✅/⬜ | — |
| 5 | Point of difference exists | ✅/⬜ | — |
| 6 | Deliverables listed | ✅/⬜ | — |
| 7 | Timeline & stakeholders | ✅/⬜ | — |
| 8 | No contradictions | ✅/⬜ | — |

**Traffic Light:** 🟢/🟡/🔴
**Next Step:** [what happens next based on traffic light]
```

### Step 5: Log & Route

```sql
INSERT INTO events (event_type, group_id, agent_id, status, metadata)
VALUES ('DDR_CREATED', 'allura-team-durham', 'kotler', 'completed',
  '{"decision": "brief_intake_complete", "brand_name": "...", "qualification_score": N, "traffic_light": "GREEN/YELLOW/RED"}');
```

Write brief to: `clients/{client-slug}/00-intent/client-brief.md`

**Routing:**
- 🟢 GREEN → Proceed to Phase 1 (@Aaker for Strategy Pack)
- 🟡 YELLOW → @Aaker refines gaps, then proceed
- 🔴 RED → Return brief to client with specific questions

---

## Allura Brain Integration

- Check events table for any prior work on this client before starting
- Write `DDR_CREATED` for the brief intake decision
- Write `TASK_COMPLETE` when brief is qualified and routed
- `group_id`: `allura-team-durham`
- `agent_id`: `kotler`