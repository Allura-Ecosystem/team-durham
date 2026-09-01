---
description: "Propose a skill and see which specialist agent handles it"
argument-hint: "<skill-name>"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# /skill-propose

Propose a skill and see which specialist agent handles it.

## Usage

```bash
/skill-propose <skill-name>
```

## Examples

```bash
/skill-propose code-review           # Code review specialist (pike)
/skill-propose context7              # Documentation and API lookup (scout)
/skill-propose mcp-harness           # Harness orchestration (brooks)
```

## How It Works

1. Harness looks up skill in registry
2. Shows skill metadata: purpose, preferred executor, requirements
3. Logs `SKILL_PROPOSED` event (when memory logging is enabled)
4. Shows next step: execute with `/skill-load`

## Team RAM Skill Routing

| Skill | Executor | Specialty |
| ----- | -------- | --------- |
| `code-review` | `pike` | Read-only architecture review |
| `context7` | `scout` | Documentation and API lookup |
| `mcp-harness` | `brooks` | Harness orchestration |
| `multi-search` | `scout` | Combined repo and web research |
| `task-management` | `woz` | Task execution support |

## Result

```json
{
  "event": "SKILL_PROPOSED",
  "skill_name": "code-review",
  "executor": "pike",
  "description": "Read-only code review and architecture feedback",
  "requirements": ["Can read source files", "Cannot write code"]
}
```

**Note:** The orchestrator routes skills to specific executors. See `/skill-load`.
