---
name: brand-metrics-dashboard
description: "Post-delivery brand metrics dashboard and KPI tracking. Trigger when measuring brand performance, tracking KPIs, or building brand health dashboards. Use when agent_id=tufte runs BM (Brand Metrics) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Brand Metrics Dashboard

> **Phase:** Post-delivery (ongoing)
> **Executor:** @Tufte (data-analyst)
> **group_id:** `allura-team-durham`

---

## Purpose

Provide ongoing brand health KPIs after delivery. Team Durham currently ends at Phase 7 and goes dark. This skill enables clients to track whether their brand investment is performing — awareness, consistency, equity over time.

---

## Trigger Conditions

- Client requests brand performance metrics
- Quarterly brand health review
- Post-launch measurement (30/60/90 days)
- Brand investment ROI question

---

## Metrics Framework

### 1. Brand Awareness Metrics
| Metric | Source | Frequency |
|--------|--------|----------|
| Aided awareness | Survey / search volume | Quarterly |
| Unaided awareness | Survey | Quarterly |
| Share of voice | Social listening | Monthly |
| Search volume trend | Analytics | Monthly |

### 2. Brand Consistency Metrics
| Metric | Source | Frequency |
|--------|--------|----------|
| Compliance score | Brand Guardian audit | Quarterly |
| Deviation count | Guardian report | Quarterly |
| Asset usage accuracy | Internal audit | Monthly |
| Guideline adoption rate | Team survey | Quarterly |

### 3. Brand Equity Metrics
| Metric | Source | Frequency |
|--------|--------|----------|
| Perceived quality | Survey | Quarterly |
| Brand preference | Market research | Quarterly |
| Price premium | Sales data | Monthly |
| Net Promoter Score | Customer survey | Monthly |

### 4. Digital Performance
| Metric | Source | Frequency |
|--------|--------|----------|
| Website brand alignment | Audit | Quarterly |
| Social engagement | Analytics | Weekly |
| Email brand compliance | Audit | Monthly |
| Content consistency | Review | Monthly |

---

## Workflow

### 1. Data Collection
- Pull from available data sources (analytics, surveys, audits)
- Cross-reference with Brand Guardian compliance scores
- Aggregate by metric category

### 2. Scoring
Each metric scored against:
- **Target:** Based on Strategy Pack objectives
- **Trend:** Direction vs. last measurement
- **Benchmark:** vs. competitive set where available

### 3. Health Score Calculation
```
Brand Health Index = (Awareness × 0.25) + (Consistency × 0.30) + (Equity × 0.30) + (Digital × 0.15)
```

---

## Output

```markdown
# Brand Metrics Dashboard — [Brand Name]

## Brand Health Index: [X]/100 — [Trending ↑/↓/→]

## Category Scores
| Category | Score | Target | Trend | Status |
|----------|-------|--------|-------|--------|
| Awareness | [X]/100 | [target] | ↑ | On track |
| Consistency | [X]/100 | [target] | ↓ | Below target |
| Equity | [X]/100 | [target] | → | At target |
| Digital | [X]/100 | [target] | ↑ | Exceeding |

## Key Metrics
[Detailed metric cards with sparklines/trends]

## Insights
1. **[Key insight]** — [evidence]
2. **[Key insight]** — [evidence]
3. **[Key insight]** — [evidence]

## Recommendations
1. [Action based on metrics]
2. [Action based on metrics]

## Competitive Comparison
[If competitive data available]
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- Data must be **evidence-based** — no vanity metrics
- Acknowledge data limitations explicitly
- Distinguish measured vs. estimated values
- All metrics logged to PostgreSQL as `BRAND_METRICS_REPORT`