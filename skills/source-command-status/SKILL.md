---
name: "source-command-status"
description: "Check the current status of the brand production pipeline"
---

# source-command-status

Use this skill when the user asks to run the migrated source command `status`.

## Command Template

# Pipeline Status Check

Check the current status of the brand production pipeline for all clients or a specific client.

## Usage

```
/status
/status [client-name]
```

## What This Command Does

1. **Query Allura Brain** for recent events:
   ```javascript
   allura-brain_memory_search({
     query: "recent events",
     group_id: "allura-team-durham",
     limit: 20
   })
   ```

2. **Check deliverables** in `clients/{brand}/`:
   - `01_strategist_strategy-pack.md`
   - `02_namer_naming-pack.md`
   - `03_visual-director_logo-pack.md`
   - `04_brand-kit-builder_brand-kit.md`
   - `05_qa-reviewer_qa-report.md`
   - `06_allura-memory_brand-truth.json`
   - `07_report_pipeline-summary.md`

3. **Report status** for each phase:
   - ✅ Complete (deliverable exists + approved)
   - 🔄 In Progress (deliverable exists, not approved)
   - ⏳ Pending (no deliverable)
   - ❌ Blocked (issues identified)

## Output Format

```
# Pipeline Status — [Client Name]

## Phase Summary
| Phase | Status | Agent | Deliverable |
|-------|--------|-------|-------------|
| 0 | ✅ | Kotler | Validated brief |
| 1 | ✅ | Aaker | Strategy Pack |
| 2 | 🔄 | Aaker+Ogilvy | Naming Pack (pending approval) |
| 3 | ⏳ | Glaser | — |
| 4 | ⏳ | Rand | — |
| 5 | ⏳ | Munari | — |
| 6 | ⏳ | Kotler | — |
| 7 | ⏳ | Kotler | — |

## Recent Activity
- [timestamp] [agent] [event_type]
- [timestamp] [agent] [event_type]

## Next Steps
[Recommended actions]
```

## Rules

- Always use `group_id = 'allura-team-durham'`
- Report actual file existence, not just event logs
- Identify blockers and suggest next actions
