---
name: allura-dev-story
description: "Allura-governed story implementation. Loads allura-team-ram gates with Allura context, Brain search, doc impact check, and outcome logging. Use when implementing stories in the Allura Memory repo."
globs: ["src/**", "docs/allura/**", "guidelines/**"]
---

# Allura Dev Story — Governed Story Implementation

> **Allura-governed story implementation.** This skill enforces the governance pattern defined in `allura-team-ram`.

## When to Use

Use this skill when implementing a story in the Allura Memory repo.

Trigger phrases: `allura dev story`, `implement story`, `dev story`, `allura implement`, `story implementation`.

## Prerequisites

This skill requires `allura-team-ram` to be loaded first. It enforces all seven gates defined there.

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
   - query: "{story topic} blockers decisions outcomes"
3. Check Notion board for story status
4. Synthesize: what's active, what's blocking, what was decided
```

If Scout subagent is unavailable, perform Scout protocol manually and state:
`Scout delegation unavailable; Brooks performed Scout protocol manually.`

### Step 3: Documentation Impact Check (Gate 2)

Before writing any code, check whether the story touches any of the six canonical docs:

| Canonical Doc | Impact Signal |
|---------------|---------------|
| `BLUEPRINT.md` | New/changed business requirements, core concepts |
| `SOLUTION-ARCHITECTURE.md` | New/changed actors, interfaces, topologies |
| `DESIGN-ALLURA.md` | New/changed API contracts, state machines, constraints |
| `REQUIREMENTS-MATRIX.md` | New/changed B# or F# traceability |
| `RISKS-AND-DECISIONS.md` | New architectural decisions or risks |
| `DATA-DICTIONARY.md` | New/changed fields, entities, enums |

If any doc is impacted, plan the update in the same PR.

### Step 4: Team RAM Owner Assignment (Gate 3)

Assign roles for this story:

| Role | Agent | Responsibility |
|------|-------|---------------|
| Intent Gate | Jobs | Acceptance criteria, scope |
| Architect | Brooks | Contracts, boundaries |
| Builder | Woz | Implementation |
| Interface Review | Pike | API surface, simplicity |
| Refactor Review | Fowler | Maintainability |
| Validation Execution | Ralph Loop | Bounded execution evidence; not final authority |

### Step 5: Execute (Gate 4)

Execute story implementation with Allura context loaded:

1. Read the story spec file (from Notion or local)
2. Load all context identified by Scout
3. Implement following the story spec
4. Write tests for acceptance criteria
5. Run validation (`bun test`, `bun run typecheck`)

### Step 6: Notion Board Update (Gate 5)

After implementation:

1. Update Notion work item status
2. Add evidence links to Decision Log
3. Update Handoff Context with what was done

### Step 7: Validation Evidence (Gate 6)

Collect and verify:

- [ ] `bun test` passes for affected test files
- [ ] `bun run typecheck` clean
- [ ] Acceptance criteria met (from story spec)
- [ ] Review approved (Pike for interface, Fowler for maintainability)
- [ ] No canonical doc impact without update
- [ ] Evidence artifact created

### Step 8: Brain Outcome Log (Gate 7)

Log the outcome to Allura Brain:

```
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "brooks-architect",
  content: "TASK_COMPLETE: {story ID} — {summary}; evidence={...}",
  metadata: {
    source: "conversation",
    agent_id: "brooks-architect",
    confidence: 0.85,
    story_id: "{story ID}",
    validation: "passed"
  }
})
```

## Story-Specific Routing

| Story | Primary Skill | Supporting |
|-------|--------------|------------|
| DASH-12 Memory Lineage | `allura-dev-story` | `allura-graph-debug` |
| 2.3 Token Alias | `allura-dev-story` | `varlock`, `frontend-craft` |
| 2.6 Memory API Dedup | `allura-dev-story` | `systematic-debugging` |
| 2.8 Pike Gate / Zod | `allura-dev-story` | `allura-code-review` |
| E2.1–E2.5 Dashboard Quality | `allura-dev-story` | `frontend-craft`, `allura-health-observability` |
| E3.1–E3.5 Hardening | `allura-dev-story` | `allura-code-review` |
| E4.1–E4.5 Kernel | `allura-dev-story` | — |
| E5.1–E5.5 Infra | `allura-dev-story` | — |

## Failure Modes

| Failure | Response |
|---------|----------|
| Allura Brain unavailable | Warn and continue with local context only. Never pretend hydration happened. |
| Scout subagent unavailable | Perform Scout protocol manually. State: `Scout delegation unavailable; manual hydration.` |
| Notion MCP unavailable | Log warning. Continue with local sprint status. Flag for manual update. |
| Canonical doc impact detected | Plan doc update in same PR. Do not skip. |
| Validation fails | Do not mark story Done. Log blocker to Brain. |

## Reflection

At the end of every `allura-dev-story` execution, emit:

```
📝 Reflection
├─ Action Taken: {story ID} — {summary}
├─ Principle Applied: {Brooksian principle}
├─ Event Logged: TASK_COMPLETE or BLOCKED
├─ Neo4j Promoted: {Yes/No}
└─ Confidence: {High/Medium/Low}
```
