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

| Public name / capability | Public target when registered | Canonical target when registered |
| --- | --- | --- |
| Kotler; orchestration, workflow, trust accountability, unclear ownership | `kotler` | `brand-orchestrator` |
| Aaker; strategy, STP, positioning | `aaker` | `brand-strategist` |
| Ogilvy; copy, naming, voice | `ogilvy` | `copywriter` |
| Glaser; logo, visuals, visual direction | `glaser` | `visual-director` |
| Rand; brand kit, tokens, system, UX artifacts | `rand` | `brand-kit-builder` |
| Munari; independent QA, readiness, trust-boundary review | `munari` | `qa-reviewer` |
| Tufte; research, recon, evidence requirements and provenance | `tufte` | `data-analyst` |

Resolve the public identity against the current runtime's actual registered agent
names before invoking. Prefer its public target when registered (the named Codex
registry); otherwise use its canonical target only when that target is registered
(the Claude plugin manifest). If neither exists, report the specific missing
invocation capability. Do not invent a runtime target or create duplicate native
registrations. Keep canonical filenames, frontmatter names, and manifest entries
stable. Load the full selected canonical definition regardless of runtime spelling.

`resolveAgentTarget(publicName, availableNames)` in
`../party-mode/parallel-dispatcher.js` implements this exact resolution contract.
Pass an observed runtime registry, never a presumed roster. Dispatcher plan records
use public identities; the external executor resolves the target before actual
agent invocation. A task record is not an invocation receipt.

## Activation Protocol

1. Apply `../../governance/adaptive-workflow.md`; choose quick, standard, or sensitive.
2. Use Kotler as governance chair for team/unclear requests. Route explicit tasks
   directly to the named specialist within its permissions; no extra chair call.
3. Load the selected canonical definition in `../../agents/` and 1–3 relevant skills.
4. Obtain or reuse the scoped ContextPacket and Brain receipt before brand work.
   Use `group_id: allura-team-durham` and the authenticated principal; record the persona in metadata. Refresh only
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
- Tufte owns evidence requirements and provenance; live capture requires an observed permitted capture tool and actual executor receipt, otherwise remains unconfirmed; Kotler owns workflow and trust accountability; Munari independently reviews readiness and trust boundaries.

## Memory Rule

Elora means the shared Allura Brain memory layer in this workspace unless another Elora runtime is explicitly configured.

No agent should act from a blank slate. Search shared memory first, then work, then log what matters.
