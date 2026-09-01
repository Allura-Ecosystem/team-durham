---
description: "Task creator — generate structured task with memory integration"
allowed-tools: ["Write", "Read", "Grep", "allura-brain_memory_search", "allura-brain_memory_add"]
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
allura-brain_memory_search({
  query: "<task topic>",
  group_id: "allura-team-durham",
  limit: 5
})

// Find related tasks
Grep({ pattern: "TASK-", path: "clients/" })
```

### Phase 2: Generate Task

Create a task file with:
- Task ID (TASK-XXX)
- Description
- Priority (Critical / High / Medium / Low)
- Dependencies
- Acceptance criteria
- Agent assignment

### Phase 3: Link to Memory

```javascript
allura-brain_memory_add({
  group_id: "allura-team-durham",
  user_id: "kotler",
  content: `TASK-XXX created: ${taskDescription}`,
  metadata: {
    source: "conversation",
    conversation_id: "current",
    agent_id: "kotler"
  },
  threshold: 0.9
})
```

## Example

```
User: /task Add OAuth2 authentication with Google provider

Creates:
- TASK-042: Add OAuth2 authentication
- Links to memory insights
- Assigns to appropriate agent
```

---

**Invoke with:** `/task <task description>`