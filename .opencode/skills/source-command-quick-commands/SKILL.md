---
name: "source-command-quick-commands"
description: "Quick slash commands for Allura Memory surgical team"
---

# source-command-quick-commands

Use this skill when the user asks to run the migrated source command `quick-commands`.

## Command Template

# Quick Slash Commands

Type these directly in your IDE for fast access to Allura Memory workflows.

## Session Commands

| Command          | Action        | Equivalent      |
| ---------------- | ------------- | --------------- |
| `/start`         | Start session | `start-session` |
| `/end <summary>` | End session   | `end-session`   |
| `/dash`          | Dashboard     | `dashboard`     |

## Task Commands

| Command        | Action         | Equivalent             |
| -------------- | -------------- | ---------------------- |
| `/task <desc>` | Create task    | `task-management`     |
| `/promote`     | HITL promotion | `hitl-governance`     |
| `/review`      | Code review    | `code-review`          |

## Memory Commands

| Command            | Action       | Equivalent                         |
| ------------------ | ------------ | ---------------------------------- |
| `/query <term>`    | Memory query | `mcp__MCP_DOCKER__search_memories` |
| `/update <target>` | Memory sync | `memory-client`                   |
| `/party <task>`    | Party mode   | `party-mode`                       |

## Skill Commands

| Command                      | Action              | Equivalent             |
| ---------------------------- | ------------------- | ---------------------- |
| `/create <name>`             | Create new skill    | `skill-create`         |
| `/create <name> --improve`   | Improve skill       | `skill-create --improve` |
| `/create <name> --eval`      | Eval skill          | `skill-create --eval`  |
| `/create <name> --optimize`  | Optimize triggering | `skill-create --optimize` |
| `/propose <skill>`           | Propose skill route | `skill-propose`        |
| `/load <skill>`              | Load & execute      | `skill-load`           |

## Agent Shortcuts

| Shortcut                 | Agent  | Persona         |
| ------------------------ | ------ | --------------- |
| `@brooks-architect`      | Brooks | Rich Hickey     |
| `@brooks-architect`      | Brooks | Gergely Orosz   |
| `@woz-builder`           | Woz    | Fabrice Bellard |
| `@pike-interface-review` | Pike   | Rob Pike        |
| `@scout-recon`           | Scout  | Julia Evans     |
| `@scout-recon`           | Scout  | Peter Bourgon   |
| `@fowler-refactor-gate`  | Fowler | Martin Fowler   |
| `@ux`                    | UX     | Sara Soueidan   |

## Usage Examples

### Start a Session

```bash
/start
```

Loads memory, verifies infrastructure, prepares tools.

### Create a Task

```bash
/task Add OAuth2 authentication with Google provider
```

Generates structured task file with memory links.

### Launch Party Mode

```bash
/party Implement user dashboard with charts
```

Spawns all agents in parallel for maximum throughput.

### Quick Update

```bash
/update progress Added OAuth2 authentication
```

Updates Allura Brain and logs to events.

### Query Memory

```bash
/query authentication patterns
```

Searches Allura Brain for relevant insights.

### Code Review

```bash
/review
```

Launches Pike, Scout, and UX in parallel for review.

---

**All commands work with Allura Brain integration.**
