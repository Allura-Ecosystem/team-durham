# Unified Model-Performance Telemetry

> **Historical design record:** This 2026-08-17 proposal describes a cross-harness Team RAM telemetry scope and uses `group_id=allura-system`. It is not active Team Durham memory guidance. Canonical Durham operations use `group_id=allura-team-durham`; cross-product handoffs go through the owning workflow.

**Status:** Approved architecture; implementation not started
**Date:** 2026-08-17
**Scope:** Outcome measurement for OpenCode, native Codex, and Claude Code.
**Authority:** AD-004, Hybrid Model Routing — Config as Enforcement Point.

## Decision

All three harnesses emit one provider-neutral, append-only **Route Receipt**
per completed task. Runtime adapters collect only their native lifecycle data;
Allura stores the raw receipt in the episodic event stream and produces a
weekly scorecard. The scorecard may recommend a routing revision, but cannot
change model assignment or policy.

This is deliberately not a proxy, a second router, or a transcript archive.
Harness configuration remains the enforcement point for model selection.

## Boundaries

| Concern | Owner | Contract |
| --- | --- | --- |
| Select a model | OpenCode, Codex, or Claude configuration | AD-004 routing policy |
| Capture lifecycle facts | Harness-specific adapter | Emits exactly one final receipt per task attempt |
| Supply validation evidence | Responsible agent or human reviewer | Evidence reference and outcome, never self-confidence alone |
| Persist raw evidence | Allura episodic stream | Append-only event, scoped by `group_id` |
| Aggregate and recommend | Weekly scorecard job | Read-only recommendation with sample count |
| Approve a routing change | Human + Brooks architecture gate | Explicit approved AD/config change |

## Route Receipt v1

```json
{
  "receipt_version": "v1",
  "run_id": "uuid",
  "attempt_id": "uuid",
  "group_id": "allura-system",
  "harness": "opencode | codex | claude_code",
  "session_ref": "opaque-session-reference",
  "agent": "agent identifier",
  "task_class": "architecture | coding | scout | vision | general | review",
  "provider": "openai | ollama | anthropic | other",
  "model": "provider-qualified model identifier",
  "route_contract": "declared AD-004 contract",
  "started_at": "ISO-8601 timestamp",
  "finished_at": "ISO-8601 timestamp",
  "latency_ms": 0,
  "retry_count": 0,
  "fallback_from": "optional provider/model",
  "fallback_reason": "optional controlled enum",
  "usage": { "input_tokens": null, "output_tokens": null, "cost_usd": null },
  "outcome": "passed | failed | partial | cancelled",
  "validation": {
    "kind": "tests | review | schema | human_approval | none",
    "evidence_ref": "opaque test run, review, or approval reference",
    "human_verdict": "approved | rejected | not_required"
  },
  "recorded_at": "ISO-8601 timestamp"
}
```

`task_class`, `outcome`, and `validation` are mandatory for a receipt to enter
scorecard calculations. Missing usage values remain `null`; adapters must not
invent token or cost data. Receipts never include prompts, response text,
transcripts, credentials, API keys, source code, or customer data.

### Controlled fallback reasons

`provider_unavailable`, `timeout`, `rate_limited`, `invalid_model`,
`tool_or_schema_failure`, `validation_failure`, and `human_escalation` are the
allowed automatic values. Any other reason is `other` with a short sanitized
note.

## Harness Adapters

### OpenCode

The OpenCode plugin lifecycle observes the resolved provider/model, task
start/end, retry and fallback state. Its closeout command attaches task class,
outcome, and evidence reference before emitting the final receipt. It must
write a receipt for the selected model even when a task fails.

### Native Codex

Codex hooks/session data provide lifecycle and resolved-model facts. Usage
fields are included only when the subscription/runtime exposes them. A Codex
closeout emits the same v1 receipt; ChatGPT subscription auth is represented
as `provider: openai`, never as a secret or credential field.

### Claude Code

`SessionStart` initializes an attempt; `PostToolUse` records bounded execution
signals; `Stop` produces the final v1 receipt after validation is attached.
The transcript path is an adapter-local correlation aid and is never copied
into Allura.

## Scorecard

The weekly job groups scored receipts by `harness`, `task_class`, `provider`,
and `model` and reports:

- sample count;
- validated success rate (`passed` with non-`none` validation / scored receipts);
- median latency in milliseconds;
- retry rate;
- fallback/escalation rate; and
- human-approval rate where a human verdict is required.

A lane is **informational** below 20 comparable scored receipts. At 20 or more
receipts, the scorecard may issue a recommendation only when the candidate has
materially better validated success or reliability without an unacceptable
latency/cost trade-off. It must show the sample counts and comparison cohort.
No aggregate of self-reported confidence can qualify a recommendation.

## Failure and Integrity Rules

1. Receipt emission failure is visible as `telemetry_failed`; it must not
   silently become a successful scored task.
2. A retry and its fallback are separate attempts sharing one `run_id`.
3. An unvalidated completion remains stored but is excluded from quality
   comparisons.
4. Allura's semantic layer receives only curator-approved, reusable findings;
   raw receipts remain episodic.
5. Cross-harness comparisons are allowed only when task class and validation
   requirements are equivalent.

## Delivery Sequence

1. Implement and validate the OpenCode adapter with fixture-based receipt
   tests and one live smoke receipt.
2. Enable the weekly scorecard after receipts exist; report, do not reroute.
3. Add native Codex and Claude Code adapters against the unchanged v1 schema.
4. Revisit AD-004 only with scorecard evidence and explicit approval.

## Acceptance Criteria

1. Every completed OpenCode task creates one final Route Receipt or an explicit
   telemetry-failure record.
2. A receipt can be written and read from Allura without sensitive payloads.
3. The scorecard reports all five metrics and excludes unvalidated tasks.
4. Codex and Claude adapters can emit v1 without schema changes.
5. No code path changes routing from a scorecard recommendation.
