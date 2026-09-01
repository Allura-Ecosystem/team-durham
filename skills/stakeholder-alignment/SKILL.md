---
name: stakeholder-alignment
description: "Stakeholder alignment and sign-off workflow for Phase 0-1. Trigger when aligning stakeholders, getting sign-off, resolving conflicts, or onboarding decision-makers. Use when agent_id=kotler runs SA (Stakeholder Alignment) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Stakeholder Alignment

> **Phase:** 0-1 (Intent Gate + Strategy)
> **Executor:** @Kotler (brand-orchestrator)
> **group_id:** `allura-team-durham`

---

## Purpose

Manage internal client stakeholder buy-in during Strategy Pack locking — the highest-failure point in branding. Research shows 60%+ of brand projects fail not from poor creative, but from stakeholder misalignment on strategy. This skill provides a structured process to surface disagreements early and build consensus.

---

## Trigger Conditions

- Multiple stakeholders with different opinions on brand direction
- Strategy Pack revision requests that contradict each other
- Client's internal team cannot agree on positioning
- Phase 1 (Strategy) has been revised more than twice
- Client says "we need everyone on board"

---

## Workflow

### 1. Stakeholder Mapping
Identify and categorize:
| Role | Power | Interest | Strategy |
|------|-------|----------|----------|
| **Decision Maker** | High | High | Must align — get explicit buy-in |
| **Influencer** | Low | High | Must consult — get input early |
| **Approver** | High | Low | Must inform — get sign-off |
| **Observer** | Low | Low | Keep informed — no action needed |

### 2. Alignment Workshop
Run structured alignment session:
1. **Individual interviews** — capture each stakeholder's vision independently
2. **Conflict mapping** — surface where visions diverge
3. **Priority ranking** — force trade-offs (you can't have everything)
4. **Consensus framework** — agree on decision criteria before evaluating options

### 3. Decision Framework
Present the Strategy Pack with:
- **Why this positioning** — evidence chain from market data
- **What it excludes** — explicitly state what the brand will NOT be
- **Trade-off consequences** — what you gain and lose with each direction

### 4. Lock Protocol
Before locking Strategy Pack:
- [ ] Decision Maker has signed off in writing
- [ ] All Influencers have been heard and noted
- [ ] Conflicts are resolved or escalated
- [ ] "What this brand is NOT" is acknowledged
- [ ] Revision budget is agreed (how many changes remain)

### 5. Post-Lock Governance
- Document who approved what, when
- Store approval chain in PostgreSQL
- If someone reopens after lock — route through Feedback Loop skill

---

## Output

```markdown
# Stakeholder Alignment Report — [Brand Name]

## Stakeholder Map
| Stakeholder | Role | Power/Interest | Status |
|-------------|------|---------------|--------|
| [Name/Title] | Decision Maker | High/High | ✅ Aligned |
| [Name/Title] | Influencer | Low/High | ⚠️ Partially aligned |

## Alignment Score: [X]/100

## Points of Consensus
1. [What everyone agrees on]
2. [What everyone agrees on]

## Points of Conflict
1. **[Issue]** — [Stakeholder A says X, Stakeholder B says Y]
   - Resolution: [How it was resolved / Escalation needed]

## Trade-offs Acknowledged
| Choosing This | Gains | Loses |
|--------------|-------|-------|
| [Positioning] | [benefit] | [trade-off] |

## Lock Approval Chain
1. [Stakeholder] — ✅ Approved — [date]
2. [Stakeholder] — ✅ Approved — [date]
3. [Stakeholder] — ⏳ Pending

## Revision Budget
- Revisions remaining: [X of 3]
- Next unauthorized change triggers: [escalation path]
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- **No Strategy Pack lock without Decision Maker sign-off**
- Conflict documentation is mandatory — not optional
- Strategy Pack lock requires ALL Decision Makers to approve
- All approvals logged to PostgreSQL as `STAKEHOLDER_APPROVED`
- If alignment score < 70%, do NOT proceed to Phase 2