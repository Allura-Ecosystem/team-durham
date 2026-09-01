---
name: figma-component-sync
description: Bidirectional sync between Figma components and Brain memory. Ensures design system state is always logged, searchable, and recoverable.
---

# Figma-Component-Sync Skill

> **Principle:** If it's not in Brain, it doesn't exist. Figma is the workspace; Brain is the source of truth.
>
> Fixes: Team Durham created Figma components but didn't log them to Brain. This skill ensures every component creation, update, and deletion is automatically logged.

## The Sync Architecture

```
Figma ← → Brain (Bidirectional)
        ↓
   ┌─────────────┐
   │  MCP Layer  │  ← Figma Plugin API + Brain MCP
   └─────────────┘
        ↓
   ┌─────────────┐
   │ Sync Engine │  ← Detects changes, resolves conflicts
   └─────────────┘
        ↓
   ┌─────────────┐
   │   Brain     │  ← PostgreSQL (episodic) + RuVector semantic graph
   └─────────────┘
```

## Sync Modes

### Mode 1: Figma → Brain (Create/Update)
When components are created or modified in Figma:

```javascript
// Detected: New component in Figma
{
  event: "COMPONENT_CREATED",
  file_key: "FIGMA_FILE_KEY_EXAMPLE",
  node_id: "13:3",
  name: "Logo/Full/Color",
  properties: {
    width: 200,
    height: 60,
    fills: [{ type: "IMAGE", imageHash: "abc123" }]
  }
}

// Sync to Brain
memory_add({
  group_id: "allura-team-durham",
  user_id: "glaser",
  content: "Figma component created: Logo/Full/Color (node: 13:3). Dimensions: 200×60px. Uses actual PNG asset.",
  metadata: {
    client: "allura-memory",
    figma: {
      file_key: "FIGMA_FILE_KEY_EXAMPLE",
      node_id: "13:3",
      component_name: "Logo/Full/Color"
    },
    asset_type: "logo",
    dimensions: { width: 200, height: 60 }
  }
});
```

### Mode 2: Brain → Figma (Restore/Rebuild)
When recreating components from Brain memory:

```javascript
// Query Brain for all logo components
memory_search({
  query: "logo components figma file_key",
  group_id: "allura-team-durham",
  user_id: "glaser"
});

// Result contains all component specs
// Rebuild in Figma from specifications
```

### Mode 3: Conflict Resolution
When Figma and Brain diverge:

```javascript
// Detect conflict
const figma_version = getFigmaComponent(node_id);
const brain_version = memory_get(memory_id);

if (figma_version.lastModified > brain_version.timestamp) {
  // Figma is newer — update Brain
  memory_update(memory_id, {
    content: "Component updated in Figma",
    metadata: figma_version.properties
  });
} else if (brain_version.timestamp > figma_version.lastModified) {
  // Brain is newer — update Figma (rare)
  updateFigmaComponent(node_id, brain_version.properties);
}
```

## Workflow

### Step 1: Initialize Sync
```javascript
// On skill activation
memory_search({
  query: "figma components allura-memory",
  group_id: "allura-team-durham",
  limit: 50
});

// Verify Figma file access
const file_key = "FIGMA_FILE_KEY_EXAMPLE";
const metadata = await figma.getMetadata(file_key);
```

### Step 2: Full Sync (Initial)
```javascript
// Get all components from Figma
const components = await figma.getComponents(file_key);

// Log each to Brain
for (const component of components) {
  memory_add({
    group_id: "allura-team-durham",
    user_id: "glaser",
    content: `Figma component synced: ${component.name}`,
    metadata: {
      client: "allura-memory",
      figma: {
        file_key,
        node_id: component.id,
        name: component.name,
        type: component.type
      },
      synced_at: new Date().toISOString()
    }
  });
}
```

### Step 3: Continuous Sync
Monitor Figma for changes:
```javascript
// Poll every 30 seconds for changes
setInterval(async () => {
  const changes = await figma.checkChanges(file_key, last_sync_timestamp);

  for (const change of changes) {
    memory_add({
      group_id: "allura-team-durham",
      user_id: "glaser",
      content: `Figma component ${change.action}: ${change.node.name}`,
      metadata: {
        action: change.action, // created, updated, deleted
        node_id: change.node.id,
        changes: change.differences
      }
    });
  }
}, 30000);
```

## Component State Tracking

### State Machine
```
CREATED → MODIFIED → PUBLISHED → UPDATED → DEPRECATED → DELETED
   ↓         ↓          ↓           ↓          ↓           ↓
 Brain     Brain      Brain       Brain      Brain       Brain
```

### Event Types

| Event | Trigger | Brain Log |
|-------|---------|-----------|
| COMPONENT_CREATED | New component in Figma | Full spec logged |
| COMPONENT_MODIFIED | Properties changed | Delta logged |
| COMPONENT_PUBLISHED | Library published | Version noted |
| COMPONENT_DEPRECATED | Marked deprecated | Migration guide |
| COMPONENT_DELETED | Removed from Figma | Archive + reason |

## Recovery Scenarios

### Scenario 1: Figma File Corruption
```javascript
// Rebuild from Brain
const components = memory_search({
  query: "figma components allura-memory",
  group_id: "allura-team-durham"
});

// Recreate each component in new Figma file
for (const comp of components) {
  await figma.createComponent({
    name: comp.metadata.figma.name,
    properties: comp.metadata.properties
  });
}
```

### Scenario 2: Accidental Deletion
```javascript
// Find deleted component in Brain
const deleted = memory_search({
  query: "COMPONENT_DELETED logo",
  group_id: "allura-team-durham"
});

// Restore to Figma
await figma.createComponent(deleted[0].metadata.figma);
```

### Scenario 3: Version Rollback
```javascript
// Get component history from Brain
const history = memory_search({
  query: "Logo/Full/Color figma",
  group_id: "allura-team-durham",
  user_id: "glaser"
});

// Sort by timestamp, choose version
const previousVersion = history[1]; // Before latest

// Restore previous version
await figma.updateComponent(node_id, previousVersion.metadata.properties);
```

## Invariants

1. **Brain is source of truth** — Figma changes must be logged
2. **Every component logged** — No orphan Figma components
3. **Timestamps on everything** — Enable ordering and rollback
4. **Full specifications** — Enough detail to recreate
5. **File_key stored** — Enable direct Figma linking

## Success Criteria

- ✅ All Figma components logged to Brain
- ✅ Change history available for every component
- ✅ Recovery possible from Brain alone
- ✅ Sync events logged with timestamps
- ✅ Conflict resolution documented
- ✅ No component exists only in Figma

## Integration with Party Mode

When `/party` includes Figma work:
1. Scout discovers existing Figma components (via Brain search)
2. Glaser creates/modifies components in Figma
3. Sync engine automatically logs to Brain
4. Munari validates all components are logged
5. Nathan Curtis documents component API from Brain data

## Commands

### Manual Sync
```bash
# Force full sync
/skill figma-component-sync --full-sync --client allura-memory

# Check sync status
/skill figma-component-sync --status --client allura-memory

# Recover component
/skill figma-component-sync --recover --component Logo/Full/Color
```

## Comparison: Team Durham v3.1 vs v3.2

| Aspect | v3.1 | v3.2 (Sync Enabled) |
|--------|------|---------------------|
| Components logged | Manual, incomplete | **Automatic, 100%** |
| Change history | None | **Full timeline** |
| Recovery possible | No | **Yes, from Brain** |
| Figma ↔ Brain | One-way | **Bidirectional** |
| Component audit | Manual | **Automated** |
