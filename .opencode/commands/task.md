---
description: "Task creator — generate structured task with memory integration"
allowed-tools: ["Write", "Read", "Grep", "mcp__MCP_DOCKER__*"]
---

# Task Creator Command

Create tasks with proper structure, metadata, and memory integration.

## Usage

```
/task <task description>
```

## Protocol

### Phase 1: Gather Context

```javascript
// Search Allura Brain
mcp__MCP_DOCKER__search_memories({ query: "<task topic>" })

// Find related tasks
Grep({ pattern: "TASK-", path: "docs/archive/planning-artifacts/" })
```

### Phase 2: Generate Task

```javascript
// Create task file
Write({
  path: `docs/archive/planning-artifacts/tasks/TASK-XXX.md`,
  content: taskContent
})
```

### Phase 3: Link to Memory

```javascript
// Create memory link
mcp__MCP_DOCKER__create_entities({
  entities: [{
    name: `TASK-XXX`,
    entity_type: "task",
    observations: [...]
  }]
})
```

## Example

```
User: /task Add OAuth2 authentication with Google provider

Creates:
- TASK-042: Add OAuth2 authentication
- Links to memory insights
- Assigns to Woz
```

---

**Invoke with:** `/task <task description>`