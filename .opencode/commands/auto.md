---
description: "Fully autonomous execution mode. Detects task complexity, selects execution strategy (single pass, iterative loop, or epic dispatch), and runs without approval gates. Destructive changes are the only pause point. SONA trajectories wrap every step."
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
  - mcp__allura-brain__memory_search
  - mcp__allura-brain__memory_add
---

# Auto Mode — Fully Autonomous Execution

Run a task from start to finish without manual approval gates. The harness detects complexity, selects the right execution strategy, and drives to completion.

## When to Use

- You want the harness to handle everything end-to-end
- The task is well-defined with clear success criteria
- You trust the harness to make non-destructive decisions autonomously
- You want SONA to learn from the execution

## Execution Protocol

### Phase 0: Context Detection

Determine the execution environment:

1. **API mode** — called via `POST /invoke` or `POST /auto` → full autonomous, no UI
2. **Claude auto mode** — user has auto-approval enabled → NIGHT_BUILD rules apply
3. **Interactive** — user is present → DAY_BUILD with auto-approved non-destructive steps

Set `execution_mode` accordingly. Log to Brain if available:

```javascript
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "auto-mode",
  content: "AUTO_MODE started: <task>",
  metadata: { source: "auto-mode", event_type: "AUTO_MODE_START" }
})
```

### Phase 1: Scout Recon (Mandatory, Read-Only)

Before any action, dispatch Scout for context:

```
Agent(subagent_type: "Explore", prompt: "Scout recon for: <task>. Find relevant files, existing patterns, test coverage, and risks. Report file paths and current state.")
```

Scout report informs complexity assessment. This step is non-negotiable — never skip recon.

### Phase 2: Complexity Assessment

Analyze the task + Scout report to determine execution strategy:

| Signal | Simple Fix | Multi-Step | Epic |
|--------|-----------|------------|------|
| Files affected | 1-2 | 3-8 | 8+ |
| Scout report length | < 200 words | 200-500 | 500+ |
| Task keywords | "fix", "typo", "update", "rename" | "add", "implement", "refactor" | "build", "create system", "redesign" |
| Test changes needed | None or 1 | 2-5 | 5+ |
| Cross-domain | No | Maybe | Yes |

Route to:
- **SIMPLE** → Phase 3A (single NIGHT_BUILD pass)
- **MULTI** → Phase 3B (Ultra work-until-done loop)
- **EPIC** → Phase 3C (Ralph loop with bounded iterations)

Log the routing decision:

```
[AUTO] Complexity: MULTI (5 files, 2 test changes, "implement" keyword)
[AUTO] Strategy: Ultra work-until-done loop
```

### Phase 3A: Simple Fix (Single Pass)

1. Implement the change directly
2. Run tests if they exist
3. Verify with `bun run typecheck && bun run lint` if applicable
4. Done — no iteration needed

### Phase 3B: Multi-Step (Ultra Loop)

Run the Ultra work-until-done pattern:

```
1. Plan — break task into ordered steps
2. Implement step N
3. Validate — run tests, typecheck, lint
4. If validation fails → fix and retry (max 3 retries per step)
5. If all steps done → final validation
6. Done
```

Bounded: max 10 iterations total. If not converging, pause and surface.

### Phase 3C: Epic (Ralph Loop)

For large work, dispatch the Ralph loop:

```
1. Break into stories (max 5 per loop)
2. For each story:
   a. Scout recon (read-only)
   b. Woz implements
   c. Fowler validates (typecheck, lint)
   d. Pike reviews interfaces (if new API surface)
3. After all stories: coherence check
4. Done
```

Bounded: max iterations from task description or default 5. Each story is a SONA trajectory.

### Phase 4: Destructive Change Gate

Even in auto mode, STOP for:

- File deletion (not creation)
- Database schema changes (migrations)
- Environment variable changes (.env)
- Package dependency changes (package.json)
- Git force push or branch deletion
- Changes to governance hooks or agent definitions

Surface the change, explain the risk, and wait for explicit approval. This is the only pause point in auto mode.

### Phase 5: Completion

1. Run final validation: `bun test && bun run typecheck && bun run lint`
2. Log outcome to Brain:

```javascript
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "auto-mode",
  content: "AUTO_MODE completed: <task>. Strategy: <simple|multi|epic>. Steps: <N>. Success: <bool>.",
  metadata: { source: "auto-mode", event_type: "AUTO_MODE_COMPLETE", strategy: "<strategy>" }
})
```

3. Report summary: what was done, what was changed, what tests pass

## Rules

1. **Scout first, always** — never implement without recon
2. **SONA wraps every step** — trajectories are how we learn
3. **Destructive = pause** — the only exception to full autonomy
4. **Bounded iterations** — never loop forever, always have a max
5. **Brain logging** — if Allura is available, log start/complete/decisions
6. **Coherence check** — after multi-step work, verify the system is still coherent
7. **Graceful degradation** — if Brain is unavailable, continue without memory (log to console)
