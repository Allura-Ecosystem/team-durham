---
description: "Party mode — launch Team RAM specialists in parallel with Brooks orchestration"
allowed-tools: ["Task", "Read", "Bash", "Grep", "Glob", "Edit", "Write", "mcp__MCP_DOCKER__*"]
---

# Party Mode — Team RAM Parallel Dispatch

Launch multiple specialists simultaneously. Brooks orchestrates; Team RAM executes.

## Usage

```text
/party <task description>
```

## When to Use

- Complex tasks requiring multiple perspectives
- Time-sensitive work where some subtasks are independent
- Research + implementation + validation work that can be split cleanly
- Multi-file or multi-domain changes where separate specialists add value

## When Not to Use

- Small one-file changes
- Tight sequential work where one step depends on the last
- Trivial fixes where coordination overhead costs more than it saves
- Tasks without at least two meaningful specialist slices

## Team RAM Roster

| Agent | Subagent Type | Role | Writes Code? |
|-------|--------------|------|-------------|
| **Woz** | `WOZ_BUILDER` | Primary builder — implements, tests, and prepares diffs | ✅ Yes |
| **Scout** | `SCOUT_RECON` | Recon — file discovery, pattern grep, risk scan | ❌ Read-only |
| **Knuth** | `KNUTH_DATA_ARCHITECT` | Data — schema, queries, migrations | ⚠️ Ask first |
| **Bellard** | `BELLARD_DIAGNOSTICS_PERF` | Diagnostics — perf measurement, profiling | ❌ Read-only |
| **Carmack** | `CARMACK_PERFORMANCE` | Perf — latency reduction, hot path optimization | ❌ Read-only |
| **Fowler** | `FOWLER_REFACTOR_GATE` | Refactor gate — maintainability, lint, typecheck | ✅ Yes, limited |
| **Pike** | `PIKE_INTERFACE_REVIEW` | Interface gate — API ergonomics, surface area | ❌ Read-only |
| **Hightower** | `HIGHTOWER_DEVOPS` | DevOps — Docker, CI/CD, infrastructure | ⚠️ Ask first |

## Protocol

### Phase 1: Decompose (Brooks)

Brooks reads the task and breaks it into **independent subtasks**.
Each subtask maps to one Team RAM specialist.

```text
Subtasks with NO dependencies → run in PARALLEL (same turn)
Subtasks that depend on others → run AFTER dependency completes
```

Keep the decomposition simple and explicit.

### Phase 2: Dispatch (Parallel Launch)

Launch all independent specialists in a **single message** using the Task tool.

```javascript
// Example: "Add user authentication with OAuth2"

Task(subagent_type: "SCOUT_RECON", prompt: "Find all existing auth patterns, middleware, and session handling in src/. Check .env for auth-related vars. Report file paths and current state.")
Task(subagent_type: "WOZ_BUILDER", prompt: "Implement OAuth2 flow per specs. Follow existing auth patterns. Write tests alongside implementation.")
Task(subagent_type: "KNUTH_DATA_ARCHITECT", prompt: "Review schema for user tables and session storage. Check migrations and propose any schema changes needed for OAuth2.")
Task(subagent_type: "HIGHTOWER_DEVOPS", prompt: "Check Docker and CI config for auth-related env vars and secrets. Ensure .env.example is updated. Verify environment and callback assumptions.")
```

### Phase 3: Collect and Validate

After all parallel agents complete:

1. **Fowler gate** — run `bun run typecheck && bun run lint`
2. **Pike gate** — review any new API or interface surface
3. **Bellard gate** — measure if a performance-sensitive path changed

### Phase 4: Synthesize and Commit

Brooks synthesizes all results, resolves conflicts, and approves the final path.

Woz is the **default writer** for implementation changes.
Other specialists write only when explicitly authorized by the task and their role.

If a commit is requested, Woz should normally prepare or perform the implementation commit after the gates pass.

## Task Decomposition Examples

### "Run k6 load test and optimize if needed"

```text
PARALLEL:
  - Bellard: Run k6 at VU=100, capture p95 metrics
  - Scout: Find hot paths in src/mcp/ and src/lib/memory/

AFTER Bellard reports:
  - Carmack: Optimize if p95 > 200ms
```

### "Process backlogged proposals through Notion sync"

```text
PARALLEL:
  - Knuth: Query pending proposals and check dedup state
  - Scout: Find Notion sync config and env vars

AFTER both report:
  - Woz: Implement batch processing script using query results
```

### "Debug failing test suite"

```text
PARALLEL:
  - Scout: Find all failing tests and categorize by error type
  - Bellard: Check for perf regressions or timing-related failures

AFTER both report:
  - Woz: Fix failures categorized by Scout
  - Fowler: Validate fixes do not add debt
```

## Rules

1. **At least 2 agents per party** — no solo work in party mode
2. **Woz is the default writer** — other specialists write only when explicitly authorized
3. **Fowler gates every commit path** — no commit flow without typecheck and lint passing
4. **Brooks never implements** — Brooks orchestrates, synthesizes, and approves direction
5. **Use scoped DB rules when required** — if the active system requires `group_id`, include it on those operations
6. **Respect append-only audit rules** — if the active system uses append-only events, do not mutate historical records

## Why This Works

Party mode is useful when the work can be split into real specialist slices.

It fails when used on tasks that are too small, too coupled, or too vague.

Brooks keeps conceptual integrity.
The specialists reduce delay.
The gates keep the work honest.

---

**Invoke with:** `/party <task description>`
