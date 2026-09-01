---
name: "source-command-party"
description: "Party mode — launch Team Durham multi-agent roundtable or parallel dispatch"
---

# source-command-party

Use this skill when the user asks to run the migrated source command `party`.

## Command Template

# Party Mode — Team Durham

Launch multiple specialists simultaneously. Kotler orchestrates; Team Durham executes or debates.

## Usage

```
/party <topic or task>
/party roundtable <debate topic>     ← Multi-agent deliberation
/party dispatch <task description>   ← Parallel execution
```

If no mode is specified, the orchestrator auto-detects:
- **Questions, debates, tradeoffs** → Roundtable mode
- **Action verbs, deliverables, tasks** → Parallel dispatch mode

---

## Mode 1: Roundtable — Multi-Agent Brand Deliberation

Put 2-4 specialists in one room to debate, disagree, and converge. All agents respond in character with Brain-backed evidence. Kotler facilitates.

### When to Use

- Positioning debates with real tradeoffs
- Visual direction decisions where strategy and creative collide
- Post-mortems when a deliverable missed the mark
- Any decision where one perspective isn't enough

### Protocol

#### Phase 1: Hydrate (Brain Read)

Before any agent speaks, load context:

1. Search Allura Brain for the topic
2. Search for the client's past decisions
3. Read client deliverable files (Strategy Pack, Logo Pack, etc.)

```
allura-brain_memory_search({ query: "<topic>", group_id: "allura-team-durham", limit: 10 })
allura-brain_memory_search({ query: "<client> decisions", group_id: "allura-team-durham", limit: 5 })
```

#### Phase 2: Select Agents

Pick 2-4 agents (plus Kotler) based on:
- Topic keywords match agent expertise
- Client has deliverables from that agent
- Diverse perspectives (always include a challenger)

**Rules:** Kotler always facilitates. Min 3 agents. Max 5. Rotate across sessions.

#### Phase 3: Roundtable

Simulate all agents in one conversation. Format:

```
🎯 **Kotler**: [opens with context and question]
🧠 **Aaker**: [responds with framework and evidence]
📊 **Tufte**: [responds with data, may challenge Aaker]
✍️ **Ogilvy**: [builds on or challenges, with audience reality]
🎯 **Kotler**: [synthesizes, directs next round]
```

**Turn rules:**
- Each agent responds once per round
- Agents CAN directly address each other
- Kotler synthesizes after 2-3 rounds
- If convergence → record decision
- If divergence → Kotler names the disagreement, asks for evidence
- User can interrupt, redirect, or add agents at any time

#### Phase 4: Brain Write

**During roundtable:** Log each significant exchange to Brain (episodic).

**When decision reached:** Promote to the semantic knowledge graph.

**When party ends:** Consolidated reflection + PostgreSQL event.

```
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "<agent-id>",
  content: "Party Mode [<id>]: <Agent> argued <position>. Reason: <evidence>.",
  metadata: { source: "party-mode", conversation_id: "<id>", agent_id: "<id>", topic: "<topic>" }
})

allura-brain_memory_promote({
  id: "<episodic-id>", group_id: "allura-team-durham", user_id: "kotler",
  rationale: "Multi-agent consensus: <decision>."
})
```

### Exit Commands

| Command | Effect |
|---------|--------|
| `goodbye` / `end party` / `quit` | End party, write reflection |
| `wrap it up` | Final synthesis, then end |
| `add <agent>` | Invite another agent |
| `remove <agent>` | Dismiss an agent |
| `summary` | Print decisions + open questions without ending |

---

## Mode 2: Parallel Dispatch — Multi-Agent Execution

The original party mode. Agents execute independent tasks simultaneously.

### When to Use

- Building multiple deliverables at once
- Running brand audits across many files
- QA review with multiple checking in parallel
- Any task that decomposes into independent subtasks

### Protocol

#### Phase 1: Decompose (Kotler)

Kotler reads the task and decomposes into **independent subtasks**.
Each subtask maps to one Team Durham agent. Identify dependencies:

```
Subtasks with NO dependencies → run in PARALLEL (same turn)
Subtasks that depend on others → run AFTER dependency completes
```

#### Phase 2: Dispatch (Parallel Launch)

Launch ALL independent agents in a **single message** using the Task tool:

```
// Example: "Build brand kit for new wellness startup"
// Independent subtasks — launch all at once:

Task(subagent_type: "SCOUT_RECON", prompt: "Find all existing brand assets...")
Task(subagent_type: "DATA_ANALYST", prompt: "Research competitive landscape...")
Task(subagent_type: "VISUAL_DIRECTOR", prompt: "Define visual direction...")
Task(subagent_type: "COPYWRITER", prompt: "Draft brand voice guidelines...")
```

#### Phase 3: Collect & Validate

After all parallel agents complete:
1. **Aaker gate**: Validate positioning and strategy alignment
2. **Glaser gate**: Review visual direction consistency
3. **Munari gate**: Brand consistency review across all outputs

#### Phase 4: Synthesize & Commit

Kotler synthesizes all results, resolves conflicts, and commits.

---

## Team Durham Roster

| Agent | Subagent Type | Role | Roundtable? | Dispatch? |
|-------|--------------|------|------------|-----------|
| **Kotler** | `BRAND_ORCHESTRATOR` | Orchestrator/facilitator | ✅ Always | ✅ Decompose |
| **Aaker** | `BRAND_STRATEGIST` | Strategy anchor | ✅ Positioning | ✅ Strategy gate |
| **Ogilvy** | `COPYWRITER` | Voice + messaging | ✅ Copy debates | ✅ Write content |
| **Glaser** | `VISUAL_DIRECTOR` | Visual authority | ✅ Direction debates | ✅ Visual direction |
| **Rand** | `BRAND_KIT_BUILDER` | Assembly reality check | ✅ Spec debates | ✅ Build deliverables |
| **Munari** | `QA_REVIEWER` | Quality critic | ✅ Flags issues | ✅ QA review |
| **Tufte** | `DATA_ANALYST` | Evidence anchor | ✅ Data debates | ✅ Research |
| **Scout** | `SCOUT_RECON` | Recon | ❌ No debating | ✅ File discovery |

---

## Mode Detection Examples

| Input | Detected Mode |
|-------|--------------|
| `/party Should we rebrand?` | Roundtable |
| `/party Fun vs premium positioning?` | Roundtable |
| `/party Debate the color palette` | Roundtable |
| `/party roundtable: naming direction` | Roundtable (explicit) |
| `/party Build the brand kit` | Parallel Dispatch |
| `/party Generate logos and copy pack` | Parallel Dispatch |
| `/party dispatch: audit all assets` | Parallel Dispatch (explicit) |

---

## Rules

1. **At least 3 agents per roundtable** — no solo debates
2. **Kotler never implements** — orchestrates, synthesizes, commits
3. **Munari gates every delivery** — no commits without QA review passing
4. **group_id on every DB operation** — `allura-team-durham`
5. **No decisions without Brain search first** — agents cite evidence
6. **Agents who lack data say "I don't have data on this"** — they don't guess
7. **Promotion to the semantic knowledge graph only for multi-agent consensus** — not individual opinions

---

**Invoke with:** `/party <topic or task>`
