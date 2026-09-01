---
name: party-mode
description: Multi-agent brand roundtable with hybrid execution modes. Debate mode (chat) for strategic decisions, Parallel mode (silent dispatch) for task execution. Both modes log to Brain automatically.
---

# Skill: party-mode

# Party Mode — Hybrid Multi-Agent Execution

> **Orchestrator:** @Kotler (Brand Orchestrator)
> **Modes:** Debate (chat) | Parallel (silent dispatch)
> **group_id:** `allura-team-durham`

---

## Quick Start

```bash
# Debate Mode — Strategic decisions with mock chat
/party "Should Allura use warm yellow or cream primary?"
/party "Fun vs premium positioning?"

# Parallel Mode — Execute tasks with sub-agents
/party build brand kit for wellness startup
/party generate logos and copy pack
/party audit all deliverables
```

---

## Two Modes

### 🔥 Mode 1: Debate (Roundtable)

**When to use:** Questions, comparisons, strategic decisions, positioning debates

**Trigger patterns:**
- Question mark `?`
- Comparison words: `vs`, `or`, `versus`, `compare`, `difference`
- Debate words: `should`, `debate`, `discuss`, `argue`, `decide between`

**What happens:**
1. Kotler hydrates from Brain (searches past decisions)
2. Selects 3-4 agents based on topic
3. Generates mock chat transcript (agents debate in character)
4. Logs debate + decision to Brain
5. Returns: Chat transcript + decision + Brain event ID

**Example output:**
```
🎯 **Kotler**: Allura color debate — warm yellow vs cream.

🧠 **Aaker**: Caregiver archetype demands warmth. Yellow is action.

🎨 **Glaser**: Cream is sophisticated. Editorial reference uses it.

🔍 **Munari**: Both pass WCAG. Yellow has better contrast.

🎯 **Kotler**: Decision — Primary: Warm Yellow. Secondary: Cream.
```

---

### ⚡ Mode 2: Parallel (Silent Dispatch)

**When to use:** Tasks, execution, building, generating, auditing

**Trigger patterns:**
- Action verbs: `build`, `create`, `generate`, `assemble`, `audit`, `execute`, `run`
- Multiple deliverables requested
- File operations: `write`, `edit`, `update`, `sync`

**What happens:**
1. Kotler decomposes task into independent subtasks
2. Dispatches sub-agents in **parallel** via Task tool
3. Agents execute silently (no chat transcript)
4. Collects results as they complete
5. Validates outputs (Aaker→Glaser→Munari gates)
6. Logs completion to Brain
7. Returns: Deliverables + validation report + Brain event IDs

**Sub-agent dispatch example:**
```javascript
// Kotler decomposes: "build brand kit"
// → 4 parallel tasks

TaskCreate({
  agent: "aaker",
  task: "Validate strategy alignment",
  blockedBy: []
})

TaskCreate({
  agent: "glaser",
  task: "Create color system",
  blockedBy: []
})

TaskCreate({
  agent: "ogilvy",
  task: "Write copy guidelines",
  blockedBy: []
})

TaskCreate({
  agent: "rand",
  task: "Assemble brand kit sections",
  blockedBy: [aakerTask, glaserTask, ogilvyTask] // depends on all
})
```

---

## Mode Detection Algorithm

```javascript
function detectMode(userInput) {
  const input = userInput.toLowerCase();

  // Roundtable indicators (check first — questions override actions)
  const roundtablePatterns = [
    /\?/,                           // Questions
    /\b(vs|versus|or)\b/,           // Comparisons
    /\b(should|debate|discuss|argue|decide between)\b/,
    /\b(which|what|why|how about)\b/
  ];

  for (const pattern of roundtablePatterns) {
    if (pattern.test(input)) return 'roundtable';
  }

  // Parallel indicators
  const parallelPatterns = [
    /\b(build|create|generate|make|produce|write|edit|update|sync)\b/,
    /\b(audit|validate|check|review|test)\b/,
    /\b(run|execute|perform|do|start|launch)\b/,
    /\band\b.*\b(and)\b/            // Multiple items
  ];

  for (const pattern of parallelPatterns) {
    if (pattern.test(input)) return 'parallel';
  }

  // Default: roundtable (safer for ambiguous input)
  return 'roundtable';
}
```

---

## Agent Roster

| Code | Name | Mode | Role | Parallel Tasks |
|------|------|------|------|----------------|
| kotler | Philip Kotler | Both | Orchestrator, facilitator | Task decomposition, synthesis |
| aaker | Jennifer Aaker | Both | Brand strategy | Strategy validation, positioning |
| glaser | Milton Glaser | Both | Visual director | Color systems, logos, visual |
| ogilvy | David Ogilvy | Both | Copywriter | Messaging, naming, voice |
| rand | Paul Rand | Parallel | Brand kit builder | Assembly, documentation |
| munari | Bruno Munari | Both | QA reviewer | Consistency checks, validation |
| tufte | Edward Tufte | Both | Data analyst | Competitive research, insights |
| scout | Scout | Parallel | Recon | Discovery, file search, read |

---

## Parallel Dispatch Architecture

