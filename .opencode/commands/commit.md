---
description: "Create well-formatted commits with conventional commit messages. Analyzes changes, generates message, stages specific files, and commits. Never auto-pushes — push requires explicit confirmation."
argument-hint: "[optional commit message]"
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# Commit Command

Create clean, well-formatted git commits following conventional commit conventions. This command analyzes your changes, generates an appropriate message, and commits safely.

## Protocol

### Step 1: Check for arguments

If the user provided `$ARGUMENTS` (a message), use it as the commit message and skip to Step 4.

### Step 2: Pre-commit validation

Run validation in parallel:

```bash
bun run typecheck
bun run lint
```

If either fails, report the issues and ask whether to fix first or proceed. Do not silently skip failures.

### Step 3: Analyze changes

```bash
git status --short
git diff --cached --stat
git diff --stat
git log --oneline -5
```

From this determine:
- What files are modified (staged and unstaged)
- What the recent commit style looks like (match it)
- Whether anything is already staged

**Staging rules:**
- If files are already staged, commit only those — do not add more
- If nothing is staged, identify the changed files and stage them **by name** — never use `git add .` or `git add -A`
- Never stage `.env`, `credentials*`, `*.key`, `*.pem`, or `node_modules/`
- If unsure whether a file should be staged, ask

Then read the diff to understand what changed:

```bash
git diff --cached
```

### Step 4: Generate commit message

Analyze the diff and determine:
- **Type**: feat, fix, docs, refactor, test, chore, perf, ci, style
- **Scope** (optional): the module or area affected
- **Description**: imperative mood, under 72 characters, explains the *why* not the *what*

Format: `<type>(<scope>): <description>`

Append the co-author line:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

Show the proposed message and the file list. Wait for confirmation unless running in auto mode.

### Step 5: Commit

Use a heredoc for proper formatting:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Report the commit hash and summary.

### Step 6: Push (only if explicitly asked)

**Never auto-push.** If the user asks to push:

```bash
git push
```

If pushing to `main` or `master`, warn first:
> "You're pushing directly to main. Are you sure? Consider creating a PR instead."

Never force-push unless the user explicitly requests it with clear intent.

## Commit Type Reference

| Type | When | Emoji |
|------|------|-------|
| `feat` | New feature or capability | n/a |
| `fix` | Bug fix | n/a |
| `docs` | Documentation only | n/a |
| `refactor` | Code change that doesn't fix a bug or add a feature | n/a |
| `test` | Adding or updating tests | n/a |
| `chore` | Build, tooling, dependencies, config | n/a |
| `perf` | Performance improvement | n/a |
| `ci` | CI/CD changes | n/a |
| `style` | Formatting, whitespace, semicolons (no logic change) | n/a |

Match the repo's existing commit style. Check `git log --oneline -5` and follow the pattern — if the repo uses emojis, use emojis. If it doesn't, don't add them.

## Examples

```
feat(auto-mode): add complexity-based strategy routing

fix(governance): guard check_sql to prevent false positives on ToolSearch

docs: add AGENTS.md technical spec for Team RAM roster

chore: add biome linting and TypeScript strict config

refactor(curator): add file-based persistence for revision proposals

test(http): add integration tests for /auto endpoint
```

## Rules

1. **Never `git add .`** — stage files by name to avoid committing secrets
2. **Never auto-push** — push only on explicit request
3. **Never force-push to main** — warn and require confirmation
4. **Never skip hooks** — no `--no-verify`, no `--no-gpg-sign`
5. **Never amend after hook failure** — create a new commit instead
6. **Match repo style** — follow existing commit message conventions
7. **Imperative mood** — "add feature" not "added feature"
8. **Co-author line** — always include on AI-assisted commits
9. **One purpose per commit** — atomic commits, not kitchen sinks
