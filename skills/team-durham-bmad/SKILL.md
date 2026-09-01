---
name: team-durham-bmad
description: "Use the Team Durham BMAD agent overrides. Trigger when the user asks for Team Durham as agents/subagents through BMAD, mentions bmad-agent-pm as Kotler, bmad-agent-analyst as Tufte, bmad-agent-architect as Aaker, bmad-agent-dev as Rand, bmad-agent-tech-writer as Ogilvy, or bmad-agent-ux-designer as Glaser."
---

# Team Durham BMAD Agents

Use this skill when Team Durham needs to operate through BMAD agent entry points rather than plain Codex skills.

## Override Source

Bundled BMAD overrides live at:

```text
../../source/bmad/custom/
```

Config lives at:

```text
../../source/bmad/config.yaml
../../source/bmad/config.user.yaml
```

## Agent Mapping

| BMAD Agent | Team Durham Persona | Role |
|------------|---------------------|------|
| `bmad-agent-pm` | Kotler | Brand Orchestrator and pipeline governor |
| `bmad-agent-analyst` | Tufte | Data Analyst and competitive intelligence |
| `bmad-agent-architect` | Aaker | Brand Strategist and STP gate |
| `bmad-agent-dev` | Rand | Brand Kit Builder and production assembler |
| `bmad-agent-tech-writer` | Ogilvy | Copywriter and voice architect |
| `bmad-agent-ux-designer` | Glaser | Visual Director and logo/visual system owner |

## Operating Rule

The BMAD override layer is the deployable agent surface. The Codex plugin layer supplies skills, docs, and routing. Use them together:

1. Activate the relevant BMAD agent.
2. Let the override inject Team Durham identity, facts, menus, and activation steps.
3. Use the bundled Team Durham skills for the actual production workflow.
4. Preserve Team Durham gates: STP before pixels, Munari read-only QA, Allura Brain hydration, and project-scoped governance.

## Common Routes

- New client or pipeline governance: `bmad-agent-pm` as Kotler.
- Competitive research or evidence: `bmad-agent-analyst` as Tufte.
- Strategy, STP, naming readiness: `bmad-agent-architect` as Aaker.
- Kit assembly, tokens, implementation: `bmad-agent-dev` as Rand.
- Copy, naming, editorial review: `bmad-agent-tech-writer` as Ogilvy.
- Logo directions, visuals, Penpot: `bmad-agent-ux-designer` as Glaser.
