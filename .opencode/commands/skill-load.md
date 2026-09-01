---
description: "Execute a skill by routing it to a specialist agent executor"
argument-hint: "<skill-name> [--executor <executor-name>]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# /skill-load

Execute a skill by routing it to a specialist agent executor.

## Usage

```bash
/skill-load <skill-name> [--executor <executor-name>]
```

## Examples

```bash
/skill-load code-review                       # Use default executor (pike)
/skill-load code-review --executor pike       # Explicit routing
/skill-load context7 --executor scout
```

## How It Works

1. Validates skill exists and is available
2. Routes to preferred executor (or specified override)
3. Executor receives skill context + permissions
4. Logs `SKILL_LOADED` event (when memory logging is enabled)
5. Executor begins work

## Team RAM Executors

| Executor | Specialty | Permissions |
| -------- | --------- | ----------- |
| `pike` | Architecture and interface review | Read-only (no writes) |
| `woz` | Deep implementation | Full read/write |
| `brooks` | Strategic planning | Read + planning tools |
| `hightower` | Infrastructure and deployment | Infra tools only |
| `scout` | Documentation and repo search | Search tools only |
| `bellard` | Diagnostics and measurement | Read + diagnostics tools |
| `jobs` | Intent, scope, and task coordination | Task + memory tools |
| `fowler` | Refactor safety | Read + refactor tools |
| `carmack` | Performance optimization | Read + profiling tools |
| `knuth` | Data architecture and schema | Read + data tools |

## Result

```json
{
  "event": "SKILL_LOADED",
  "skill_name": "code-review",
  "executor": "pike",
  "context": "<project context>",
  "permissions": ["read", "grep", "lsp"]
}
```

**Note:** The orchestrator routes skills to executors. See `/skill-propose` for skill details.
