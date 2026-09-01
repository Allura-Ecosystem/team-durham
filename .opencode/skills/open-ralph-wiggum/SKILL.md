---
name: open-ralph-wiggum
description: Use this skill when user asks for open-ralph-wiggum, Ralph Wiggum loop, or autonomous multi-iteration completion with explicit stopping criteria. Pushy trigger: include words like "open ralph", "run ralph", or "Ralph Wiggum".
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

# Open Ralph Wiggum

Use Ralph Wiggum as the bounded `Ralph Loop` execution mode. Use canonical forms `ralph`, `ralph/ulw-loop.sh`, and `/ulw-loop` with explicit stop conditions and completion promises.

## When to use
- You need bounded, repeatable autonomous iteration on a concrete task.
- The user explicitly asked for `open-ralph-wiggum` or an equivalent Ralph loop request.
- You have clear success criteria that can be automatically checked.

## When not to use
- Do not use for final validation, approval, or governance sign-off.
- Do not use when scope and completion criteria are still ambiguous.
- Do not use for manual decisions that require stakeholder judgment without objective checks.

## Install
- `npm install -g @th0rgal/ralph-wiggum`
- `bun add -g @th0rgal/ralph-wiggum`
- Unix source install:
  - `git clone https://github.com/Th0rgal/ralph-wiggum && cd opencode-ralph-wiggum && ./install.sh`
- Windows source install:
  - `git clone https://github.com/Th0rgal/ralph-wiggum && cd opencode-ralph-wiggum && .\\install.ps1`
- Uninstall:
  - `npm uninstall -g @th0rgal/ralph-wiggum`

## Command patterns
- `ralph "<prompt>"`
- `ralph "<prompt>" --max-iterations <N>`
- `ralph "<prompt>" --completion-promise "<text>"`
- `ralph "<prompt>" --model <agent-model>`
- `ralph/ulw-loop.sh "<prompt>" <max-iterations>`
- `/ulw-loop "<prompt>" --max-iterations <N>`
- `ralph --prompt-file <path>`
- `ralph -f <path>`
- `ralph --no-stream`
- `ralph --verbose-tools`
- `ralph --no-plugins`
- `ralph --no-commit`
- `ralph --help`

### Monitoring and control
- `ralph --status`
- `ralph --add-context "Focus on fixing the auth module first"`
- `ralph --clear-context`

## Prompt template
Use a strict completion promise and explicit checks.

```text
You are operating in a bounded `Ralph Loop` execution context.

Task:
- <exact task description>

Success criteria:
- Produce the requested change and verify it with: <commands>.
- Provide file list, key evidence, and a final status note.
- End with completion marker:

<promise>DONE</promise>
```

Default completion promise is `<promise>COMPLETE</promise>` when not overridden.

## Safeguards
- Always set `--max-iterations` for bounded autonomous runs.
- Keep prompts concrete and testable; do not leave open-ended “try your best” goals.
- Stop if no progress after repeated retries.
- Use `--no-commit` when dry-run behavior is preferred.
- Prefer short, objective completion promises like DONE or COMPLETE and treat them as explicit loop end states.

## Allura and Team RAM caveats
- In this repository, the `Ralph Loop` is an execution mode, not the final validator.
- The `ralph` agent persona (the reviewer role) has been removed from Team RAM. `Ralph Loop` (this skill, `open-ralph-wiggum`) is the bounded execution mode only — it has no agent authority.
- Validation must still be done through normal evidence workflows (tests, review, benchmarks, and required governance paths).
- Team RAM roles remain in effect; this skill does not replace Brooks, Jobs, Woz, Pike, or any explicit checklist gates.
- Scout (`status: failed`) and Fowler (`status: failed`) are currently unavailable. When these agents are failed, their gate equivalents are: Scout → Cowork-style repo recon; Fowler → static maintainability analysis (page.tsx line count, token use, cascade-failure audit). Brooks confirms gate-equivalence before `Ralph Loop` is dispatched.

## Examples

- Single pass with bounded retries:

```bash
ralph "Refactor ralph loop docs and add a usage quickstart. Use completion marker <promise>DONE</promise>." \
  --max-iterations 4 \
  --completion-promise DONE
```

- File-driven invocation:

```bash
ralph --prompt-file ralph/quickstart.prompt --max-iterations 8 --completion-promise COMPLETE
```

- Context updates during long loops:

```bash
ralph --status
ralph --add-context "Prioritize failing checks first"
```

## Notes
- If the loop starts looping without progress, lower iteration budget, tighten constraints, or reset context.
- This skill file is local guidance only; actual behavior depends on installed `ralph` binary version and options.
