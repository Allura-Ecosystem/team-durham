---
name: skill-advisor
description: "Allura-native skill recommender. Analyzes the current task, searches Brain for past execution patterns, and suggests which skills to load, which hooks apply, and which governance policies are relevant. Use this skill whenever the user starts a new task, asks 'what skills should I use', 'which hooks apply', 'what policies matter here', asks for recommendations, or seems unsure which tools to reach for. Also triggers on 'suggest', 'recommend', 'advise', 'what do I need', or 'help me pick'."
allowed-tools:
  - Read
  - Grep
  - Glob
  - mcp__allura-brain__memory_search
  - mcp__allura-brain__memory_add
---

# Skill Advisor — Allura-Native Recommendation Engine

Analyzes the current task and recommends which skills, hooks, and governance policies to activate. Learns from Allura Brain execution history to improve recommendations over time.

## When This Fires

- User starts a new task and hasn't loaded skills yet
- User asks "what skills should I use?" or "which hooks apply?"
- User seems unsure which tools to reach for
- Beginning of any `/auto`, `/party`, or `/orchestrate` workflow
- Any prompt containing "suggest", "recommend", "advise", "what do I need"

## Protocol

### Step 1: Understand the Task

Extract from the current conversation or `$ARGUMENTS`:
- **Task type**: implementation, debugging, refactoring, architecture, testing, deployment, documentation, research, review
- **Domain**: frontend, backend, database, infrastructure, security, memory, agents
- **Scope**: single file, multi-file, cross-module, epic
- **Risk level**: read-only analysis, code modification, schema change, deployment

### Step 2: Search Brain for History

Query Allura Brain for past executions matching this task type:

```javascript
allura-brain_memory_search({
  query: "<task type> skills used success patterns",
  group_id: "allura-system",
  limit: 10
})

allura-brain_memory_search({
  query: "<domain> hooks policies governance",
  group_id: "allura-system",
  limit: 5
})
```

Extract from results:
- Which skills were active during successful completions of similar tasks
- Which skills were NOT loaded but would have helped (failure patterns)
- Any SONA patterns with `suggestedAgent` data for this task type

### Step 3: Match Against Installed Skills

Scan the installed skill catalog:

```bash
# List all installed skills
ls -d .opencode/skills/*/SKILL.md 2>/dev/null
```

For each skill, read the frontmatter `name` and `description` fields. Score relevance against the current task using keyword overlap and Brain history data.

### Step 4: Identify Applicable Hooks

Check which governance hooks are relevant to this task:

| Task Signal | Hook / Policy |
|-------------|--------------|
| Touches database / SQL / schema | `group_id` enforcement, append-only events |
| Modifies agent definitions | HITL curator approval required |
| Changes environment / config | Destructive change gate |
| Calls MCP tools | MCP-only DB access policy |
| Writes to Neo4j | SUPERSEDES versioning required |
| Promotes memory | Curator approval (confidence >= 0.85) |
| Performance-sensitive path | Coherence monitor active |

### Step 5: Present Recommendations

Output a structured recommendation:

```markdown
## Skill Advisor — Recommendations

**Task:** <one-line summary>
**Type:** <task type> | **Domain:** <domain> | **Risk:** <low/medium/high>

### Skills to Load

| Priority | Skill | Why |
|----------|-------|-----|
| **P0** | <skill-name> | <reason — what it gives you for this task> |
| **P1** | <skill-name> | <reason> |
| **P2** | <skill-name> | <reason> |

### Active Hooks & Policies

| Policy | Status | Applies Because |
|--------|--------|----------------|
| group_id enforcement | Active | <reason or "not applicable"> |
| Append-only events | Active | <reason or "not applicable"> |
| HITL curator approval | Active | <reason or "not applicable"> |
| SUPERSEDES versioning | Active | <reason or "not applicable"> |
| Destructive change gate | Active | <reason or "not applicable"> |
| MCP-only DB access | Active | <reason or "not applicable"> |

### Agent Routing

| Recommended Agent | Role | Why |
|-------------------|------|-----|
| <agent-name> | <role> | <reason — SONA history or default routing> |

### Brain Context

<summary of relevant past work found in Brain — what succeeded, what failed, what to watch for>
```

