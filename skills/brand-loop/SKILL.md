---
name: brand-loop
description: "Run bounded autonomous Team Durham brand work."
---

# Brand-Loop Skill

Brand-loop is Team Durham's bounded autonomous execution mode. It follows the
**same feedback-cycle contract as loopy** (observe → choose → act → verify →
record → stop) but uses Durham brand agents instead of RAM engineering agents.

## Why a Durham-Native Loop (Not loopy-the-skill)

Loopy-the-skill is engineering-coded: its examples are CI, tests, refactors,
and code review. Brand work has different agents, different evidence (visual
QA, taste gates, brand compliance), and a different HITL boundary (Munari/Rubin
must approve before anything ships). Brand-loop adopts loopy's **contract** —
the feedback cycle, terminal states, and bounded persistence — without
importing loopy's engineering domain.

## Layering

```
brand-loop (META)    → finds or crafts the right brand loop
  ↓ hands off a bounded brand task
Durham agents         → execute the brand work, return evidence
  ↓ writes outcome
Allura Brain          → canonical memory (group_id="allura-team-durham")
```

Brand-loop is the orchestrator, not a second execution engine. It delegates to
Durham agents for execution and Allura Brain for memory.

## The Contract — 6-Step Feedback Cycle

1. **Observe** — Scout-recon (Durham) hydrates context + `allura-brain_memory_search`
   with `group_id: "allura-team-durham"` for prior brand decisions, locked
   strategy, and brand-kit state.
2. **Choose** — Brand-orchestrator routes to the specialist: Aaker (strategy),
   Kotler (positioning), Glaser (visual direction), Ogilvy (copy), Rand
   (identity), Munari (QA), Rubin (taste gate).
3. **Act** — The routed specialist executes **one bounded brand slice** — the
   smallest reversible brand change (a copy pack, a visual direction, a QA
   report).
4. **Verify** — Run an **explicit brand check**: Munari QA gate (brand
   compliance), Rubin taste gate (editorial taste), or a brand-kit consistency
   check. "Looks good" is not acceptable — cite the rule or rubric.
5. **Record** — `allura-brain_memory_add` writes an outcome trace with
   `group_id: "allura-team-durham"`, `user_id: "brand-auto"`,
   `agent_id: "brand-orchestrator"`.
6. **Repeat or Stop** — Continue only while progress is measurable and the
   iteration budget remains. Otherwise enter a named terminal state.

## Loading and Token Budget

- Scout ContextPacket: maximum 700 output tokens.
- Default run: 12,000 combined input/output tokens and 5 iterations.
- Hard iteration maximum: 8.
- Route using the lightweight roster, then lazy-load one specialist plus 1–3
  relevant skills. Do not hydrate the complete Durham package.
- Full Figma/Penpot references and Impeccable scripts load only when the routed
  task explicitly needs them.
- Token or iteration exhaustion is terminal state `exhausted`, not success.

## Terminal States

Every brand-loop ends in exactly one. **Never report an error or exhausted
budget as success.**

| State | Meaning |
|-------|---------|
| **success** | Brand goal achieved, QA + taste gates passed |
| **clean no-op** | Inspected brand state, nothing needed, no change made |
| **blocked** | Hard blocker — missing brief, locked strategy unavailable, missing asset |
| **approval-required** | Next action ships brand externally and needs HITL |
| **exhausted** | Iteration budget consumed without convergence |
| **stagnated** | No measurable progress across N iterations |

## Hard Stops (Brand-Loop Halts Immediately)

1. **Max iterations exceeded** — default 8 (brand work is iterative but bounded)
2. **Governance violation** — any brand-policy or Allura governance gate failure
3. **Missing authority** — action requires permissions the agent does not have
4. **Ship-without-approval** — publishing brand externally, deploying brand kit,
   or sending client-facing material requires explicit HITL approval

## HITL Taste Gate (Non-Negotiable)

Brand-loop **writes traces only** and **does not ship brand without approval**.
Munari (QA) and Rubin (taste) are the HITL gates. Auto-mode does not:
- Publish brand kits externally
- Send client-facing material
- Promote brand decisions to semantic memory (HITL curator only)
- Override locked brand strategy without human approval

Brand-loop is bounded autonomy: it never stops without proof, escalation, or
a governance blocker — but it never crosses a taste gate without a human.

## Brain Protocol

**Before (Observe):**
```
allura-brain_memory_search({
  query: "<task> brand strategy locked decisions brand-kit",
  group_id: "allura-team-durham",
  limit: 10
})
```

**After (Record):**
```
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "brand-auto",
  content: "BRAND_LOOP_OUTCOME: <task>. Terminal state: <state>. Specialist: <agent>. Evidence: <QA/taste result>",
  metadata: { agent_id: "brand-orchestrator", source: "conversation" }
})
```

## Validation Requirement

Every brand-loop run must pass an **explicit brand check** before declaring
success. Acceptable forms:
- Munari QA gate (brand compliance rubric)
- Rubin taste gate (editorial taste review)
- Brand-kit consistency check (tokens, voice, visual rules)
- A user-supplied brand acceptance criterion

If no check is known, **ask the user**. Do not proceed on assumption. Brand
work that "looks good" without a rubric is a material weakness.

## Graceful Degradation

If Allura Brain is unavailable, brand-loop continues with local context only
and logs to console. It does not pretend hydration happened. Every Brain call
is wrapped in a try/catch that reports degradation, not silence.