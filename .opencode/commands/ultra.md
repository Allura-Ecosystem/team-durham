---
description: "Ultra work-until-done — bounded Team RAM execution until validation passes"
allowed-tools: ["Read", "Bash", "Glob", "Grep", "Edit", "Write", "mcp__MCP_DOCKER__*"]
---

# Ultra Work-Until-Done (`ultra`)

`ultra` is the canonical bounded loop for finishing concrete work. `ulw` remains a legacy alias.

## Mode: `$ARGUMENTS`

Default mode is **work**.

- `work` — plan, implement, validate, repeat until done or blocked
- `plan` — analyze scope and update the loop plan only
- `status` — summarize current loop status, blockers, and next action

## Protocol

### If Mode is `work`

1. Read `.opencode/AI-GUIDELINES.md`
2. Read `.opencode/ralph/PROMPT_ultra.md`
3. Read `.opencode/ralph/loop-runner.md`
4. Hydrate local context and search Allura Brain before editing
5. Resolve required skills before implementation
6. Implement the smallest valid slice
7. Validate with the lightest meaningful checks
8. Repeat until the task is complete or a hard blocker is reached

### If Mode is `plan`

1. Read `.opencode/ralph/PROMPT_ultra.md`
2. Review current repo state and identify the next bounded slice
3. Update the loop plan only
4. Do not implement

### If Mode is `status`

1. Summarize the current plan, blockers, and validation state
2. Report whether the loop is safe to continue

## Loop Rules

- Scout-first is mandatory.
- Validation happens before declaring done.
- Stop on destructive risk, secret risk, or an unclear irreversible change.
- Keep changes minimal and reversible.
- `ultra` has no final governance authority; it executes work only.
