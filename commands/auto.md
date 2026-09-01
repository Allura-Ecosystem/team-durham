---
description: "Team Durham auto-mode — bounded autonomous brand execution with Scout-first loading, lazy specialist routing, token/iteration budgets, verification, Brain receipts, and ship/governance hard stops."
argument-hint: "[--budget <tokens>] [--max <iterations>] <brand task description>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
  - Skill
  - Task
  - allura-brain__memory_search
  - allura-brain__memory_add
---

# /auto — Team Durham Bounded Auto Mode

`/auto` is the common Team Durham front door. It delegates to `/brand-auto` and
the `brand-loop` skill; it is an alias and policy adapter, not a second engine.

## Contract

1. **Observe** — run Durham Scout read-only and return a compact ContextPacket.
2. **Choose** — load only the routed specialist and required skill.
3. **Act** — produce one reversible, non-shipping brand slice.
4. **Verify** — run Munari QA, Rubin taste, or an explicit acceptance check.
5. **Record** — write a trace to `group_id="allura-team-durham"`.
6. **Repeat/Stop** — continue only with measurable progress inside both budgets.

## Loading and Token Budget

- Scout ContextPacket: maximum 700 output tokens.
- Default run budget: 12,000 combined input/output tokens.
- Default iterations: 5; hard maximum: 8.
- Load the lightweight Durham roster first. Never eagerly load all agents, all
  skills, Figma API references, Impeccable scripts, or unrelated design packs.
- Load one specialist plus 1–3 task skills after routing.
- Reaching either budget ends as `exhausted`; never truncate verification and
  claim success.

## Hard Stops

Stop as `approval-required` for external publishing/sending, locked-strategy
changes, asset deletion, dependency/configuration mutation, governance changes,
or any action outside the current client/project boundary.

## Execution

Parse `$ARGUMENTS`, apply `--budget` and `--max`, then execute the existing
`/brand-auto` protocol. Preserve its terminal states and Brain namespace. Report:
terminal state, specialist, iterations, tokens in/out, artifact paths, and exact
verification evidence.
