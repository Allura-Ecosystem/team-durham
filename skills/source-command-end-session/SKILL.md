---
name: "source-command-end-session"
description: "Session finalization - MUST run at end of every session"
---

# source-command-end-session

Use this skill when the user asks to run the migrated source command `end-session`.

## Command Template

# Session End Protocol

**MANDATORY: Run this at the end of EVERY session**

This command persists a durable session reflection to Allura Brain and records anything worth promoting.

## Usage

```bash
/end-session Completed Epic docs cleanup and memory hardening updates.
```

## Required Steps

1. Write a session reflection to Allura Brain
2. Include what changed, why, and what remains open
3. Promote durable learnings only when they are worth HITL review
4. **If native tools fail, fall back to MCP_DOCKER_insert_data**
5. **Tool namespace rule:** Codex may expose MCP tools as `mcp__allura-brain__memory_add`; OpenCode may expose the same operation as `allura-brain_memory_add`. Use whichever exact tool name is available in the current harness.

## Canonical Write Template (Primary — Allura Brain)

Use the exact namespace exposed by the current runtime:

- Codex: `mcp__allura-brain__memory_add`
- OpenCode / native alias: `allura-brain_memory_add`

```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "SESSION_END: " + summary,
  metadata: {
    source: "conversation",
    conversation_id: "current",
    agent_id: "kotler"
  },
  threshold: 0.9
});
```

## Fallback Write Template (When Allura Brain Fails)

If the Allura Brain tool returns an error (e.g. credential/env drift),
fall back to writing directly through MCP_DOCKER:

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'SESSION_END', 'allura-team-durham', 'kotler', 'completed',
    '{\"summary\": \"<what changed and why>\", \"what_remains_open\": \"<open items>\", \"brain_status\": \"degraded\", \"fallback_used\": true}'"
})
```

Also log the degradation:

```javascript
MCP_DOCKER_insert_data({
  table_name: "events",
  columns: "event_type, group_id, agent_id, status, metadata",
  values: "'MEMORY_DEGRADED', 'allura-team-durham', 'kotler', 'completed',
    '{\"backend\": \"allura-brain\", \"error\": \"<error message>\", \"fallback_used\": true}'"
})
```

## Success Criteria

- Reflection is stored (via either path)
- Summary includes what changed + why
- Degradation is logged if fallback was used

## Optional: Promote durable insight

```javascript
allura-brain_memory_promote({
  id: "<memory-id>",
  group_id: "allura-team-durham",
  user_id: "kotler",
  rationale: "Durable cross-session pattern worth curator review"
});
```

Note: Promotion requires native allura-brain tools. If unavailable, queue the promotion
by logging a `PROMOTION_REQUESTED` event via MCP_DOCKER, then promote after Brain is repaired.

## Never Do This

❌ Skip the final reflection
❌ Store secrets or PII in the summary
❌ Let a native tool failure prevent the reflection from being stored
❌ Silently continue without logging degradation

## Always Do This

✅ Try the available Allura Brain memory tool first (`mcp__allura-brain__*` or `allura-brain_*`), fall back to `MCP_DOCKER_insert_data`
✅ Include timestamp and group_id in observations
✅ Log `MEMORY_DEGRADED` if the native path failed
✅ Log `PROMOTION_REQUESTED` if promotion was desired but native tools were down
