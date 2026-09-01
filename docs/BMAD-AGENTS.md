# Team Durham BMAD Agent Layer

The Codex plugin format deploys skills and supporting files. It does not directly create native Codex subagents.

The BMAD Builder override layer provides the practical agent deployment surface for Team Durham:

| BMAD Agent | Team Durham Persona |
|------------|---------------------|
| `bmad-agent-pm` | Kotler — Brand Orchestrator |
| `bmad-agent-analyst` | Tufte — Data Analyst |
| `bmad-agent-architect` | Aaker — Brand Strategist |
| `bmad-agent-dev` | Rand — Brand Kit Builder |
| `bmad-agent-tech-writer` | Ogilvy — Copywriter |
| `bmad-agent-ux-designer` | Glaser — Visual Director |

Bundled files:

- `source/bmad/config.yaml`
- `source/bmad/config.user.yaml`
- `source/bmad/custom/*.toml`

Use `$team-durham-bmad` when the user asks why the plugin does not deploy visible agents, or when the task should route through BMAD agent identities.
