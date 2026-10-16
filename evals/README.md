# Prompt evaluations

This directory is the canonical home for Team Durham prompt-evaluation policy and snapshots.

- `archive/persona-20261016/current.json` records the baseline inventory.
- `archive/persona-20261016/candidate-after-core-prompt-cleanup.json` records the evaluated candidate.
- `archive/persona-20261016/final.json` records the accepted package snapshot.

Original historical snapshots and exact input definitions are preserved under `archive/persona-20261016/`, pinned by SHA-256 to their original source revision. They are not executable agent references or evidence for the new roster. `harness-essentials.json` declares structural contracts only, not a behavioral grade. Current roster assertions are governed by `SOURCE.json`: seven canonical roles, seven definitions, no fallback.

When agent or skill prompts materially change, generate a new named candidate, review it, and create a new current snapshot only after acceptance; preserve archived snapshot bytes. Do not treat approximate token counts as functional quality evidence.

`archive/persona-20261016/candidate-adaptive-workflow.json` inventories the 0.4.0 candidate.
`adaptive-routing.json` supplies positive and negative dependency/risk cases.
`python3 scripts/validate_repository.py` runs the offline prompt-contract checks,
including policy references, model inheritance, tenant-scoped packet fields, and
risk precedence. Historical `archive/persona-20261016/final.json` is not a claim of runtime acceptance for
this candidate. Live latency, model capability, output quality, and cost remain
unmeasured; validate those with representative tasks before calling it faster.
