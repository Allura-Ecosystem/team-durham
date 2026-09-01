---
name: code-review
description: Review code changes for correctness, regressions, security, contract drift, and missing tests using findings-first output and repo-specific guardrails.
---

# Code Review

Use this skill when the user asks for a code review, PR review, risk audit, architecture review of changes, or pre-merge assessment.

## Purpose

Review changed code with a findings-first posture. Prioritize correctness and system integrity over style commentary.

## When to Use

- User asks for a review
- Reviewing a branch, diff, staged changes, or PR
- Auditing risk before merge
- Checking whether a change matches repository guardrails

## Review Priorities

Review in this order:

1. Correctness
2. Regressions
3. Security
4. Data integrity and contract drift
5. Missing tests or weak verification
6. Maintainability

## Repo-Specific Guardrails

Always check for these repository invariants:

- Enforce `group_id` on DB read and write paths
- Preserve append-only PostgreSQL trace behavior
- Preserve Neo4j lineage via `SUPERSEDES` instead of mutation
- Require HITL for behavior-changing promotion flows
- Validate external boundaries with Zod
- Prevent server-only modules from being imported into client code
- Keep secrets out of source, docs, logs, and memory artifacts
- Respect Next.js server/client boundaries

## Required Workflow

1. Inspect changed files first
2. Read nearby code to understand local patterns
3. Compare the change to existing project conventions
4. Identify concrete issues with evidence
5. Check testing impact and missing coverage
6. Report findings first, ordered by severity

## Severity Model

Use exactly these levels:

- Critical
- High
- Medium
- Low

Escalate severity when the issue can cause:

- data corruption
- security exposure
- broken production flows
- contract/schema drift
- governance bypass

## Testing Expectations

Check whether the change includes or should include:

- regression tests for bug fixes
- integration coverage for DB, workflow, or promotion changes
- typecheck, lint, and test evidence when relevant
- negative-path coverage for validation and boundary failures

If verification was not run, say so plainly.

## Output Contract

Always structure the result like this:

### Findings
- Severity — `file:line` — issue, impact, and why it matters

### Open Questions
- Assumptions, ambiguous intent, or missing context

### Residual Risks
- Unverified behavior, missing coverage, or rollout concerns

### Summary
- Brief only if useful

## Rules

- Lead with findings, not praise
- Do not invent speculative issues without evidence
- Prefer fewer high-signal findings over many weak nits
- Include file and line references whenever possible
- Keep summaries secondary to actionable review comments
- If there are no findings, say so explicitly and list any residual risk
