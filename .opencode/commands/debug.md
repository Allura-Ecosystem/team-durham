---
description: "Systematic debugging using the 5-phase protocol from AGENTS.md — root cause first, never guess"
allowed-tools: ["Read", "Bash", "Glob", "Grep"]
---

# Systematic Debugging

**Usage:** `/debug <error message, test name, or description of unexpected behavior>`

Issue: `$ARGUMENTS`

This command enforces the 5-phase debugging protocol from `AGENTS.md` section 10. **No fix is proposed until Phase 4.**

---

## Phase 0: Memory Hydration

Search for previous debugging sessions on this issue (when memory is available):

- Query memory backend for prior sessions on this issue
- If a prior session exists: read what was tried, what failed, and why

---

## Phase 1: Root Cause Investigation

Gather evidence before forming any hypothesis:

1. Read the full error message — don't summarize it
2. Identify the exact file and line where the failure originates
3. Check recent changes: `git log --oneline -10` and `git diff HEAD~5`
4. Reproduce consistently: run the failing test in isolation

   ```bash
   bun vitest run -t "$ARGUMENTS"
   ```

---

## Phase 2: Pattern Analysis

Find working examples of similar code in the codebase:

- Grep for the same pattern where it works
- Compare the working version to the broken version
- Identify the specific divergence

---

## Phase 3: Hypothesis and Testing

State one hypothesis. Test it:

```text
Hypothesis: [specific, falsifiable claim]
Test: [how to confirm or refute it]
Result: [what the test showed]
```

If the hypothesis is wrong, return to Phase 2. **One hypothesis at a time.**

---

## Phase 4: Implementation

Only after root cause is confirmed:

1. Write a failing test that captures the bug
2. Implement the minimal fix
3. Verify the test passes: `bun test`
4. Run full suite: `bun test && bun run typecheck`

---

## Phase 5: Persist

Log the debugging session to memory (when available):

- Event type: `debug_session`
- Group ID: `<group_id>` (from project configuration)
- Issue, root cause, fix, and lesson learned

## Red Flags — STOP if you catch yourself thinking

- "Quick fix for now, investigate later"
- "Let me just try changing X"
- "One more attempt" (after 2+ failures)

If 3+ fixes have failed: **question the architecture.** Do not fix again — escalate to `/orchestrate`.
