---
name: quick-update
description: "Quick documentation updates using memory. Updates docs with memory insights and current context. Allura Brain is used when available."
allowed-tools: ["Write", "Read", "Grep", "mcp__MCP_DOCKER__*"]
---

# Quick Update — Documentation Sync

Quickly update documentation with insights from memory. When Allura Brain is available, uses MCP_DOCKER tools for search and logging.

## When to Use

- Updating docs after code changes
- Syncing memory-bank files
- Updating PROJECT.md with new decisions
- Refreshing architecture docs

## Update Protocol

### Phase 1: Identify Target

What needs updating? Common targets: `activeContext`, `progress`, `systemPatterns`, `techContext`, `projectbrief`, `productContext`.

### Phase 2: Gather Context

- Search memory for relevant insights (when available)
- Read the current document

### Phase 3: Update Document

- Write updated content to the target file

### Phase 4: Log to Memory

- Log the update event to your configured memory backend (when available)

## Update Targets

| Target | File | Purpose |
|--------|------|---------|
| `activeContext` | `memory-bank/activeContext.md` | Current focus and blockers |
| `progress` | `memory-bank/progress.md` | What has been done |
| `systemPatterns` | `memory-bank/systemPatterns.md` | Architecture decisions |
| `techContext` | `memory-bank/techContext.md` | Tech stack details |
| `projectbrief` | `memory-bank/projectbrief.md` | Project overview |
| `productContext` | `memory-bank/productContext.md` | Product context |

## Quick Update Patterns

### Pattern 1: After Code Change

```
User: "quick-update progress Added OAuth2 authentication"

Updates:
- memory-bank/progress.md with new completion
- Logs to memory (when available)
- Updates activeContext if needed
```

### Pattern 2: After Architecture Decision

```
User: "quick-update systemPatterns Decided to use JWT for auth"

Updates:
- memory-bank/systemPatterns.md with new pattern
- Creates ADR if applicable
- Logs to memory (when available)
```

### Pattern 3: After Blocker

```
User: "quick-update activeContext Blocked on API key from vendor"

Updates:
- memory-bank/activeContext.md with blocker
- Logs to memory (when available)
- Notifies if critical
```

## Memory Integration

When Allura Brain is available:

1. **Searches** Allura Brain for related insights
2. **Updates** the target document
3. **Logs** the change to memory
4. **Links** to relevant entities

When memory is not available, the update still proceeds — it just writes to the target file without logging.

---

**Invoke with:** `quick-update <target> <change description>`

```
User: "quick-update activeContext Blocked on API key from vendor"

Updates:
- memory-bank/activeContext.md with blocker
- Logs to Allura Brain
- Notifies if critical
```

## Memory Integration

Every quick-update:

1. **Searches** Allura Brain for related insights
2. **Updates** the target document
3. **Logs** the change to memory
4. **Links** to relevant entities

---

**Invoke with:** `quick-update <target> <change description>`