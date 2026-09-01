---
description: "Memory query — search Allura Brain for insights"
allowed-tools: ["allura-brain_memory_search"]
---

# Memory Query

Search Allura Brain for relevant insights.

## Usage

```
/query <search term>
```

## Protocol

### Phase 1: Search Memory

```javascript
allura-brain_memory_search({
  query: "<search term>",
  group_id: "allura-team-durham",
  limit: 10,
  min_score: 0.7,
  include_global: true
})
```

### Phase 2: Refine if Needed

```javascript
allura-brain_memory_search({
  query: "<related entity or decision term>",
  group_id: "allura-team-durham",
  limit: 5,
  min_score: 0.6,
  include_global: true
})
```

### Phase 3: Present Results

Present:
- Top insights with confidence scores
- Related entities
- Links to source events
- Recommendations for next steps

---

**Invoke with:** `/query <search term>`