# Validation Gates

> Defines the validation gates that every Allura workflow must pass before marking work as Done.

## Seven Gates (from allura-team-ram)

### Gate 1: Scout Hydration

**Purpose:** Ensure context is loaded before any work begins.

**Checklist:**
- [ ] Local context files loaded (CLAUDE.md, .opencode/, docs/allura/)
- [ ] Allura Brain searched with `group_id=allura-system`
- [ ] Recent blockers and decisions identified
- [ ] Active story/task scope confirmed

**Failure mode:** If Scout is unavailable, perform manual hydration and state: `Scout delegation unavailable; manual hydration.`

### Gate 2: Documentation Impact Check

**Purpose:** Ensure canonical docs are updated when code changes affect them.

**Checklist:**
- [ ] Changed files identified
- [ ] Each changed file mapped to canonical doc impact
- [ ] Doc updates planned in same PR (if impacted)
- [ ] No canonical doc impact without update

**Reference:** See `documentation-impact-matrix.md`

### Gate 3: Team RAM Owner Assignment

**Purpose:** Ensure the right role reviews the right aspect.

**Checklist:**
- [ ] Intent/Scope owner assigned (Jobs)
- [ ] Architecture owner assigned (Brooks)
- [ ] Implementation owner assigned (Woz)
- [ ] Review owner assigned (Pike/Fowler)
- [ ] Validation owner assigned (Ralph)

### Gate 4: Workflow Execution

**Purpose:** Execute the Allura skill workflow with loaded context.

**Checklist:**
- [ ] Story spec read and understood
- [ ] All context from Scout loaded
- [ ] Implementation follows story spec
- [ ] Tests written for acceptance criteria

### Gate 5: Notion Board Update

**Purpose:** Keep the work board in sync with reality.

**Checklist:**
- [ ] Work item status updated
- [ ] Decision Log updated with evidence links
- [ ] Handoff Context updated

### Gate 6: Validation Evidence

**Purpose:** Prove the work is done with evidence, not assertions.

**Checklist:**
- [ ] `bun test` passes for affected test files
- [ ] `bun run typecheck` clean
- [ ] Acceptance criteria met (from story spec)
- [ ] Review approved (Pike for interface, Fowler for maintainability)
- [ ] Evidence artifact created (test output, review notes, screenshots)
- [ ] No canonical doc impact without update

### Gate 7: Brain Outcome Log

**Purpose:** Ensure institutional memory persists across sessions.

**Checklist:**
- [ ] Outcome logged to Allura Brain with `group_id=allura-system`
- [ ] Event type correctly classified (ADR_CREATED, TASK_COMPLETE, BLOCKED, etc.)
- [ ] Metadata includes story ID, validation status, confidence level

## Gate Failure Protocol

| Gate | Failure Response |
|------|-----------------|
| Gate 1 (Scout) | Warn and continue with local context. Never pretend hydration happened. |
| Gate 2 (Doc Impact) | Plan doc update in same PR. Do not skip. |
| Gate 3 (Owner) | Assign owner before proceeding. Do not self-review. |
| Gate 4 (Workflow) | Follow the Allura skill workflow. Do not improvise. |
| Gate 5 (Notion) | Log warning. Continue with local status. Flag for manual update. |
| Gate 6 (Validation) | Do not mark story Done. Log blocker to Brain. |
| Gate 7 (Brain) | Log warning. Continue. Flag for manual Brain update. |