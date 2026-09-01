---
name: allura-product-intake
description: "Allura-governed product intake. Loads allura-team-ram gates with Jobs intent gate, Brain search, and doc impact check. Use when creating PRDs or product requirements in the Allura Memory repo."
globs: ["src/**", "docs/allura/**", "guidelines/**"]
---

# Allura Product Intake — Governed PRD Creation

> **Allura-governed product requirements.** Enforces Jobs intent gate, Brain search for prior decisions, canonical doc impact checks, and outcome logging to Allura Brain.

## When to Use

Use this skill when creating product requirements or PRDs in the Allura Memory repo.

Trigger phrases: `allura product intake`, `create PRD`, `product requirements`, `allura PRD`, `intake`.

## Prerequisites

This skill requires `allura-team-ram` to be loaded first. It enforces all seven gates defined there.

## Intent Authority

| Role | Agent | Responsibility |
|------|-------|---------------|
| Intent Gate | Jobs | Scope control, acceptance criteria, product direction |
| Architect | Brooks | Architecture feasibility, contract boundaries |
| Builder | Woz | Implementation feasibility |

Jobs owns the intent. No PRD proceeds without Jobs acceptance criteria.

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
   - query: "PRD product requirements {topic} blockers decisions outcomes"
3. Check Notion board for existing stories/epics on this topic
4. Synthesize: what's been requested, what's been decided, what's blocking
```

**Critical:** Before creating any new PRD, search Allura Brain for existing requirements on the same topic. Do not create duplicates.

### Step 3: Documentation Impact Check (Gate 2)

PRD creation always impacts canonical docs. Check each:

| Canonical Doc | Likely Impact |
|---------------|--------------|
| `BLUEPRINT.md` | **Always** — new/changed business requirements, core concepts |
| `SOLUTION-ARCHITECTURE.md` | New actors, interfaces, topologies |
| `DESIGN-ALLURA.md` | New API contracts, state machines, constraints |
| `REQUIREMENTS-MATRIX.md` | **Always** — new B# and F# traceability |
| `RISKS-AND-DECISIONS.md` | New risks or architectural decisions |
| `DATA-DICTIONARY.md` | New fields, entities, enums |

PRD creation **must** update `BLUEPRINT.md` and `REQUIREMENTS-MATRIX.md`.

### Step 4: Team RAM Owner Assignment (Gate 3)

Assign product roles:

| Role | Agent | Responsibility |
|------|-------|---------------|
| Intent Gate | Jobs | Acceptance criteria, scope control |
| Architect | Brooks | Architecture feasibility |
| Builder | Woz | Implementation feasibility |

### Step 5: Execute (Gate 4)

Execute PRD creation with Allura context loaded:

1. **Init**: Define product vision, target users, problem statement
2. **Discovery**: Gather requirements through structured conversation
3. **Requirements**: Define business requirements (B#) and functional requirements (F#)
4. **Acceptance**: Define acceptance criteria for each requirement
5. **Document**: Produce PRD with all required sections:
   - Summary
   - Core Concepts
   - Business Requirements (B#)
   - Functional Requirements (F#)
   - Acceptance Criteria
   - Out of Scope
   - References

### Step 6: Notion Board Update (Gate 5)

After PRD creation:

1. Create Notion work items for each B# and F#
2. Link PRD to epic/story
3. Update Decision Log with PRD reference

### Step 7: Validation Evidence (Gate 6)

Collect and verify:

- [ ] PRD has unique B# and F# identifiers
- [ ] Each B# maps to at least one F#
- [ ] Acceptance criteria are testable
- [ ] Jobs acceptance criteria met (scope control)
- [ ] `BLUEPRINT.md` updated with new B# requirements
- [ ] `REQUIREMENTS-MATRIX.md` updated with B# → F# mapping
- [ ] No duplicate requirements in Allura Brain

### Step 8: Brain Outcome Log (Gate 7)

Log the PRD creation to Allura Brain:

```
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "brooks-architect",
  content: "PRD_CREATED: {PRD title}; B#s={...}; F#s={...}; acceptance_criteria={...}",
  metadata: {
    source: "conversation",
    agent_id: "brooks-architect",
    confidence: 0.85,
    prd_title: "{title}",
    business_requirements: ["B1", "B2", ...],
    functional_requirements: ["F1", "F2", ...]
  }
})
```

## PRD-Specific Routing

| PRD Phase | Primary Owner | Supporting |
|-----------|--------------|------------|
| Vision & Scope | Jobs | Brooks |
| Requirements | Jobs | Woz (feasibility) |
| Acceptance Criteria | Jobs | Pike (interface) |
| Architecture Impact | Brooks | Knuth (data) |
| Implementation Plan | Woz | Hightower (infra) |

## Failure Modes

| Failure | Response |
|---------|----------|
| Allura Brain unavailable | Warn and continue with local context only |
| Duplicate PRD found | Reference existing PRD. Do not create a duplicate. |
| Jobs unavailable | PRD is draft, not accepted. Requires Jobs acceptance criteria. |
| Canonical doc impact | Plan doc update in same PR. PRD always impacts BLUEPRINT.md and REQUIREMENTS-MATRIX.md. |

## Reflection

At the end of every `allura-product-intake` execution, emit:

```
📝 Reflection
├─ Action Taken: PRD created — {title}
├─ Principle Applied: {Brooksian principle}
├─ Event Logged: PRD_CREATED
├─ Neo4j Promoted: {Yes/No}
└─ Confidence: {High/Medium/Low}
```
