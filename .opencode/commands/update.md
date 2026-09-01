---
description: "Quick update — sync documentation with memory"
allowed-tools: ["Write", "Read", "Grep", "mcp__MCP_DOCKER__*"]
---

# Quick Update Command

Quickly update documentation with insights from memory. When Allura Brain is available, uses MCP_DOCKER tools.

## Usage

```bash
/update <target> <change description>
```

## Targets

| Target | File | Purpose |
| ------ | ---- | ------- |
| `activeContext` | `memory-bank/activeContext.md` | Current focus and blockers |
| `progress` | `memory-bank/progress.md` | What has been done |
| `systemPatterns` | `memory-bank/systemPatterns.md` | Architecture decisions |
| `techContext` | `memory-bank/techContext.md` | Tech stack details |

## Protocol

### Phase 1: Gather Context

- Search memory for relevant insights on the topic
- Read the current document

### Phase 2: Update Document

- Write updated content to the target file

### Phase 3: Log to Memory

- Log the update event to your configured memory backend (when available)

## Example

```markdown
User: /update progress Added OAuth2 authentication

Updates:
- memory-bank/progress.md
- Logs to memory (when available)
- Updates activeContext if needed
```

---

**Invoke with:** `/update <target> <change description>`
