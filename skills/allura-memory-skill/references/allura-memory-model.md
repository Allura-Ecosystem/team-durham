# Allura Memory Model

## Architecture

Allura Brain is a two-store memory system:

```
┌─────────────────────────────────────────────────────────┐
│                    ALLURA BRAIN                          │
├─────────────────────┬───────────────────────────────────┤
│   POSTGRESQL 16      │      RUVECTOR SEMANTIC GRAPH       │
│   Episodic Memory    │      Semantic Memory               │
│                     │                                   │
│   • Raw traces      │   • Promoted insights              │
│   • Session events  │   • ADRs                           │
│   • Evidence logs   │   • Brand truth                    │
│   • Append-only     │   • Entity facts                   │
│                     │   • Versioned via SUPERSEDES       │
└─────────────────────┴───────────────────────────────────┘
```

**PostgreSQL** is the high-volume append-only log. Cheap writes, full audit trail.
**The RuVector semantic graph** is the low-volume curated knowledge graph. Expensive writes, high value.

---

## Node Types (semantic graph)

| Label | Description | Promoted from | Example |
|-------|-------------|---------------|---------|
| `:Memory` | Base memory node | `memory_promote` | Any promoted insight |
| `:Decision` | Strategic or architectural decision | `DESIGN_DECISION` event | "Use MCP Docker as single runtime" |
| `:ADR` | Architecture Decision Record | `DDR_CREATED` event | "ADR-007: MCP Docker single runtime" |
| `:Brand` | Brand identity entity | Phase 6 Brand Truth | "Brand: ember-fold" |
| `:Project` | Client project entity | Phase 0 brief | "Project: ember-fold" |
| `:Pattern` | Recurring pattern or convention | `LESSON_LEARNED` event | "Always search before writing to the semantic graph" |
| `:Entity` | General domain entity | Manual curation | "Competitor: Landor" |
| `:Source` | Evidence source reference | Linked on promotion | "2026-04-21 architecture audit" |

## Node Schema

### Memory Node (canonical)

Label: `:Memory`

| Property | Type | Notes |
|----------|------|-------|
| `id` | UUID | |
| `group_id` | string | **required**, pattern: `^allura-[a-z0-9-]+$` |
| `user_id` | string | **required**, Team Durham agent name |
| `content` | string | **required**, the actual memory text |
| `score` | float | 0-1 confidence score |
| `deprecated` | boolean | true if superseded or revoked |
| `created_at` | datetime | auto-set on creation |
| `source_event_id` | string | optional, links to PostgreSQL trace |

### Event Row (PostgreSQL)

```sql
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT NOT NULL,
  group_id    TEXT NOT NULL CHECK (group_id ~ '^allura-'),
  agent_id   TEXT,
  status      TEXT DEFAULT 'completed',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

**Key constraint:** `group_id` must match `^allura-[a-z0-9-]+$`. This is enforced by a CHECK constraint.

---

## Relationship Types (semantic graph)

### Lineage and Versioning

| Relationship | Semantics | Direction | Example |
|-------------|-----------|----------|---------|
| `SUPERSEDES` | New version replaces old | New → Old | `(:Decision v2)-[:SUPERSEDES]->(:Decision v1)` |
| `DEPRECATED_BY` | Reverse of SUPERSEDES | Old → New | `(:Decision v1)-[:DEPRECATED_BY]->(:Decision v2)` |
| `DISPUTES` | Conflicting claims | Challenger → Original | `(:Decision alt)-[:DISPUTES]->(:Decision original)` |
| `REVERTED_BY` | Rollback of a change | Reverted → Reverter | `(:Decision bad)-[:REVERTED_BY]->(:Decision revert)` |

### Causation and derivation

| Relationship | Semantics | Direction | Example |
|-------------|-----------|----------|---------|
| `RESULTED_IN` | Event produced an outcome | Event → Outcome | `(:Event)-[:RESULTED_IN]->(:Outcome)` |
| `YIELDED` | Outcome produced an insight | Outcome → Insight | `(:Outcome)-[:YIELDED]->(:Insight)` |
| `SUPPORTED_BY` | Insight backed by evidence | Insight → Source | `(:Insight)-[:SUPPORTED_BY]->(:Source)` |

### Entity relationships

| Relationship | Semantics | Direction | Example |
|-------------|-----------|----------|---------|
| `ABOUT` | Insight concerns an entity | Insight → Entity | `(:Insight)-[:ABOUT]->(:Brand)` |
| `FOR_PROJECT` | Scoped to a project | Insight → Project | `(:Insight)-[:FOR_PROJECT]->(:Project)` |
| `PRODUCED_BY` | Brand produced by project | Brand → Project | `(:Brand)-[:PRODUCED_BY]->(:Project)` |
| `COMPETES_WITH` | Competitive relationship | Entity → Entity | `(:Brand)-[:COMPETES_WITH]->(:Brand)` |

---

## Status Semantics

### Memory lifecycle

```
 ┌──────────┐     promote      ┌──────────┐    supersede    ┌──────────┐
 │   RAW    │ ─────────────→   │ CURATED  │ ─────────────→ │ SUPERSEDED│
 │ (PG)     │                  │ (Graph)  │                 │ (Graph)  │
 └──────────┘                  └──────────┘                 └──────────┘
                                    │                             │
                                    │ deprecate                   │ restore
                                    ▼                             │
                               ┌──────────┐                      │
                               │ DEPRECATED│ ◄────────────────────┘
                               │ (Graph)  │   (within 30-day window)
                               └──────────┘
                                    │
                                    │ revoke (permanent)
                                    ▼
                               ┌──────────┐
                               │ REVOKED  │
                               │ (Graph)  │
                               └──────────┘
