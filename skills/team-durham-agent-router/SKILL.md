---
name: team-durham-agent-router
description: "Route work to Team Durham's callable OpenCode agents and shared Elora/Allura memory. Trigger when the user says agent kotler, agent aaker, agent glaser, agent ogilvy, agent rand, agent munari, agent tufte, Team Durham, design team, Elora memory, shared memories, or asks agents to work like a real brand team."
---

# Team Durham Agent Router

Use this skill to route user requests into the Team Durham design team.

## Source Files

- Canonical definitions: `../../agents/*.md`
- Operating policy: `../../governance/adaptive-workflow.md`
- Routing contract: `../../contracts/adaptive-routing.json`
- Context handoff: `../../contracts/context-packet.schema.json`
- `.opencode/` files are compatibility material, not canonical instructions.

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

1. Apply `../../governance/adaptive-workflow.md`; choose quick, standard, or sensitive.
2. Use Kotler as governance chair for team/unclear requests. Route explicit tasks
   directly to the named specialist within its permissions; no extra chair call.
3. Load the selected canonical definition in `../../agents/` and 1–3 relevant skills.
4. Obtain or reuse the scoped ContextPacket and Brain receipt before brand work.
   Use `group_id: allura-team-durham` and the acting agent identity. Refresh only
   changed dependencies or authority. Report unavailable Brain tools honestly.
5. Present a menu only when requested or the task is unclear.
6. Keep one accountable producer through execution and the risk-selected review.
7. Record meaningful verified outcomes; do not write for pure lookups.

## Design Team Rules

- Kotler governs the pipeline.
- Kotler handles ambiguous ownership; clear specialist tasks need no extra handoff.
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
