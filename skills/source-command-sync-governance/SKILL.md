---
name: "source-command-sync-governance"
description: "Sync governance rules from Notion Agent OS into .Codex/rules/"
---

# source-command-sync-governance

Use this skill when the user asks to run the migrated source command `sync-governance`.

## Command Template

You are now in **Governance Sync Mode**.

## Instructions

1. Fetch the Agent OS page from Notion for the latest Team Durham roster
2. Fetch the Allura Blueprint from Notion for the latest authority map
3. Compare Notion rules against `.Codex/rules/` files
4. Update any rules that have changed in Notion
5. Log the sync event to PostgreSQL

## Authority Direction

**Notion → repo only.** Agents read from Notion at boot, write to repo and memory, never back to Notion templates.

## Rules

- Never auto-write repo content back to Notion
- Only update `.Codex/rules/` files
- Log all syncs: `event_type: 'GOVERNANCE_SYNC'`
