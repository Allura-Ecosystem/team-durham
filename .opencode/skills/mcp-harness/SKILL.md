---
name: mcp-harness
description: "Plugin orchestration harness for MCP servers and agent skills. Explicit approval flow, Team RAM delegation, append-only audit trail. No auto-loading. Orchestrator approves before tools load."
version: 1.0.0
author: opencode
type: skill
category: infrastructure
tags:
  - mcp
  - orchestration
  - approval
  - audit
  - delegation
  - harness
---

# MCP Plugin Harness

> **The foreman decides which tools belong on the job site. No tool loads without approval. No specialist picks up a tool they weren't assigned. Every decision is logged.**

---

## Principles

1. **Explicit Approval** — No auto-discovery. The orchestrator approves before any MCP server or skill loads.
2. **Team RAM Delegation** — Skills are routed to the specialist best suited to execute them. Not every programmer uses every tool.
3. **Manual Curation** — The registry is a JSON file maintained by hand. No auto-fetch from external sources.
4. **Append-Only Audit** — Every MCP_APPROVED, MCP_LOADED, SKILL_PROPOSED, SKILL_LOADED event is logged (when memory is available). Immutable event trail.
5. **Graceful Degradation** — If a system is unavailable, the harness degrades to console warnings. No crashes. The tar pit is deep enough without adding our own holes.

---

## Architecture

```
User Request
    │
    ▼
┌─────────────────────────────┐
│   ORCHESTRATOR (Approval)   │
│                             │
│   /mcp-discover → list     │
│   /mcp-approve  → approve  │
│   /mcp-load     → activate │
│   /skill-propose → propose │
│   /skill-load   → delegate │
│                             │
└─────────┬───────────────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌────────┐  ┌──────────────┐
│ MEMORY │  │  TEAM RAM    │
│ (Audit)│  │  (Execution) │
│        │  │              │
│ events │  │  Woz   → impl│
│ table  │  │  Pike  → rev │
│        │  │  Fowler → ref│
│        │  │  Bellard→perf│
│        │  │  Scout → recon│
│        │  │  Jobs  → gate│
└────────┘  └──────────────┘
```

---

## Command Reference

### `/mcp-discover` — List Available Servers

```bash
/mcp-discover [filter]
```

Lists all MCP servers configured in `mcp-client-config.json`, showing:
- Server name
- Status: `approved`, `pending`, or `loaded`
- Available tools (if loaded)
- Connection health

**Filter options:**
- No argument — list all servers
- `database` — list database-related servers
- `approved` — list only approved servers
- `pending` — list only pending (not yet approved) servers

**Audit:** Logs `MCP_DISCOVER` event (when memory is available).

---

### `/mcp-approve <server-name>` — Approve an MCP Server

```bash
/mcp-approve <server-name>
```

Approves an MCP server for use. **The orchestrator must explicitly approve before any server is loaded.**

**Steps:**
1. Verify server exists in `mcp-client-config.json`
2. Log `MCP_APPROVED` event (when memory is available)
3. Add server to approved registry in `mcp-approved-servers.json`
4. Display confirmation with server details

**Approval criteria:**
- Does this server solve an essential problem or an accidental one?
- Does its interface have minimal surface area?
- Does it preserve conceptual integrity with existing tools?
- Is there already an approved server that overlaps its capability?

**Audit:** Logs `MCP_APPROVED` event. Cannot be undone (append-only).

---

### `/mcp-load <server-name>` — Activate an MCP Server

```bash
/mcp-load <server-name>
```

Loads an approved MCP server, making its tools available.

**Steps:**
1. Check approval status — if not approved, halt with message directing to `/mcp-approve`
2. Log `MCP_LOADED` event (when memory is available)
3. Display available tools for the loaded server
4. Server tools become available for delegation

**Audit:** Logs `MCP_LOADED` event. Tools are now in the active toolset.

---

### `/skill-propose <skill-name>` — Propose a Skill for Loading

```bash
/skill-propose context7
/skill-propose task-management
```

Shows skill details and proposes which specialist should execute it.

**Steps:**
1. Read skill's `SKILL.md` from `.opencode/skills/<skill>/`
2. Determine preferred executor based on skill category:

| Skill Category | Preferred Executor | Rationale |
|---|---|---|
| `infrastructure` | brooks | Architecture decisions |
| `development` | woz | Implementation |
| `context` | scout | Information gathering |
| `review` | pike | Interface assessment |
| `refactor` | fowler | Maintainability |
| `performance` | bellard | Measurement |
| `documentation` | fowler | Design drift tracking |

3. Log `SKILL_PROPOSED` event (when memory is available)
4. Display skill details, preferred executor, and approval prompt

**Audit:** Logs `SKILL_PROPOSED` event.

---

### `/skill-load <skill-name> [--executor <agent>]` — Load and Delegate a Skill

```bash
/skill-load context7 --executor scout
/skill-load task-management --executor woz
```

Loads a skill and assigns it to an executor agent.

**Steps:**
1. Verify skill exists in `.opencode/skills/<name>/SKILL.md`
2. If `--executor` specified, validate agent ID against registry
3. If no `--executor`, use preferred executor from skill metadata
4. Log `SKILL_LOADED` event with executor assignment (when memory is available)
5. Display loaded skill details and assigned executor

