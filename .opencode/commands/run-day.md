---
name: run-day
description: "DAY_BUILD mode — Interactive execution with approval gates. Stops on ambiguous routing and asks user. Logs all events to PostgreSQL via Allura."
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

# DAY_BUILD Command

**Mode:** Interactive (human-in-the-loop)
**Contract:** `.opencode/contracts/harness-v1.md` §1

## Purpose

Run a task with full approval gates. The system stops for user confirmation at every critical decision point. Use this for:
- Architecture decisions
- Feature work that changes interfaces
- Any task where the cost of error is high
- First-time tasks with no performance history

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

### Step 3: Intent Gate — Invoke Jobs

```
Delegate to: Jobs (jobs-intent-gate)
Task: Clarify intent, define scope, produce acceptance criteria
Input: User request + Scout Report
Output:
  - Intent Brief (what, why, constraints)
  - Scope Definition (in-scope, out-of-scope, kill list)
  - Acceptance Criteria (testable conditions)
  - Compliance Level: one of [full | standard | light]
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: jobs-intent-gate)
```

### Step 4: User Approval — Intent

```
Present Intent Brief + Acceptance Criteria + Compliance Level to user
→ If approved: continue
→ If rejected: refine scope (return to Step 3)
→ If cancelled: log TASK_FAILED, exit
```

### Step 5: Architecture — Invoke Brooks

```
Delegate to: Brooks (brooks-architect)
Task: Produce contracts, ADRs, routing decision
Input: Intent Brief + Scout Report + past performance data
Output:
  - Architectural Decision Records (ADRs)
  - Interface contracts (if interfaces change)
  - Routing decision (which agents, in what order)
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: brooks-architect)
→ If ADR created: log ADR_CREATED via hook
```

### Step 6: User Approval — Architecture

```
Present ADRs + Contracts + Routing Decision to user
→ If approved: continue
→ If rejected: revise architecture (return to Step 5)
→ If cancelled: log TASK_FAILED, exit
```

### Step 7: Implementation — Invoke Woz

```
Delegate to: Woz (woz-builder)
Task: Implement step-by-step per the Brooks plan
Input: ADRs + Contracts + Acceptance Criteria
Output: Working code, tests, clean diff
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: woz-builder)
→ On hard blocker: log BLOCKER_HIT, escalate to Brooks or ask user
→ If interface added: invoke Pike as fallback
```

### Step 8: Interface Review — Invoke Pike

```
Delegate to: Pike (pike-interface-review) — if surface area changed
Task: Validate interfaces, check for unnecessary complexity
Input: Woz's implementation + contracts
Output: Interface approval or veto
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: pike-interface-review)
→ If veto: return to Woz with specific simplification requirements
```

### Step 9: Debt Prevention — Invoke Fowler

```
Delegate to: Fowler (fowler-refactor-gate)
Task: Ensure changes are incremental, reversible, no debt added
Input: Implementation + contracts
Output: Debt check pass or required refactor slices
Log: AGENT_INVOKED + AGENT_COMPLETED (agent_id: fowler-refactor-gate)
→ If debt found: return to Woz with specific refactoring requirements
```

### Step 10: Documentation Compliance Gate

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
→ If any "no" for declared level: HALT, require completion
```

### Step 11: Complete

```
Log: TASK_COMPLETE (include doc_adherence signals)
Report: Summary to user (what was done, what was deferred, compliance status)
```

## Fallback Behavior

If any primary agent fails:
1. Log AGENT_FAILED
2. Check routing table for fallback agent
3. If fallback exists: invoke, log FALLBACK_TRIGGERED
4. If no fallback: log BLOCKER_HIT, escalate to user

## Validation

```bash
opencode run --mode=day --task="test scout"
# Expected: Scout invoked → Jobs intent → User approval → Brooks ADRs → User approval → implementation → compliance gate → TASK_COMPLETE
```