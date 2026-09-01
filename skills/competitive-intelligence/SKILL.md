---
name: competitive-intelligence
description: Competitive analysis and market intelligence workflow for Team Durham. Use when agent_id=tufte runs CA (Competitive Analysis) or MD (Market Data) commands, or when any agent needs structured competitive research. Produces competitor profiles, market maps, positioning matrices, and evidence-backed insights.
---

# Competitive Intelligence Skill

> **Executor:** @Tufte (Data Analyst)
> **Type:** Research + Analysis
> **group_id:** `allura-team-durham`

---

## Purpose

Produce rigorous, evidence-backed competitive intelligence. No chartjunk. No claims without sources. Every data point must earn its place on the page.

---

## Workflow

### Phase 1: Scope the Analysis

Before researching, define the frame:

1. **Query events table** for any prior competitive analysis:
   ```sql
   SELECT * FROM events
   WHERE event_type = 'DESIGN_DECISION'
     AND metadata::text LIKE '%competitive%'
     AND group_id = 'allura-team-durham'
   ORDER BY created_at DESC LIMIT 5;
   ```

2. **Identify analysis dimensions** based on the brand's locked positioning:
   - Category competitors (same product/service)
   - Adjacent competitors (same audience, different category)
   - Aspirational competitors (same archetype, different industry)
   - Emerging threats (new entrants, technology shifts)

3. **Set the evidence standard:**
   - Primary: Web research with source URLs
   - Secondary: grep-mcp code evidence (for OSS competitors)
   - Tertiary: Market data from perplexica/exa (news, reports)
   - Never use: Anecdotal claims, unverified assertions

### Phase 2: Research

**Tool chain (run in parallel where independent):**

| Step | Tool | Purpose |
|------|------|---------|
| 2a | `perplexica_search` | News, press, recent moves |
| 2b | `perplexica_extract` | Scrape competitor websites |
| 2c | `perplexica_research` | Deep research on key competitors |
| 2d | `web_search_exa` | Supplementary web search |
| 2e | `grep_query` | Find competitor OSS code patterns |
| 2f | `resolve-library-id` → `get-library-docs` | Get dependency/SDK docs for tech competitors |

**Research checklist per competitor:**
- [ ] Brand positioning (what they claim)
- [ ] Visual identity (logo, colors, typography — analyze images if available)
- [ ] Voice and tone (how they speak)
- [ ] Target audience (who they serve)
- [ ] Pricing model (how they monetize)
- [ ] Strengths (what they do well)
- [ ] Weaknesses (where they falter)
- [ ] Recent changes (last 6 months)

### Phase 3: Structure the Analysis

#### Output Format: Competitive Landscape Report

```markdown
# Competitive Landscape Report

**Project:** [brand name]
**Date:** YYYY-MM-DD
**Analyst:** Tufte (Data Analyst)
**Analysis Scope:** [category/adjacent/aspirational/emerging]

## Executive Summary
[3-5 sentences. The most critical insight only.]

## Competitor Profiles

### [Competitor 1]
- **URL:** [source]
- **Positioning claim:** [direct quote]
- **Target audience:** [description]
- **Visual identity:** [colors, type, style notes]
- **Voice:** [tone, personality]
- **Pricing:** [model and range]
- **Strengths:** [evidence-backed]
- **Weaknesses:** [evidence-backed]
- **Recent moves:** [last 6 months]

[Repeat for each competitor]

## Positioning Matrix

| Dimension | [Our Brand] | [Comp 1] | [Comp 2] | [Comp 3] |
|-----------|-------------|----------|----------|----------|
| Price point | — | — | — | — |
| Primary personality | — | — | — | — |
| Target segment | — | — | — | — |
| Key differentiator | — | — | — | — |
| Visual style | — | — | — | — |

## Market Map
[2x2 positioning map description]
- X-axis: [dimension, e.g., Price: Low → High]
- Y-axis: [dimension, e.g., Personality: Warm → Bold]
- Quadrant positions for each competitor

## White Space Analysis
[Where in the matrix is unoccupied? What positioning is available?]

## Strategic Implications
1. [Implication with evidence]
2. [Implication with evidence]
3. [Implication with evidence]

## Methodology
- **Sources:** [list all URLs and databases]
- **Date range:** [research period]
- **Limitations:** [what we couldn't verify]

## Appendix
[Raw data, screenshots, full source URLs]
```

### Phase 4: Validate & Log

1. **Evidence check:** Every claim in the report must have a source citation
2. **No chartjunk:** If a visualization doesn't convey data more clearly than a table, use the table
3. **Log to events:**
   ```sql
   INSERT INTO events (event_type, group_id, agent_id, status, metadata)
   VALUES ('DESIGN_DECISION', 'allura-team-durham', 'tufte', 'completed',
     '{"decision": "competitive_analysis_complete", "competitors_analyzed": N, "key_finding": "..."}');
   ```

4. **Write the report file** to the client workspace:
   - Path: `clients/{client-slug}/03-data/competitive-landscape.md`

---

## Commands

| Command | Description | Primary Tool |
|---------|-------------|--------------|
| CA | Full competitive analysis | perplexica_research + perplexica_extract |
| MD | Market data gathering | perplexica_search + web_search_exa |
| DV | Data visualization spec | Direct output (no chartjunk) |
| EI | Evidence integration | execute_sql (read prior events) |
| VE | Validate evidence | Source verification pass |

---

## Evidence Standards

| Rating | Criteria |
|--------|----------|
| **A — Verified** | Primary source (website, SEC filing, official statement) |
| **B — Credible** | Reputable secondary source (industry report, verified news) |
| **C — Plausible** | Unverified but reasonable inference (note as "estimated") |
| **D — Anecdotal** | Single source, no verification (NEVER include in report) |

**Rule:** No D-rated evidence in any deliverable. C-rated evidence must be flagged.

---

## Allura Brain Integration

- Read prior events before starting any analysis (avoid duplication)
- Write `DESIGN_DECISION` events for all major findings
- Write `DDR_CREATED` for strategic pivots identified through competitive data
- `group_id`: `allura-team-durham`
- `agent_id`: `tufte`