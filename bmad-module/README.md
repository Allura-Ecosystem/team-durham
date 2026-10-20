# Team Durham BMad Module

This is a **BMad Builder multi-skill module adapter** for the canonical Team Durham plugin.
It makes governed brand routing, recon, delivery, QA, and bounded Brand Auto Mode discoverable
through BMad without replacing the current Claude/Codex/OpenCode plugin.

## Validate

```bash
python3 tools/validate-adapters.py
python3 /path/to/bmad-builder/skills/bmad-module-builder/scripts/validate-module.py skills
```

## Install and configure

Use BMad Builder's `bmad-bmb-setup` or the BMad module installer with `skills/dur-setup`.
Set the Team Durham plugin source and the authenticated project's authorized tenant.
`allura-team-durham` is a default for an authorized Durham project, not permission to
switch scope. A specialist keeps the parent task's validated scope. If the native
plugin is unavailable, adapters report that limitation instead of claiming specialist activity.

## Capability map

- `dur-agent-kotler` — brand architecture and routing
- `dur-agent-scout` — compatibility discovery skill using Tufte; not an additional agent
- `dur-agent-munari` — QA and readiness
- `dur-brand-delivery` — one governed non-shipping brand slice
- `dur-brand-auto` — bounded Brand Auto Mode