```
User Request
    ↓
Mode Detection (Debate vs Parallel)
    ↓
[Parallel Mode]
    ↓
Task Decomposition (Kotler)
    ↓
Dependency Graph
    ├─ Independent tasks → Launch in parallel
    └─ Dependent tasks → Queue for later
    ↓
Task Tool Launch
    ├─ Agent 1 (Scout: Discovery)
    ├─ Agent 2 (Aaker: Strategy validation)
    ├─ Agent 3 (Glaser: Color system)
    └─ Agent 4 (Ogilvy: Copy)
    ↓
Real-time Collection
    ├─ Task 1 completes → Validate → Log to Brain
    ├─ Task 2 completes → Validate → Log to Brain
    └─ ...
    ↓
Validation Gates
    ├─ Aaker gate: Strategy alignment
    ├─ Glaser gate: Visual consistency
    └─ Munari gate: QA / Production readiness
    ↓
Synthesis (Kotler)
    ↓
Deliverables + Brain audit trail
```

---

## Brain Integration

### Pre-Hook: Always Search Before Acting

```javascript
// Before any debate or dispatch
memory_search({
  query: userTopic,
  group_id: "allura-team-durham",
  limit: 10
});

// Agent-specific context
memory_search({
  query: "color palette decisions",
  group_id: "allura-team-durham",
  user_id: "glaser"
});
```

### Post-Hook: Log Everything

**Roundtable debate logged:**
```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "Party Mode [DEBATE]: Topic: warm yellow vs cream. Agents: Aaker, Glaser, Munari. Decision: Warm Yellow primary. Rationale: Caregiver warmth + better contrast. Open: None.",
  metadata: {
    mode: "roundtable",
    topic: "color decision",
    agents: ["aaker", "glaser", "munari"],
    decision: "warm yellow primary",
    client: "allura-memory"
  }
});
```

**Parallel task logged:**
```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: "Party Mode [PARALLEL]: Task: build brand kit. Subtasks: 4. Agents: Aaker, Glaser, Ogilvy, Rand. Status: completed. Deliverables: brand-kit.md, color-system.json.",
  metadata: {
    mode: "parallel",
    task: "build brand kit",
    subtasks: 4,
    agents: ["aaker", "glaser", "ogilvy", "rand"],
    deliverables: ["brand-kit.md", "color-system.json"],
    client: "allura-memory"
  }
});
```

---

## Sub-Agent Task Definitions

### Task: Scout Discovery
```javascript
{
  agent: "scout",
  description: "Discovery for [client]",
  prompt: "Search codebase for: client files, existing deliverables, brand strategy. Report: file paths, current status, blockers.",
  subagent_type: "Explore"
}
```

### Task: Aaker Strategy Validation
```javascript
{
  agent: "aaker",
  description: "Validate strategy alignment",
  prompt: "Check deliverables against archetype and positioning. Report: alignment score, issues, recommendations.",
  subagent_type: "brand-strategist"
}
```

### Task: Glaser Visual System
```javascript
{
  agent: "glaser",
  description: "Create visual system",
  prompt: "Generate color system, typography, logo guidelines. Use asset-first-design skill if logos needed.",
  subagent_type: "visual-director"
}
```

### Task: Ogilvy Copy
```javascript
{
  agent: "ogilvy",
  description: "Write copy guidelines",
  prompt: "Create messaging framework, voice/tone, sample copy. Align with archetype.",
  subagent_type: "copywriter"
}
```

### Task: Rand Assembly
```javascript
{
  agent: "rand",
  description: "Assemble brand kit",
  prompt: "Compile 10-section brand kit from agent outputs. Ensure consistency.",
  subagent_type: "brand-kit-builder"
}
```

### Task: Munari QA
```javascript
{
  agent: "munari",
  description: "QA validation",
  prompt: "Review all deliverables against QA checklist. Report: score, issues, blockers.",
  subagent_type: "qa-reviewer"
}
```

---

## Validation Gates

**Aaker Gate (Strategy):**
- Archetype alignment ≥ 90%
- Positioning statement locked
- Brand personality dimensions defined

**Glaser Gate (Visual):**
- Color system documented
- Typography hierarchy defined
- Logo variations complete

**Munari Gate (QA):**
- Consistency across all sections
- Production-ready checklist passed
- No critical blockers

---

## Exit Commands

| Command | Effect |
|---------|--------|
| `goodbye` | End party, write session reflection to Brain |
| `end party` | End party, write session reflection |
| `wrap it up` | Final synthesis, then end |
| `status` | Show current task status (parallel mode) |
| `add <agent>` | Invite agent to debate |
| `remove <agent>` | Dismiss agent |

---

## Invariants

- **Brain first** — Search before any debate or dispatch
- **Log everything** — Every debate, every task completion
- **Parallel = Silent** — No chat transcript in parallel mode (too noisy)
- **Roundtable = Chat** — Full agent voices, mock debate transcript
- **Kotler orchestrates** — All modes routed through Kotler
- **Max 4 parallel** — Context window management
- **Dependency tracking** — Tasks declare blockedBy for sequencing