```

### Status definitions

| Status | Store | Meaning | Reversible? |
|--------|-------|---------|-------------|
| `raw` | PostgreSQL | Unvalidated event trace | No (append-only) |
| `curated` | Semantic graph | Promoted, validated, active | No (only through supersede) |
| `superseded` | Semantic graph | Replaced by newer version | Via `memory_restore` (30 days) |
| `deprecated` | Semantic graph | Marked as no longer canonical | Via `memory_restore` (30 days) |
| `revoked` | Semantic graph | Permanently removed from canon | No |
| `disputed` | Semantic graph | Challenged by conflicting fact | Yes (resolve dispute) |

### Versioning rules

1. **Never edit an existing node in the semantic graph.** Always create a new version.
2. **Link versions with `SUPERSEDES`** from new → old and `DEPRECATED_BY` from old → new.
3. **Preserve the full lineage chain.** Never break the version history.
4. **Retrieval should follow the chain.** Always resolve to the latest non-deprecated version.

---

## Event Types (PostgreSQL)

All valid event types that can be logged as raw traces:

| Event Type | Description | Typical Agent |
|------------|-------------|---------------|
| `AGENT_INVOKED` | Agent session started | Any |
| `AGENT_COMPLETED` | Agent session finished | Any |
| `AGENT_FAILED` | Agent encountered error | Any |
| `DESIGN_DECISION` | Strategic/visual decision logged | Kotler, Aaker, Glaser |
| `DDR_CREATED` | Architecture Decision Record | Kotler, Aaker |
| `SKILL_PROPOSED` | New skill proposed | Any |
| `SKILL_APPROVED` | Skill proposal approved | Kotler |
| `CLIENT_FEEDBACK` | Client feedback routed | Kotler |
| `BRAND_GUARDIAN_AUDIT` | Post-delivery compliance check | Munari |
| `TRADEMARK_SCREENED` | Name availability screening | Scout |
| `TASK_COMPLETE` | Task finished successfully | Any |
| `TASK_FAILED` | Task failed | Any |
| `BLOCKED` | Progress blocked | Any |
| `LESSON_LEARNED` | Pattern or insight captured | Munari, Kotler |
| `BRAND_TRUTH_STORED` | Phase 6 Brand Truth committed | Kotler |
| `MEMORY_PROMOTED` | Raw trace promoted to semantic graph insight | Any (curator approved) |
| `MEMORY_SUPERSEDED` | Old insight superseded by new | Kotler |
| `MEMORY_REVOKED` | Insight permanently revoked | Kotler |

---

## Group ID Rules

- **Pattern:** `^allura-[a-z0-9-]+$`
- **Default:** `allura-team-durham`
- **Enforced:** PostgreSQL CHECK constraint validates on every insert
- **Scope:** All reads and writes are scoped to `group_id`
- **Never** omit `group_id` from any memory operation