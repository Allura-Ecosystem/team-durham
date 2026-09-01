# SKILL.md — memory-hygiene-auditor

## Name
memory-hygiene-auditor

## Owner
troy-curator

## Purpose
Automated detection of memory quality issues: duplicates, stale facts, bad group IDs, missing embeddings, legacy schema drift, and retention candidates.

## Inputs
1. `group_id` — tenant namespace (default: allura-system)
2. `days_lookback` — how far back to audit (default: 30)
3. `checks` — optional: comma-separated list of checks to run, or `all`

## Checks
| Check | What It Finds | Severity |
|-------|---------------|----------|
| `duplicates` | Content groups with >1 identical or near-identical memory | MEDIUM |
| `stale-facts` | Memories not recalled in `days_lookback` days | LOW |
| `bad-group-ids` | Memories with malformed or non-canonical `group_id` | HIGH |
| `missing-embeddings` | Episodic memories lacking vector embedding | HIGH |
| `legacy-schema` | References to deprecated columns (e.g., `embedding_1024`) | MEDIUM |
| `retention-candidates` | Memories older than retention policy, unused | LOW |
| `promotion-candidates` | High-confidence memories still in episodic store | MEDIUM |

## Outputs
- Structured report per check
- Affected memory IDs
- Recommended action per finding
- Estimated storage impact (if cleanup applied)

## Steps
1. Query PostgreSQL for memory inventory
2. Query Neo4j for semantic store state (if available)
3. Run checks in parallel where safe
4. Cross-reference with `events` table for recall patterns
5. Output report with `memory_id` + `recommendation`

## Rules
- READ-ONLY by default — never delete or promote without explicit approval
- Log all findings to Allura Brain as `memory-hygiene` events
- If Neo4j is unreachable, skip graph checks and note degradation
- Respect `PERMISSION-LADDER.md` — retention deletion needs Captain approval

## Example
```
Run memory-hygiene-auditor on allura-system for last 7 days, all checks
```

## Related
- TROY-MEMORY-HYGIENE.md template
- curator/watchdog.ts (promotion candidates)
