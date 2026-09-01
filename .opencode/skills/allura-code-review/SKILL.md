---
name: allura-code-review
description: "Allura-governed code review with Pike/Fowler gates, Brain outcome logging, and doc impact checks. Use for governed review, allura code review, or review with gates — not generic code review."
globs: ["src/**", "docs/allura/**", "guidelines/**"]
---

# Allura Code Review — Governed Code Review

> **Allura-governed code review.** Enforces Pike/Fowler review gates, Brain outcome logging, and canonical doc impact checks before and after review.

## When to Use

Use this skill when reviewing code changes in the Allura Memory repo.

Trigger phrases: `allura code review`, `governed review`, `review with gates`, `allura review`.

## Prerequisites

This skill requires `allura-team-ram` to be loaded first. It enforces all seven gates defined there.

## Review Authority

| Reviewer | Focus Area | Gate |
|----------|-----------|------|
| Pike | Interface simplicity, API surface, source-of-truth clarity | Interface Gate |
| Fowler | Maintainability, token use, component boundaries | Refactor Gate |

Both reviewers must approve before the story can be marked Done.

## Execution Protocol

### Step 1: Load Allura Core

Load `allura-team-ram` skill. This provides:
- Scout hydration protocol
- Documentation impact check
- Team RAM owner assignment
- Brain outcome logging
- Reflection protocol

### Step 2: Scout Hydration (Gate 1)

```
1. Read local context: CLAUDE.md, .opencode/, docs/allura/
2. Search Allura Brain:
   - group_id: "allura-system"
   - query: "code review {topic} blockers decisions outcomes"
3. Check Notion board for review status
4. Synthesize: what's active, what's blocking, what was decided
```

### Step 3: Documentation Impact Check (Gate 2)

Before reviewing, check whether the changes impact any canonical docs:

| Canonical Doc | Impact Signal |
|---------------|---------------|
| `BLUEPRINT.md` | Changed business requirements |
| `SOLUTION-ARCHITECTURE.md` | Changed actors, interfaces, topologies |
| `DESIGN-ALLURA.md` | Changed API contracts, state machines |
| `REQUIREMENTS-MATRIX.md` | Changed B# or F# traceability |
| `RISKS-AND-DECISIONS.md` | New architectural decisions or risks |
| `DATA-DICTIONARY.md` | Changed fields, entities, enums |

If any doc is impacted, flag it in the review. Doc updates must be in the same PR.

### Step 4: Team RAM Owner Assignment (Gate 3)

Assign review roles:

| Role | Agent | Responsibility |
|------|-------|---------------|
| Interface Review | Pike | API surface, simplicity, source-of-truth clarity |
| Refactor Review | Fowler | Maintainability, token use, component boundaries |
| Architecture Review | Brooks | Conceptual integrity (if architectural change) |

### Step 5: Execute (Gate 4)

Execute code review with Allura context loaded:

1. Gather context (files changed, diff, related tests)
2. Launch parallel review layers:
   - **Blind Hunter**: Find bugs, security issues, logic errors
   - **Edge Case Hunter**: Walk every branching path and boundary condition
   - **Acceptance Auditor**: Verify acceptance criteria are met
3. Triage findings into categories:
   - 🔴 Critical (must fix before merge)
   - 🟡 Warning (should fix, not blocking)
   - 🟢 Suggestion (nice to have)
4. Present actionable results with file:line references

### Step 6: Notion Board Update (Gate 5)

After review:

1. Update Notion work item with review status
2. Add review findings to Decision Log
3. Update Handoff Context with review outcome

### Step 7: Validation Evidence (Gate 6)

Collect and verify:

- [ ] All 🔴 Critical findings addressed or explicitly deferred with rationale
- [ ] `bun test` passes for affected test files
- [ ] `bun run typecheck` clean
- [ ] No canonical doc impact without planned update
- [ ] Review approval from Pike (interface) and/or Fowler (maintainability)
- [ ] Evidence artifact created (review notes, triage results)

### Step 8: Brain Outcome Log (Gate 7)

Log the review outcome to Allura Brain:

```
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "brooks-architect",
  content: "CODE_REVIEW: {story ID} — {summary}; findings={critical/warning/suggestion counts}; outcome={approved/changes-requested}",
  metadata: {
    source: "conversation",
    agent_id: "brooks-architect",
    confidence: 0.85,
    review_type: "pike-fowler",
    story_id: "{story ID}"
  }
})
```

## Review-Specific Routing

| Change Type | Primary Reviewer | Supporting |
|-------------|-----------------|------------|
| API contract change | Pike | Brooks (if architectural) |
| UI/component change | Pike | Fowler |
| Database/schema change | Knuth | Pike |
| Performance change | Bellard/Carmack | Fowler |
| Security change | Pike | Brooks |
| Refactoring | Fowler | Pike |
| Documentation change | Brooks | — |

## Failure Modes

| Failure | Response |
|---------|----------|
| Allura Brain unavailable | Warn and continue with local context only |
| Pike/Fowler unavailable | Note in review. Do not mark as approved without review. |
| Canonical doc impact detected | Flag in review. Require doc update in same PR. |
| Critical findings | Do not approve. Require fix before merge. |

## Reflection

At the end of every `allura-code-review` execution, emit:

```
📝 Reflection
├─ Action Taken: Code review for {story ID} — {summary}
├─ Principle Applied: {Brooksian principle}
├─ Event Logged: CODE_REVIEW
├─ Neo4j Promoted: {Yes/No}
└─ Confidence: {High/Medium/Low}
```
