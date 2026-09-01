---
name: run-night
description: "NIGHT_BUILD mode — Autonomous execution. No approval gates unless destructive. Picks best-known route immediately. Stops ONLY on hard blockers."
argument-hint: "<task description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - Agent
  - Skill
  - Task
---

# NIGHT_BUILD Command

**Mode:** Autonomous (no-brakes)
**Contract:** `.opencode/contracts/harness-v1.md` §2

## Purpose

Run a task autonomously without stopping for user approval. The system picks the best-known route and executes straight through. Use this for:
- Bug fixes that don't change interfaces
- Lint fixes, refactoring, test additions
- Well-understood tasks with clear scope
- Tasks where the cost of delay exceeds the cost of error

**The system will only stop if:**
1. It hits a hard blocker (no agent available, no fallback)
2. The user explicitly stops it
3. The Definition of Done is satisfied

## Execution Flow

### Step 1: Load Required Context

```
Load .opencode/AI-GUIDELINES.md
→ If not found: HALT with error "AI-GUIDELINES.md is a hard gate. Cannot proceed."
```

### Step 2: Recon — Invoke Scout

```
Delegate to: Scout (scout-recon)
Task: Produce Scout Report for the current work
Output: Paths, entrypoints, patterns, risks, next pointers
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: scout-recon)
```

### Step 3: Intent + Scope — Invoke Jobs

```
Delegate to: Jobs (jobs-intent-gate)
Task: Clarify intent, define scope, produce acceptance criteria
Input: User request + Scout Report
Output:
  - Intent Brief (what, why, constraints)
  - Scope Definition (in-scope, out-of-scope, kill list)
  - Acceptance Criteria (testable conditions)
  - Compliance Level: one of [full | standard | light]
  - AUTO-APPROVED: if not destructive, proceed without user confirmation
  - STOP FOR APPROVAL: only if destructive change detected
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: jobs-intent-gate)
```

### Step 4: Architecture + Route — Invoke Brooks

```
Delegate to: Brooks (brooks-architect)
Task: Produce contracts, ADRs, select route
Input: Intent Brief + Scout Report + past performance data
Output:
  - Architectural Decision Records (ADRs)
  - Interface contracts (if interfaces change)
  - Routing decision (which agents, in what order)
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: brooks-architect)
→ No user approval needed unless destructive
→ If ADR created: log ADR_CREATED via hook
```

### Step 5: Implementation — Invoke Woz

```
Delegate to: Woz (woz-builder)
Task: Implement step-by-step per the Brooks plan
Input: ADRs + Contracts + Acceptance Criteria
Output: Working code, tests, clean diff
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: woz-builder)
→ On hard blocker: log BLOCKER_HIT, STOP and report
→ If interface added: invoke Pike as fallback
```

### Step 6: Interface Review — Invoke Pike

```
Delegate to: Pike (pike-interface-review) — if surface area changed
Task: Reject unnecessary surface area
Input: Woz's implementation + contracts
Output: Interface approval or veto
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: pike-interface-review)
→ If veto: return to Woz with specific simplification requirements (auto-retry once)
```

### Step 7: Debt Prevention — Invoke Fowler

```
Delegate to: Fowler (fowler-refactor-gate)
Task: Ensure changes are incremental, reversible, no debt added
Input: Implementation + contracts
Output: Debt check pass or required refactor slices
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: fowler-refactor-gate)
→ If debt found: auto-apply refactor slices (no user confirmation needed)
```

### Step 8: Performance Check — Invoke Bellard (conditional)

```
Only if: Performance constraint present in the acceptance criteria
Delegate to: Bellard (bellard-diagnostics-perf)
Task: Benchmark, profile, validate under constraints
Input: Implementation + performance constraints
Output: Performance pass/fail + measurements
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: bellard-diagnostics-perf)
→ If performance fails: auto-apply minimal fix (no user confirmation)
```

### Step 9: Documentation Compliance Gate

```
Check compliance level declared by Jobs:
- Full: Verify all 7 artifacts exist and updated
- Standard: Verify BLUEPRINT.md + RISKS-AND-DECISIONS.md
- Light: Verify RISKS-AND-DECISIONS.md

Output:
  - AI-GUIDELINES.md loaded? (yes/no)
  - Compliance level? (full/standard/light)
  - Artifacts created/updated? (list)
  - Requirements Matrix updated? (yes/no/n/a)
  - Risks & Decisions updated? (yes/no)

Log: DOC_COMPLIANCE_CHECK
→ If any "no" for declared level: auto-complete missing artifacts (no user halt)
→ Exception: if Full level and artifacts cannot be auto-generated, STOP and report
```

### Step 10: Complete

```
Log: TASK_COMPLETE (include doc_adherence signals)
Report: Summary to user (what was done, what was deferred, compliance status)
```

## Fallback Behavior

If any primary agent fails:
1. Log AGENT_FAILED
2. Check routing table for fallback agent
3. If fallback exists: invoke, log FALLBACK_TRIGGERED
4. If no fallback: log BLOCKER_HIT, **STOP** and report to user

## Destructive Change Detection

The system MUST stop and request user approval if any of these conditions are detected:
- Deleting files that are not auto-generated
- Changing database schemas (DROP TABLE, ALTER COLUMN)
- Modifying API contracts that other services depend on
- Rewriting more than 50% of a file's contents
- Removing public interfaces

## Validation

```bash
opencode run --mode=night --task="fix lint errors"
# Expected: Scout → Jobs (auto-approved) → Brooks (route) → Woz (fix) → Pike → Fowler → compliance gate → TASK_COMPLETE
# No user interaction required
```