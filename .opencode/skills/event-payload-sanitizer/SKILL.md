# SKILL.md — event-payload-sanitizer

## Name
event-payload-sanitizer

## Owner
troy-curator

## Purpose
Ensure event metadata written to PostgreSQL fits within documented size limits and downstream schema constraints before storage.

## Problem It Solves
The watchdog passed `JSON.stringify(event.metadata)` directly to `curatorScore`. When metadata contained full conversation dumps, the scorer's `max(2000)` schema rejected it. This skill prevents oversized payloads from ever reaching downstream consumers.

## Inputs
1. `payload` — raw event metadata object or JSON string
2. `target_schema` — downstream schema that will consume this payload
3. `max_metadata_bytes` — optional: hard limit (default: 4096)
4. `strategy` — optional: `truncate`, `split`, `compress`, or `reject`

## Outputs
- Sanitized payload (if strategy applied)
- Size before/after
- Fields modified or removed
- Rejection reason (if rejected)
- Log entry with event_id

## Steps
1. Measure payload size (chars and bytes)
2. Check against `max_metadata_bytes`
3. If oversized, apply `strategy`:
   - `truncate`: remove longest string fields first, add `[...truncated]`
   - `split`: break into multiple linked events
   - `compress`: use zlib/base64 (not human-readable, use sparingly)
   - `reject`: fail fast with clear error
4. Validate sanitized payload against `target_schema`
5. Return clean payload or throw structured error

## Rules
- Default strategy: `truncate` (never silently lose data)
- Always preserve `event_type`, `agent_id`, `group_id`, `created_at`
- If `reject` chosen, log to Allura Brain with `source: payload-rejected`
- Never mutate the original event row in PostgreSQL — return sanitized copy only

## Example
```
Sanitize watchdog event metadata before curator scoring:
  payload: { type: "user_message", metadata: { conversation: "...5000 chars..." } }
  target_schema: ScoringContextSchema (src/lib/curator/score.ts)
  strategy: truncate
```

## Related
- schema-boundary-guard (validates the boundary)
- curator/watchdog.ts (consumer)
