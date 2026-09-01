# Agent Builder

Build AI agents through conversational discovery. The north star: **outcome-driven design** — every capability describes what to achieve, not how. The agent's persona informs HOW; capability prompts only need the WHAT.

## When to Use

- User asks to create, analyze, edit, or rebuild an agent
- User wants to design a new Team RAM specialist
- User wants quality analysis on an existing agent definition

## On Activation

Detect intent and route:

| Intent | Trigger | Route |
|--------|---------|-------|
| **Build new** | "build/create/design a new agent" | Load `./references/build-process.md` |
| **Analyze** | "quality check", "validate", "review agent" | Load `./references/quality-analysis.md` |
| **Edit** | Path to agent + "edit/fix/change" | Load `./references/edit-guidance.md` |
| **Rebuild** | Path to agent + "rebuild/rethink" | Load `./references/build-process.md` with existing agent as context |

When given an existing agent without clear intent, ask: **Analyze**, **Edit**, or **Rebuild**?

## Build Process (Summary)

Six phases of conversational discovery:

### Phase 1: Discover Intent
- **Who IS this agent?** Personality, voice, interaction model
- **Core outcome?** What does success look like?
- **Non-negotiable?** The one thing it must get right
- Treat existing agents as *descriptions of intent*, not specs to follow

### Phase 2: Capabilities Strategy
- Internal capabilities, external skills, or both?
- Identify deterministic operations that should be scripts
- Every planned instruction: would the LLM do this correctly from just persona + outcome? If yes, cut it.

### Phase 3: Gather Requirements
- Identity, capabilities, activation modes, memory needs, access boundaries
- Agent naming: `{name}.md` in `.claude/agents/` for Team RAM agents, or skill directory in `.claude/skills/`
- Gather frontmatter fields: name, description, mode, persona, category, type, status, model, tools, skills

### Phase 4: Draft & Refine
- Present outline, point out vague areas, iterate
- **Pruning check**: cut mechanical procedures the LLM would figure out from persona context
- Watch for: step-by-step procedures in capabilities, repeated identity guidance, capabilities that could merge

### Phase 5: Build
- Output agent definition to `.claude/agents/` or `.claude/skills/`
- Follow Team RAM conventions from `.claude/rules/agent-routing.md`
- Run lint gate: typecheck if applicable

### Phase 6: Summary
- Present what was built: location, structure, capabilities
- Offer quality analysis

## Quality Analysis

Comprehensive review of agent definitions for:
- Over-specification (instructions the LLM doesn't need)
- Persona-capability alignment (does the identity inform the capabilities?)
- Structural issues (missing fields, broken references)
- Enhancement opportunities (gaps in coverage, missing edge cases)

Produces actionable report with opportunities ranked by impact.

Load `./references/quality-analysis.md` for the full framework.

## Allura Conventions

- Agent definitions live in `.claude/agents/*.md` with YAML frontmatter
- Skills live in `.claude/skills/{name}/SKILL.md`
- Team RAM roster: Brooks, Woz, Jobs, Pike, Scout, Bellard, Carmack, Fowler, Knuth, Hightower
- Agent routing follows `.claude/rules/agent-routing.md`
- All memory operations use `group_id: "allura-system"` via Allura Brain
- Log agent creation events to Brain after build completes
