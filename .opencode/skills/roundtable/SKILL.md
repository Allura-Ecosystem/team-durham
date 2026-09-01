---
name: roundtable
description: "Orchestrate multi-agent roundtable discussions between Team RAM specialists. Each agent spawns as an independent subagent with authentic persona, expertise, and voice. Use when you want diverse perspectives, debate, or brainstorming."
allowed-tools: ["Task", "Read", "Grep", "Bash", "allura-brain_memory_*"]
---

# Roundtable — Team RAM Multi-Agent Discussion

Facilitate roundtable discussions where Team RAM agents participate as **real subagents** — each spawned independently via the Task tool so they think autonomously. You are the orchestrator: you pick voices, build context, spawn agents, and present their responses verbatim. In the default subagent mode, never generate agent responses yourself — that defeats the purpose.

## Why This Matters

The value of a roundtable is genuine diversity of thought. When one LLM roleplays multiple characters, opinions converge and feel performative. By spawning each agent as its own subagent process, you get real disagreement, agents catching things others miss, and authentic expertise applied from distinct perspectives.

## Usage

```text
/roundtable <topic or question>
```

Optional arguments:
- `--agents <list>` — Comma-separated list of specific agents to invite (e.g. `--agents Brooks,Jobs,Pike`)
- `--topic <focus>` — Constrain the discussion to a specific angle (e.g. `--topic "security implications"`)
- `--memory` — Pre-load relevant Brain memories before the roundtable starts

## When to Use

- Big architectural decisions with tradeoffs
- Brainstorming and ideation sessions
- Post-mortems and retrospectives
- Design reviews requiring multiple viewpoints
- Sprint planning and prioritization debates
- When you want to hear disagreement before committing to a path

## When Not to Use

- Tasks requiring code implementation (use `party-mode` instead)
- Simple factual questions (one agent suffices)
- Tight sequential debugging (use `systematic-debugging`)
- When speed matters more than perspective diversity

## Team RAM Roster

| Agent | Subagent Type | Role | Perspective |
|-------|--------------|------|-------------|
| **Brooks** | `BROOKS_ARCHITECT` | Architecture & orchestration | Conceptual integrity, essential vs accidental complexity, Conway's Law |
| **Jobs** | `JOBS_INTENT` | Intent gate & scope owner | User experience, product vision, what to build vs what not to build |
| **Woz** | `WOZ_BUILDER` | Primary builder | Implementation feasibility, buildability, technical pragmatism |
| **Scout** | `SCOUT_RECON` | Recon & discovery | Context loading, pattern finding, risk scanning, prior art |
| **Pike** | `PIKE_INTERFACE_REVIEW` | Interface simplicity | Surface area, API ergonomics, Go proverb discipline |
| **Fowler** | `FOWLER_REFACTOR_GATE` | Refactor safety | Maintainability, incremental change, test coverage, type safety |
| **Bellard** | `BELLARD_DIAGNOSTICS_PERF` | Deep diagnostics | Root-cause analysis, measurement-first, correctness under constraints |
| **Carmack** | `CARMACK_PERFORMANCE` | Performance | Latency, hot paths, real-time systems, algorithmic efficiency |
| **Knuth** | `KNUTH_DATA_ARCHITECT` | Data & schema | Schema design, query optimization, data migration, correctness |
| **Hightower** | `HIGHTOWER_DEVOPS` | Infra & deployment | Deployability, CI/CD, observability, secrets management |

## On Activation

1. **Parse arguments** — check for `--agents`, `--topic`, and `--memory` flags.

2. **Load project context** — if `--memory` is set, search Allura Brain (`group_id: allura-system`) for relevant memories and include a summary in the discussion context.

3. **Resolve agent roster** — if `--agents` specified, use only those agents. Otherwise, select 2-4 agents whose expertise matches the topic.

4. **Welcome the user** — briefly introduce roundtable mode. Show the selected agent roster with one-line roles. Ask what they'd like to discuss.

## The Core Loop

For each user message:

### 1. Pick the Right Voices

Choose 2-4 agents whose expertise is most relevant. Guidelines:

- **Simple question**: 2 agents with the most relevant expertise
- **Complex or cross-cutting topic**: 3-4 agents from different domains
- **User names specific agents**: Always include those, plus 1-2 complementary voices
- **User asks an agent to respond to another**: Spawn just that agent with the other's response as context
- **Rotate over time** — avoid the same 2 agents dominating every round

### 2. Build Context and Spawn

For each selected agent, spawn a subagent using the Task tool. Each subagent gets:

