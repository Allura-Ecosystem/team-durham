---
name: team-durham-agent-router
description: "Route work to Team Durham's callable OpenCode agents and shared Elora/Allura memory. Trigger when the user says agent kotler, agent aaker, agent glaser, agent ogilvy, agent rand, agent munari, agent tufte, Team Durham, design team, Elora memory, shared memories, or asks agents to work like a real brand team."
---

# Team Durham Agent Router

Use this skill to route user requests into the Team Durham design team.

## Source Files

- Callable agents: `.opencode/agents/`
- Plugin registry: `.opencode/plugins/team-durham.ts`
- Shared memory contract: `.opencode/plugins/ELORA-MEMORY.md`
- Legacy OpenCode wrappers: `.opencode/agent/*/AGENTS.md`
- Canonical definitions: `.claude/agents/*.md`
- BMAD overrides: `_bmad/custom/*.toml`

## Agent Calls

| User asks for | Call |
|---------------|------|
| Kotler, Cutler, brand orchestrator, PM, pipeline | `kotler` |
| Aaker, strategy, STP, positioning | `aaker` |
| Glaser, logo, visuals, visual direction | `glaser` |
| Ogilvy, copy, naming, voice | `ogilvy` |
| Rand, brand kit, tokens, system | `rand` |
| Munari, QA, audit, consistency | `munari` |
| Tufte, research, data, competitive intelligence | `tufte` |
| Scout, recon, find files | `scout` |
| Reality check, verify, done claim | `reality-checker` |
| Evidence, screenshot, proof packet | `evidence-collector` |
| Workflow, handoff, state machine | `workflow-architect` |
| Trust, permissions, audit | `agentic-trust-architect` |
| Unknown ownership | `kotler` first; `openagent` only after Kotler delegates fallback |

## Activation Protocol

1. Activate Kotler as the default chair for Team Durham, design-team, and unclear routing requests.
2. Identify any explicit specialist request or Kotler delegation by task.
3. Load `.opencode/agents/kotler.md`, then the selected specialist file when delegated.
4. Load the referenced legacy wrapper and canonical `.claude/agents/*.md` file.
5. Hydrate from Elora/Allura shared memory before acting:
   - use `group_id: allura-team-durham`
   - use the agent-specific `user_id`
   - search the memory queries defined in `.opencode/plugins/team-durham.ts`
6. Present Kotler's command menu when no command was already chosen.
7. Work in character and within permissions.
8. Log meaningful decisions, blockers, outcomes, and handoffs back to shared memory.

## Design Team Rules

- Kotler governs the pipeline.
- Team Durham starts with Kotler, then routes.
- Aaker locks STP before visuals or kit work.
- Glaser owns visual direction.
- Ogilvy owns copy and naming.
- Rand assembles production-ready brand systems.
- Munari reviews only; fixes go back to producers.
- Tufte validates evidence and research.
- Operations agents handle proof, workflows, trust, and readiness.

## Memory Rule

Elora means the shared Allura Brain memory layer in this workspace unless another Elora runtime is explicitly configured.

No agent should act from a blank slate. Search shared memory first, then work, then log what matters.
