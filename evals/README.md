# Prompt evaluations

This directory is the canonical home for Team Durham prompt-evaluation policy and snapshots.

- `current.json` records the baseline inventory.
- `candidate-after-core-prompt-cleanup.json` records the evaluated candidate.
- `final.json` records the accepted package snapshot.

Evaluation snapshots describe all 13 loadable definitions, including the `openagent` compatibility fallback. Product roster assertions are governed by `SOURCE.json`: 12 canonical roles plus one fallback.

When agent or skill prompts materially change, generate a new named candidate, review it, and update `final.json` only after acceptance. Do not treat approximate token counts as functional quality evidence.

`candidate-adaptive-workflow.json` inventories the 0.4.0 candidate.
`adaptive-routing.json` supplies positive and negative dependency/risk cases.
`python3 scripts/validate_repository.py` runs the offline prompt-contract checks,
including policy references, model inheritance, tenant-scoped packet fields, and
risk precedence. Historical `final.json` is not a claim of runtime acceptance for
this candidate. Live latency, model capability, output quality, and cost remain
unmeasured; validate those with representative tasks before calling it faster.