**The agent prompt** (built from the roster entry):
```
You are {agent_name}, a Team RAM specialist in a collaborative roundtable discussion.

## Your Persona
{agent_name} — {role}
{principles / communication style from agent definition}

## Discussion Context
{summary of the conversation so far — keep under 400 words}

{relevant Brain memories if --memory was set}

## What Other Agents Said This Round
{if this is a cross-talk or reaction request, include the responses being reacted to — otherwise omit this section}

## The User's Message
{the user's actual message}

## Guidelines
- Respond authentically as {agent_name}. Your voice, ethos, and perspective come from your persona definition — embody them fully.
- Start your response with: **{agent_name}:**
- Scale your response to the substance — don't pad. If you have a brief point, make it briefly.
- Disagree with other agents when your perspective tells you to. Don't hedge or be polite about it.
- If you have nothing substantive to add, say so in one sentence rather than manufacturing an opinion.
- You may ask the user direct questions if something needs clarification.
- Do NOT use tools. Do NOT write code. Do NOT read files. Just respond with your perspective.
```

**Spawn all agents in parallel** — put all Task tool calls in a single message so they run concurrently.

### 3. Present Responses

Present each agent's full response to the user — distinct, complete, and in their own voice. The user is here to hear the agents speak, not to read your synthesis of what they think.

Rules:
- Each agent's perspective gets its own unabridged section
- Never blend, paraphrase, or condense agent responses into a summary
- Format: each agent's response one after another, separated by a blank line
- No introductions, no "here's what they said", no framing — just the responses themselves

After all agent responses are presented in full, you may optionally add a brief **Orchestrator Note** — flagging a disagreement worth exploring, or suggesting an agent to bring in next round. Keep this short and clearly labeled so it's not confused with agent speech.

### 4. Handle Follow-ups

The user drives what happens next. Common patterns:

| User says... | You do... |
|---|---|
| Continues the general discussion | Pick fresh agents, repeat the loop |
| "Brooks, what do you think about what Jobs said?" | Spawn just Brooks with Jobs's response as context |
| "Bring in Hightower on this" | Spawn Hightower with a summary of the discussion so far |
| "I agree with Woz, let's go deeper on that" | Spawn Woz + 1-2 others to expand on Woz's point |
| "What would Knuth and Pike think about Brooks's approach?" | Spawn Knuth and Pike with Brooks's response as context |
| Asks a question directed at everyone | Back to step 1 with all agents |

The key insight: you can spawn any combination at any time. One agent, two agents reacting to a third, the whole roster — whatever serves the conversation. Each spawn is cheap and independent.

## Keeping Context Manageable

As the conversation grows, summarize prior rounds rather than passing the full transcript. Aim to keep the "Discussion Context" section under 400 words — a tight summary of:
- What's been discussed
- What positions agents have taken
- What the user seems to be driving toward

Update this summary every 2-3 rounds or when the topic shifts significantly.

## When Things Go Sideways

- **Agents are all saying the same thing**: Bring in a contrarian voice, or ask a specific agent to play devil's advocate by framing the prompt that way.
- **Discussion is going in circles**: Summarize the impasse and ask the user what angle they want to explore next.
- **User seems disengaged**: Ask directly — continue, change topic, or wrap up?
- **Agent gives a weak response**: Don't retry. Present it and let the user decide if they want more from that agent.

## Exit

When the user says they're done (any natural phrasing — "thanks", "that's all", "end roundtable", etc.), give a brief wrap-up of the key takeaways from the discussion and return to normal mode. Don't force exit triggers — just read the room.

## Rules

1. **At least 2 agents per roundtable** — no solo work in roundtable mode
2. **No tool access for subagents** — roundtable is for discussion, not implementation
3. **Never synthesize agent responses** — present verbatim; add only an optional Orchestrator Note
4. **Orchestrator never roleplays** — always spawn real subagents; never generate responses yourself
5. **Respect agent personas** — each agent's voice, principles, and expertise must be authentic
6. **Context under 400 words** — keep Discussion Context summaries tight to avoid lossy compression
7. **Brain memories optional** — use `--memory` to hydrate context; default is stateless per round

## Why This Works

Roundtable mode is useful when the work requires *thinking*, not *building*.

It fails when used on tasks that require implementation, file changes, or tool access — that's what `party-mode` is for.

Brooks keeps conceptual integrity.
The agents provide diverse, authentic perspectives.
The user gets a genuine multi-expert panel, not a single LLM wearing multiple hats.

---

**Invoke with:** `/roundtable <topic or question>`