Only include policies that are actually relevant — don't list all 6 if only 2 apply. Keep the output scannable.

### Step 6: Log Recommendation

Write the recommendation to Brain so future queries benefit:

```javascript
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "skill-advisor",
  content: "SKILL_RECOMMENDATION: task=<type>, skills=[<list>], agent=<recommended>",
  metadata: {
    source: "skill-advisor",
    event_type: "SKILL_RECOMMENDATION",
    task_type: "<type>",
    skills_recommended: ["<skill1>", "<skill2>"],
    agent_recommended: "<agent>",
    brain_hits: <number of relevant Brain results>
  }
})
```

## Skill Catalog Quick Reference

### Core Development

| Skill | When to Use |
|-------|-------------|
| `code-review` | Reviewing changes for correctness, regressions, security |
| `systematic-debugging-memory` | Any bug, test failure, or unexpected behavior |
| `brainstorming` | Before any creative work — features, components, designs |
| `skill-creator` | Creating new skills, measuring skill performance |
| `plugin-builder` | Building plugins for Claude Code, Codex, or OpenCode |

### Allura Ecosystem

| Skill | When to Use |
|-------|-------------|
| `allura-memory-skill` | Storing, retrieving, curating Brain memories |
| `allura-health-observability` | Health checks, monitoring, diagnostics |
| `allura-approve-promotion` | Approving memory promotion to semantic store |
| `allura-propose-promotion` | Proposing memory for promotion |
| `allura-graph-debug` | Debugging Neo4j graph issues (read-only) |

### Research & Discovery

| Skill | When to Use |
|-------|-------------|
| `multi-search` | Coordinating 5 intelligence sources for research |
| `context7` | Looking up library/framework documentation |
| `perplexica-search` | Self-hosted AI-powered web search |

### Quality & Security

| Skill | When to Use |
|-------|-------------|
| `security-bluebook-builder` | Threat models, auth policy, security rules |
| `bun-security` | npm vulnerability detection, Bun enforcement |
| `varlock` | Environment variable and secrets management |
| `postgres-best-practices` | PostgreSQL query and schema guidance |

### Frontend & Design

| Skill | When to Use |
|-------|-------------|
| `frontend-craft` | Production-grade frontend with Brooksian integrity |
| `frontend-design` | Visual exploration with Huashu design directions |
| `allura-design` | Design work bridged with Allura Brain memory |
| `figma-use` | Any Figma tool interaction (mandatory prerequisite) |

### Orchestration

| Skill | When to Use |
|-------|-------------|
| `party-mode` | Parallel multi-agent dispatch |
| `team-ram-cowork` | Team RAM operating flow with Brooks as chair |
| `mcp-harness` | MCP server approval and loading |
| `mcp-docker` | Docker MCP catalog discovery and configuration |
| `task-management` | Task tracking with dependencies and Brain integration |

## How It Learns

The advisor improves over time through three signals:

1. **SONA trajectories** — When a task succeeds with certain skills loaded, that pairing is reinforced in pattern extraction
2. **Recommendation logging** — Every recommendation is logged to Brain with the task type and skill list
3. **Outcome correlation** — Pattern extraction detects which skill combinations correlate with success vs failure

After enough data accumulates, the advisor stops relying on keyword matching and starts using empirical evidence: "tasks like this succeed 90% of the time with code-review + systematic-debugging loaded."

## Rules

1. **Brain first** — always search before recommending
2. **Relevant only** — don't dump the full catalog, pick 3-5 skills max
3. **Policies matter** — always surface applicable governance hooks
4. **Log everything** — recommendations feed the learning loop
5. **Graceful degradation** — if Brain is unavailable, fall back to keyword-based matching against the skill catalog
6. **group_id: allura-system** — on every Brain operation
