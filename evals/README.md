# Prompt evaluations

This directory is the canonical home for Team Durham prompt-evaluation policy and snapshots.

- `current.json` records the baseline inventory.
- `candidate-after-core-prompt-cleanup.json` records the evaluated candidate.
- `final.json` records the accepted package snapshot.

Evaluation snapshots describe all 13 loadable definitions, including the `openagent` compatibility fallback. Product roster assertions are governed by `SOURCE.json`: 12 canonical roles plus one fallback.

When agent or skill prompts materially change, generate a new named candidate, review it, and update `final.json` only after acceptance. Do not treat approximate token counts as functional quality evidence.
