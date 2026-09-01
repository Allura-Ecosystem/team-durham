# SKILL.md — harness-recommendation-advisor

## Name
harness-recommendation-advisor

## Owner
troy-curator

## Purpose
Inspect a project's CLI harness setup, compare its work needs against available agents/skills/memories, and output team-specific recommendations.

## Modes
- `mode=talon` → OpenClaw native agent/skill/review recommendations
- `mode=ram` → project-local OpenCode repo harness recommendations
- `mode=iris` → OpenClaw native UX/QA harness recommendations
- `mode=durham` → Claude/OpenCode brand/design harness recommendations

## Inputs
1. `project_path` — absolute or relative path to project root
2. `mode` — one of `talon`, `ram`, `iris`, `durham`
3. `depth` — optional: `quick` (top-level scan) or `deep` (full tree + Allura memory search)

## Outputs
- Recommended skills to create or activate
- Recommended memories to capture
- Stale/duplicate skills detected
- Missing source-of-truth docs
- Routing conflicts (wrong team assigned to wrong runtime)
- Approval-needed actions

## Steps
1. Resolve `project_path` with `readlink -f`
2. Scan `.opencode/`, `.claude/`, `.codex/`, `agents/`, `skills/`, MCP configs
3. Read `package.json`, `OWNERS.yaml`, or equivalent ownership files
4. Search Allura Brain for project history (last 30 days)
5. Compare findings against the four-team model:
   - TALON/IRIS = OpenClaw native
   - RAM/Durham = project-local CLI
6. Flag mismatches
7. Output structured report

## Rules
- Read-only by default — no file mutations unless explicitly approved
- If `project_path` resolves inside `/media/ronin704/Games/linux-home/.openclaw`, follow resolved realpath
- Blocked paths: warn once, skip, log to blocked-path set, never retry same run
- Queen City rule: one owner, one reviewer, receipts in Allura

## Example
```
Run harness-recommendation-advisor on /home/ronin704/Projects/ai-agents/allura-memory with mode=ram
```

## Related
- skill-roster-sync-audit
- ruvix-preflight-certifier
- Four-team harness model (memory/2026-05-16.md)