**Audit:** Logs `SKILL_LOADED` event with executor assignment.

---

## Event Schema

All harness events are logged to the `events` table (when memory is available):

```sql
-- MCP Events
'MCP_DISCOVER'        -- Server discovery listing
'MCP_APPROVED'         -- Server approved
'MCP_LOADED'          -- Server tools activated
'MCP_UNLOADED'        -- Server tools deactivated
'MCP_HEALTH_CHECK'    -- Server health probe result

-- Skill Events
'SKILL_PROPOSED'      -- Skill proposed for loading
'SKILL_LOADED'        -- Skill loaded and executor assigned
'SKILL_EXECUTED'      -- Skill execution completed
'SKILL_FAILED'        -- Skill execution failed
```

**Metadata format:**
```json
{
  "source": "mcp-harness",
  "event_type": "MCP_APPROVED",
  "server_name": "<server-name>",
  "approved_by": "<agent-id>",
  "tools_available": ["<tool-name>"],
  "timestamp": "2026-04-11T..."
}
```

---

## Approved Servers Registry

File: `.opencode/mcp-approved-servers.json`

```json
{
  "schema_version": "1.0.0",
  "approved_by": "<agent-id>",
  "last_updated": "2026-04-11T...",
  "servers": {
    "<server-name>": {
      "status": "approved",
      "approved_at": "2026-04-11T...",
      "approved_by": "<agent-id>",
      "tools": ["<tool-name>"],
      "category": "<category>",
      "essential": true,
      "rationale": "<why this server is approved>"
    }
  }
}
```

---

## Skill Registry

File: `.opencode/skills/mcp-harness/skill-registry.json`

```json
{
  "schema_version": "1.0.0",
  "skills": {
    "context7": {
      "status": "proposed",
      "category": "context",
      "preferred_executor": "scout",
      "description": "Retrieve up-to-date documentation for software libraries via Context7 API",
      "tools_required": ["bash"],
      "approved_by": null,
      "loaded_at": null
    },
    "task-management": {
      "status": "proposed",
      "category": "development",
      "preferred_executor": "woz",
      "description": "Track and manage feature subtasks with status, dependencies, and validation",
      "tools_required": ["bash"],
      "approved_by": null,
      "loaded_at": null
    },
    "mcp-harness": {
      "status": "approved",
      "category": "infrastructure",
      "preferred_executor": "brooks",
      "description": "Plugin orchestration harness. Explicit approval, Team RAM delegation, append-only audit.",
      "tools_required": ["bash"],
      "approved_by": "brooks",
      "loaded_at": "2026-04-11T..."
    }
  }
}
```

---

## Integration with Existing Harness

### With DAY_BUILD Mode

The MCP harness integrates into the DAY_BUILD execution flow:

```
Step 2: Scout recon
  → /mcp-discover (list available servers)
  → /mcp-approve <needed-servers> (orchestrator approves)

Step 5: Brooks ADRs
  → /skill-propose <needed-skills> (orchestrator proposes)
  → /skill-load <skill> --executor <agent> (orchestrator assigns)

Step 7: Woz implementation
  → Uses approved MCP servers and loaded skills
```

### With NIGHT_BUILD Mode

The MCP harness can stage likely next actions, but it still keeps the same approval boundary:

```
Step 2: Scout recon
  → /mcp-discover (show available servers)
  → /mcp-approve <needed-servers> (explicit approval still required)

Step 4: Brooks route
  → /skill-propose <needed-skills>
  → /skill-load <skill> --executor <agent>
```

### With Memory Health Check

The `/mcp-discover` command includes health check integration when memory is available:

- Check memory backend connectivity
- If degraded or unreachable, harness operates in degraded mode
- Console warnings already emitted by health check

---

## Use Cases

### Enterprise: Bank Lending

Loan officers process 100+ applications daily. AI needs to remember borrower history, regulatory flags, past decisions.

- Traces → episodic (automatic audit via events table)
- High-confidence facts → curator approves → semantic layer
- Next query: *"What do we know about this borrower type?"*
- Audit log satisfies regulatory review (append-only `MCP_APPROVED`, `SKILL_LOADED` events)

### Enterprise: HACCP Food Safety

Manufacturers need AI to remember hazard patterns, corrective actions, non-conformance history.

- Audit → episodic event
- Hazard patterns → curator approves → semantic promotion
- CSV export proves compliance

### Consumer: Developer Session Memory

Sessions end. Next session, AI has no memory.

- During session → episodic traces via `TASK_COMPLETE`, `SESSION_START` events
- User promotes key facts → `ADR_CREATED` with confidence ≥ 0.85
- Next session → context loads automatically

---

## Never Do This

❌ Auto-load MCP servers without orchestrator approval
❌ Auto-fetch skills from external sources
❌ Skip the audit log (when memory is available)
❌ Allow any agent to approve their own tools
❌ Crash if a server is unavailable — degrade gracefully

## Always Do This

✅ Orchestrator approves before tools load
✅ Log every MCP_APPROVED, MCP_LOADED, SKILL_PROPOSED, SKILL_LOADED event (when memory is available)
✅ Route skills to the specialist best suited for the category
✅ Health-check memory stack before operations (when available)
✅ Degrade gracefully with console warnings when systems are unavailable
