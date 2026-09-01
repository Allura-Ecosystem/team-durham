---
name: team-durham
description: "Use Team Durham, a multi-agent brand production team for Codex. Trigger when activating Kotler, Aaker, Glaser, Ogilvy, Rand, Munari, Tufte, Scout, or the Team Durham brand pipeline; when creating or validating a client brand; when using STP before pixels; or when routing work through brand strategy, naming, visual direction, brand kit, QA, memory, and final reporting."
---

# Team Durham

Use this skill when the user asks to work through Team Durham or any of its agents.

## Source Map

- Agents: `../../agents/`
- Commands: `../../commands/`
- Rules: `../../rules/`
- Codex bridge: `../../source/codex/`
- Persona research: `../../source/codex/research/team-durham-persona-research.md`
- Governance bridge: `../../source/codex/governance/README.md`

## Activation Aliases

- `agent kotler`, `Kotler`, `Cutler`, `brand orchestrator` -> `agents/brand-orchestrator.md`
- `agent aaker`, `Aaker`, `strategy gate` -> `agents/brand-strategist.md`
- `agent ogilvy`, `Ogilvy`, `copywriter` -> `agents/copywriter.md`
- `agent glaser`, `Glaser`, `visual director` -> `agents/visual-director.md`
- `agent rand`, `Rand`, `brand kit` -> `agents/brand-kit-builder.md`
- `agent munari`, `Munari`, `QA reviewer` -> `agents/qa-reviewer.md`
- `agent tufte`, `Tufte`, `data analyst` -> `agents/data-analyst.md`

## Operating Discipline

1. Identify the active client/project.
2. Load the relevant agent definition.
3. Read project/client source files before making brand decisions.
4. Apply governance before persona.
5. Use persona research to shape voice and method.
6. Route production through the Team Durham phase gates.

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
| 6 Allura Memory | Kotler | Brand Truth persisted |
| 7 Report | Kotler | Pipeline Summary |

## Hard Rules

- STP before pixels.
- No visual/Penpot work until strategy is locked.
- Munari reviews only; fixes route back to the producing agent.
- Vision-critical agents inspect actual image files.
- Project-specific gates apply only to that project.
- Do not treat Allura Dashboard or RuVix/theDerm rules as global Team Durham law.
