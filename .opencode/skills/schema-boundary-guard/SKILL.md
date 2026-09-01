# SKILL.md — schema-boundary-guard

## Name
schema-boundary-guard

## Owner
troy-curator

## Purpose
Prevent schema mismatch crashes by testing that upstream output shapes fit downstream input constraints before they hit production.

## Problem It Solves
The watchdog crashed because `curatorScore` expected `content <= 2000` chars but received `JSON.stringify(event.metadata)` that was 5000+ chars. This skill catches that class of bug at validation time, not runtime.

## Inputs
1. `upstream_schema` — file path or inline Zod/Yup/Joi schema
2. `downstream_schema` — file path or inline schema that consumes upstream output
3. `sample_payloads` — optional: generator script or static fixtures
4. `max_size` — optional: explicit byte/char limit to test against

## Outputs
- PASS/FAIL per boundary
- Payload size breakdown (min/avg/max observed)
- Specific field overflow reports
- Suggested fixes (e.g., "truncate metadata before scoring" or "remove .max(2000) from scorer")

## Steps
1. Parse both schemas
2. If `sample_payloads` provided: run through upstream schema, measure output
3. If no samples: generate synthetic payloads at boundary sizes (empty, typical, max, 2x max)
4. Feed upstream output into downstream schema
5. Report violations with file:line references

## Rules
- CI-friendly: exit code 0 = all boundaries pass, 1 = any violation
- Must reference real file paths, not hallucinated ones
- If upstream schema has `.max(N)`, test `N`, `N+1`, and `2*N`
- If downstream has `.min(M)`, test `M-1`, `M`, and `M+1`
- Log all findings as episodic notes to Allura Brain with `source: schema-audit`

## Example
```
Test boundary between events.metadata and curatorScore.content:
  upstream: src/lib/memory/types.ts (event metadata schema)
  downstream: src/lib/curator/score.ts (ScoringContextSchema)
```

## Related
- curator/watchdog.ts
- memory/api-schemas.ts
- canonical-tools.ts
