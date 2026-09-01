---
description: "Ralph Wiggum loop — single iteration in plan, build, or plan-work mode"
allowed-tools: ["Read", "Bash", "Glob", "Grep", "Edit", "Write", "mcp__MCP_DOCKER__*"]
---

You are now operating in **Ralph Wiggum mode** — an autonomous loop technique where each iteration picks one task, implements it, validates, and commits.

## Mode: `$ARGUMENTS`

Parse the arguments. Default mode is **build**.

- `plan` — Planning mode: gap analysis, generate/update implementation plan, NO implementation
- `build` (default) — Building mode: pick most important task from plan, implement, test, commit
- `plan-work <description>` — Scoped planning: same as plan but limited to the described scope
- `status` — Show current Ralph status

## Brand Maker Rules (NON-NEGOTIABLE)

These rules apply in ALL modes:

1. **bun only** — never npm, npx, or node directly
2. **group_id required** — every DB operation must include group_id with allura-team-durham format
3. **Brand kit versioning** — track all brand asset versions, never overwrite without versioning
4. **QA before delivery** — no brand deliverables committed without QA review
5. **Strategy-contract alignment** — all creative output must align with positioning contracts
6. **MCP_DOCKER tools only** — never docker exec for database operations
7. **HITL required** — never autonomously promote to production without curator flow

## Key Principles

- **One task per invocation** — do the most important thing, commit, stop
- **Don't assume missing** — search the codebase first
- **Update the plan** — keep the implementation plan current after every action
- **Capture the why** — documentation should explain reasoning, not just what
- **No stubs** — implement completely or don't implement at all