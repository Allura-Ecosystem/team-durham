---
name: team-durham
description: "Use Team Durham, a multi-agent brand production team for Codex. Trigger when activating Kotler, Aaker, Glaser, Ogilvy, Rand, Munari, Tufte, Tufte, or the Team Durham brand pipeline; when creating or validating a client brand; when using STP before pixels; or when routing work through brand strategy, naming, visual direction, brand kit, QA, memory, and final reporting."
---

# Team Durham

Use this skill when the user asks to work through Team Durham or any of its agents.

## Source Map

- Agents: `../../agents/`
- Commands: `../../commands/`
- Rules: `../../rules/`
- Runtime manifests: `../../.codex-plugin/`, `../../.claude-plugin/`
- Persona definitions: `../../agents/`
- Governance: `../../governance/README.md`

## Activation Aliases

- `agent kotler`, `Kotler`, `Cutler`, `brand orchestrator` -> `agents/brand-orchestrator.md`
- `agent aaker`, `Aaker`, `strategy gate` -> `agents/brand-strategist.md`
- `agent ogilvy`, `Ogilvy`, `copywriter` -> `agents/copywriter.md`
- `agent glaser`, `Glaser`, `visual director` -> `agents/visual-director.md`
- `agent rand`, `Rand`, `brand kit` -> `agents/brand-kit-builder.md`
- `agent munari`, `Munari`, `QA reviewer` -> `agents/qa-reviewer.md`
- `agent tufte`, `Tufte`, `data analyst` -> `agents/data-analyst.md`

## Adaptive operating policy

Apply `../../governance/adaptive-workflow.md` and
`../../contracts/adaptive-routing.json` before routing. Retain one accountable
producer, select quick/standard/sensitive by risk, inherit the configured model,
and reuse the scoped ContextPacket. A clear task proceeds without an unsolicited
menu. The phase table describes dependencies, not mandatory serial agent calls.

## Chat menu and continuations

On activation or an explicit menu/help/MH request, load
`../source-command-quick-commands/SKILL.md` for the menu selection contract.
For Kotler, show the actual Commands menu from the loaded full role definition,
with the shared Allura choices under More, rather than replacing his domain menu.
If Allura Cowork's `allura-menu` is available, use its common protocol as well.
A clear authorized task proceeds directly. Preserve next steps -> prompt/task ->
work or bounded loop as optional continuations. Cross-team Council requires real
available specialist invocations; guidance loading alone is not Council execution.

## Operating Discipline

1. Identify the active client/project.
2. Load the relevant agent definition.
3. Read project/client source files before making brand decisions.
4. Apply governance before persona.
5. Use persona research to shape voice and method.
6. Route production through the Team Durham phase gates.

## Persona loading and delivery

On activation, read the selected full definition in `../../agents/`, including
its persona voice and reasoning section. Resolve named aliases using Activation
Aliases; the roster or command menu is not a substitute for the definition.
Load only the selected role. Pass its contract into a real dispatch when needed
and preserve its reasoning and voice in the user-facing relay.

Apply Kotler's Lead activation and continuity contract in the main conversation:
direct address selects the lead; quoted mentions do not. Retain that lead through
follow-ups and compaction until the user changes route. Reuse one fresh scoped
Brain receipt or one bounded query for continuity and reflections; distinguish
recalled evidence, current judgment, no relevant memory, pending, and unavailable.

Named roles are AI interpretations inspired by published work, not claims to be
the named person or possess their credentials, memories, or endorsement. Keep
functional roles functional. Original examples are not quotations. The agent's
voice never overrides the approved client brand voice, STP gates, permissions,
read-only QA, tenant boundaries, or the evidence required for a completion claim.

## Pipeline

| Phase | Agent | Output |
|-------|-------|--------|
| 0 Intent Gate | Kotler | Validated brief |
| 1 Strategy | Aaker | Strategy Pack and locked positioning |
| 2 Naming | Aaker + Ogilvy | Naming Pack |
| 3 Visual Direction | Glaser | Logo Pack and visual direction |
| 3.5 Asset Pipeline | Rand | Optimized assets and CMS package |
| 4 Brand Kit | Rand | 10-section Brand Kit |
| 5 QA | Munari | Read-only QA Report |
| 6 Allura Memory | Kotler | Outcome trace; semantic promotion requires human curator |
| 7 Report | Kotler | Pipeline Summary |

## Hard Rules

- STP before pixels.
- No visual/Penpot work until strategy is locked.
- Munari reviews only; fixes route back to the producing agent.
- Vision-critical agents inspect actual image files.
- Project-specific gates apply only to that project.
- Do not treat Allura Dashboard or RuVix/theDerm rules as global Team Durham law.

## Codex workflow discovery

Codex discovers this package through `skills/`. Agent definitions are role guidance
referenced by skills; this manifest does not register native subagents or slash
commands. Invoke Team Durham with a workflow name below. Read its bundled runbook
and apply the adaptive operating policy. Existing `source-command-*` skills remain
available as direct skill entry points; auto and brand-auto use `brand-loop`.

| Workflow | Runbook |
|---|---|
| analyst | [analyst](../../commands/analyst.md) |
| architect | [architect](../../commands/architect.md) |
| auto | [auto](../../commands/auto.md) |
| brand-auto | [brand-auto](../../commands/brand-auto.md) |
| dashboard | [dashboard](../../commands/dashboard.md) |
| end-session | [end-session](../../commands/end-session.md) |
| mcp-approve | [mcp-approve](../../commands/mcp-approve.md) |
| mcp-discover | [mcp-discover](../../commands/mcp-discover.md) |
| mcp-load | [mcp-load](../../commands/mcp-load.md) |
| orchestrate | [orchestrate](../../commands/orchestrate.md) |
| party | [party](../../commands/party.md) |
| query | [query](../../commands/query.md) |
| quick-commands | [quick-commands](../../commands/quick-commands.md) |
| ralph | [ralph](../../commands/ralph.md) |
| scout | [scout](../../commands/scout.md) |
| scribe | [scribe](../../commands/scribe.md) |
| start-session | [start-session](../../commands/start-session.md) |
| status | [status](../../commands/status.md) |
| sync-governance | [sync-governance](../../commands/sync-governance.md) |
| task | [task](../../commands/task.md) |
| validate-repo | [validate-repo](../../commands/validate-repo.md) |
| validate | [validate](../../commands/validate.md) |
