---
name: allura-architecture
description: "Allura-governed architecture creation. Loads allura-team-ram gates with Brooks gate, Brain search, doc impact check, and ADR logging. Use when creating architecture decisions in the Allura Memory repo."
globs: ["src/**", "docs/allura/**", "guidelines/**"]
---

# Allura Architecture — Governed Architecture Creation

> **Allura-governed architecture decisions.** Enforces Brooks gate, Brain search for prior decisions, canonical doc impact checks, and ADR logging to Allura Brain.

## When to Use

Use this skill when creating architecture decisions in the Allura Memory repo.

Trigger phrases: `allura architecture`, `create architecture`, `architecture decision`, `ADR`, `design decision`.

## Prerequisites

This skill requires `allura-team-ram` to be loaded first. It enforces all seven gates defined there.

## Architecture Authority

| Role | Agent | Responsibility |
|------|-------|---------------|
| Architect | Brooks | Conceptual integrity, contract boundaries, route approval |
| Data Architect | Knuth | Schema correctness, data integrity |
| Interface Review | Pike | API surface, simplicity |
| Intent Gate | Jobs | Scope control, acceptance criteria |

Brooks owns the final architecture decision. No architectural change proceeds without Brooks approval.

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
   - query: "ARCHITECTURE_DECISION {topic} blockers decisions outcomes"
3. Check for existing ADRs on the same topic
4. Synthesize: what's been decided, what's blocking, what alternatives were rejected
```

**Critical:** Before creating any new ADR, search Allura Brain for existing decisions on the same topic. Do not create duplicates.

### Step 3: Documentation Impact Check (Gate 2)

Architecture decisions almost always impact canonical docs. Check each:

| Canonical Doc | Likely Impact |
|---------------|--------------|
| `BLUEPRINT.md` | New/changed business requirements, core concepts |
| `SOLUTION-ARCHITECTURE.md` | New/changed actors, interfaces, topologies |
| `DESIGN-ALLURA.md` | New/changed API contracts, state machines, constraints |
| `REQUIREMENTS-MATRIX.md` | New/changed B# or F# traceability |
| `RISKS-AND-DECISIONS.md` | **Always** — new AD-## entry required |
| `DATA-DICTIONARY.md` | New/changed fields, entities, enums |

Architecture decisions **must** produce an `AD-##` entry in `RISKS-AND-DECISIONS.md`.

### Step 4: Team RAM Owner Assignment (Gate 3)

Assign architecture roles:

| Role | Agent | Responsibility |
|------|-------|---------------|
| Architect | Brooks | Conceptual integrity, final approval |
| Intent Gate | Jobs | Scope, acceptance criteria |
| Data Architect | Knuth | Schema correctness (if data model changes) |
| Interface Review | Pike | API surface (if interface changes) |

### Step 5: Execute (Gate 4)

Execute architecture creation with Allura context loaded:

1. **Init**: Gather context, define scope, identify stakeholders
2. **Discovery**: Collaborative step-by-step exploration of the problem space
3. **Decision**: Make architectural decisions with rationale, alternatives, consequences
4. **Document**: Produce ADR with all required fields:
   - Status (Decided/Proposed/Superseded/Deferred)
   - Decision
   - Rationale
   - Alternatives considered
   - Consequences
   - Owner
   - References

### Step 6: Notion Board Update (Gate 5)

After architecture decision:

1. Update Notion work item with decision status
2. Add ADR reference to Decision Log
3. Update Handoff Context with architecture outcome

### Step 7: Validation Evidence (Gate 6)

Collect and verify:

- [ ] ADR entry created in `RISKS-AND-DECISIONS.md` with all required fields
- [ ] ADR has a unique `AD-##` identifier
- [ ] ADR references affected canonical docs
- [ ] Brooks approval obtained (conceptual integrity check)
- [ ] No duplicate ADR exists in Allura Brain
- [ ] Canonical doc updates planned in same PR (if impacted)

### Step 8: Brain Outcome Log (Gate 7)

Log the architecture decision to Allura Brain:

```
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "brooks-architect",
  content: "ADR_CREATED: AD-{number} {decision title}; rationale={...}; alternatives={...}; consequences={...}",
  metadata: {
    source: "conversation",
    agent_id: "brooks-architect",
    confidence: 0.9,
    adr_id: "AD-{number}",
    decision_type: "architecture"
  }
})
```

## ADR Template

Every architecture decision must follow this structure:

```markdown
### AD-##: {Title}

- **Status**: Decided | Proposed | Superseded | Deferred
- **Decision**: {What was decided}
- **Rationale**: {Why this decision was made}
- **Alternatives Considered**: {What other options were evaluated}
- **Consequences**: {What happens as a result}
- **Owner**: {Who owns this decision}
- **References**: {Links to related docs, ADRs, or discussions}
```

## Architecture-Specific Routing

| Decision Type | Primary Reviewer | Supporting |
|---------------|-----------------|------------|
| API contract change | Brooks | Pike |
| Data model change | Brooks | Knuth |
| Topology change | Brooks | Hightower |
| Security boundary | Brooks | Pike |
| Performance trade-off | Brooks | Bellard/Carmack |
| Integration pattern | Brooks | Hightower |

## Failure Modes

| Failure | Response |
|---------|----------|
| Allura Brain unavailable | Warn and continue with local context only. Never pretend hydration happened. |
| Duplicate ADR found | Reference existing ADR. Do not create a duplicate. |
| Brooks unavailable | Architecture decision is Proposed, not Decided. Requires Brooks approval to become Decided. |
| Canonical doc impact | Plan doc update in same PR. Architecture decisions always impact RISKS-AND-DECISIONS.md. |

## Reflection

At the end of every `allura-architecture` execution, emit:

```
📝 Reflection
├─ Action Taken: Architecture decision AD-{number} — {title}
├─ Principle Applied: Conceptual Integrity (Brooks)
├─ Event Logged: ADR_CREATED
├─ Neo4j Promoted: {Yes/No — only if promotion criteria met}
└─ Confidence: {High/Medium/Low}
```
