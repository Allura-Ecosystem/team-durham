---
description: "Brand-auto — bounded autonomous brand work. Brand-orchestrator routes to Durham specialists (Aaker/Kotler/Glaser/Ogilvy/Munari/Rubin), QA + taste gates verify, outcome writes to Brain. Does not ship brand without HITL approval."
argument-hint: "[--budget <tokens>] [--max <iterations>] <brand task description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - Skill
  - Task
  - allura-brain__memory_search
  - allura-brain__memory_add
---

# /brand-auto — Bounded Autonomous Brand Execution

Run a brand task from start to finish with bounded autonomy. Brand-orchestrator
routes to the right Durham specialist, the specialist executes one bounded
slice, Munari/Rubin verify, and the outcome writes to Allura Brain.

## When to Use

- You want the Durham team to handle a brand task end-to-end
- The task is well-defined (audit, copy pack, visual direction, QA)
- You trust the team to make non-shipping brand decisions autonomously
- You want the outcome logged to Brain for future brand work

## Layering

```
brand-loop (META)     → finds or crafts the right brand loop
  ↓ hands off a bounded brand task
Durham agents          → execute the brand work, return evidence
  ↓ writes outcome
Allura Brain          → canonical memory (group_id="allura-team-durham")
```

Load the `brand-loop` skill (`skills/brand-loop/SKILL.md`) for the full contract.

## Execution Protocol

### Phase 0: Context Detection

Determine the brand execution environment:

1. **API mode** — called via POST → full autonomous, no UI
2. **Claude auto mode** — user has auto-approval → autonomous non-shipping steps
3. **Interactive** — user is present → DAY_BUILD with auto-approved non-shipping steps

Log to Brain if available:

```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "brand-auto",
  content: "BRAND_AUTO started: <task>",
  metadata: { source: "brand-auto", event_type: "BRAND_AUTO_START" }
})
```

### Phase 1: Scout Recon (Mandatory, Read-Only)

Before any action, dispatch Scout-recon for brand context:

```
Agent(subagent_type: "Explore", prompt: "Scout recon for brand task: <task>. Find locked brand strategy, brand-kit state, existing copy/visual packs, and governance rules. Report file paths and current state.")
```

Scout report informs specialist routing. This step is non-negotiable.

Scout returns a compact ContextPacket capped at 700 output tokens. Load the
lightweight roster first, then only the selected specialist and 1–3 required
skills. Never eagerly load the full Durham catalog, Figma API references, or
Impeccable implementation scripts.

Default budget: 12,000 combined input/output tokens and 5 iterations. Hard
maximum: 8 iterations. Reaching either budget ends as `exhausted`; verification
evidence may not be dropped to fit the budget.

### Phase 2: Specialist Routing

Brand-orchestrator analyzes the task + Scout report to route to the specialist:

| Task Signal | Specialist | Example |
|-------------|------------|---------|
| "strategy", "positioning", "STP" | Aaker / Kotler | New brand brief, positioning review |
| "visual", "logo", "color", "tokens" | Glaser / Rand | Visual direction, identity work |
| "copy", "voice", "messaging", "tagline" | Ogilvy | Copy pack, voice guide, taglines |
| "QA", "compliance", "audit", "consistency" | Munari | Brand compliance audit |
| "taste", "editorial", "review", "refine" | Rubin | Editorial taste gate |
| Multi-phase | Brand-orchestrator | Full pipeline (all specialists) |

Log the routing decision:

```
[BRAND-AUTO] Specialist: Munari (QA audit task)
[BRAND-AUTO] Strategy: single-pass QA audit
```

### Phase 3: Execute One Bounded Slice

The routed specialist executes **one bounded brand slice** — the smallest
reversible brand change:

1. Load the relevant brand context (locked strategy, brand kit, voice rules)
2. Produce one deliverable (QA report, copy pack, visual direction, taste review)
3. Do not ship externally — produce the artifact only

### Phase 4: Brand Verification Gate (Mandatory)

Run an **explicit brand check** before declaring done:

- **Munari QA gate** — brand compliance rubric (tokens, voice, visual rules)
- **Rubin taste gate** — editorial taste review (clarity, concision, voice)
- **Brand-kit consistency check** — does the artifact match locked strategy?

If no check is known, **ask the user**. "Looks good" is not acceptable.

### Phase 5: Destructive / Ship Gate

Even in brand-auto mode, STOP for:

- Publishing brand kit externally
- Sending client-facing material
- Changing locked brand strategy or positioning
- Modifying brand governance rules or agent definitions
- Deleting brand assets

Surface the action, explain the risk, and wait for explicit approval. This is
the only pause point in brand-auto mode.

### Phase 6: Completion

1. Run final brand verification (Munari QA + Rubin taste if applicable)
2. Log outcome to Brain:

```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "brand-auto",
  content: "BRAND_LOOP_OUTCOME: <task>. Terminal state: <success|clean no-op|blocked|approval-required|exhausted|stagnated>. Specialist: <agent>. Evidence: <QA/taste result>",
  metadata: { source: "brand-auto", event_type: "BRAND_AUTO_COMPLETE", specialist: "<agent>", terminal_state: "<state>" }
})
```

3. Report summary: what was done, what artifact was produced, what gates passed, terminal state reached

## Terminal States

Every run ends in exactly one. **Never report an error or exhausted budget as success.**

| State | Meaning |
|-------|---------|
| **success** | Brand goal achieved, QA + taste gates passed |
| **clean no-op** | Inspected brand state, nothing needed, no change made |
| **blocked** | Hard blocker — missing brief, locked strategy unavailable, missing asset |
| **approval-required** | Next action ships brand externally and needs HITL |
| **exhausted** | Iteration budget consumed without convergence |
| **stagnated** | No measurable progress across N iterations |

## Rules

1. **Scout first, always** — never execute brand work without recon
2. **Specialist routing** — brand-orchestrator routes, specialists execute
3. **Ship = pause** — the only exception to full autonomy is external shipping
4. **Bounded iterations** — never loop forever, always have a max (default 8)
5. **Brain logging** — if Allura is available, log start/complete/decisions
6. **Taste gate** — after brand work, verify with Munari/Rubin rubric
7. **Graceful degradation** — if Brain is unavailable, continue without memory (log to console)
8. **group_id = "allura-team-durham"** on every Brain operation — never `allura-system`