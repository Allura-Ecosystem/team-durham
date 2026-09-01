# Allura Dual-Context Retrieval

## The principle

Before acting, load the smallest useful context window. Two scopes exist:

1. **Project-local memory** — Memories scoped to the current project (`group_id: allura-system`)
2. **Global memory** — Cross-project patterns, coding standards, architectural principles

Always fetch project-local first. Add global only when it improves reasoning for the current task.

## Retrieval patterns (use `allura-brain_memory_search`)

### Before writing
```
allura-brain_memory_search({ query: "<topic>", group_id: "allura-system" })
→ Check for duplicates, related context, superseded knowledge
→ Avoid inserting what already exists
```

### Before acting on a task
```
allura-brain_memory_search({ query: "<task domain>", group_id: "allura-system" })
→ Load relevant decisions, prior outcomes, known blockers
→ Don't reinvent solutions the team already found
```

### When scope is broad
```
allura-brain_memory_search({ query: "<topic>", group_id: "allura-system", limit: 10 })
→ Load project context
allura-brain_memory_search({ query: "<topic>", include_global: true, group_id: "allura-system" })
→ Add cross-project patterns if needed
```

### When troubleshooting
```
allura-brain_memory_search({ query: "<error or symptom>", group_id: "allura-system" })
→ Find prior incidents, resolutions, diagnostics baselines
```

## Search priority

1. Semantic similarity (vector search via RuVector)
2. Graph traversal (Neo4j relationships)
3. Recency (timestamp ordering)
4. Status (prefer `active` over `deprecated`)

## Context window discipline

- Return concise relevant context, not a dump
- If search returns >5 results, filter by confidence and recency
- Summarize rather than paste raw memory content
- Always cite the memory ID when referencing stored knowledge

## Anti-patterns

- **Memory dump** — Don't load everything "just in case"
- **Stale context** — Don't use memories without checking timestamps and status
- **Cross-tenant leakage** — Never search without `group_id`
- **Skip and guess** — Never act without checking what the brain already knows