---
name: brand-guardian-monitor
description: "Post-delivery brand consistency monitoring and drift detection. Trigger when monitoring brand compliance, detecting drift, or auditing brand asset usage. Use when agent_id=munari runs BG (Brand Guardian) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Brand Guardian Monitor

> **Phase:** Post-delivery (ongoing)
> **Executor:** @Munari (qa-reviewer)
> **group_id:** `allura-team-durham`

---

## Purpose

Continuous compliance monitoring after Brand Kit delivery. Currently, Team Durham delivers a brand kit and walks away. No skill checks if delivered brands stay consistent over time as internal teams use them. This skill provides periodic automated audits.

---

## Trigger Conditions

- Client requests ongoing brand monitoring
- Time-based trigger (quarterly review)
- Client shares new materials for compliance check
- Post-delivery deviation is suspected

---

## Workflow

### 1. Baseline Capture
At delivery time:
- Snapshot Brand Kit as compliance baseline
- Store key specifications (colors, fonts, logo variants)
- Record approved assets in Allura Brain

### 2. Periodic Audit
For each audit cycle:
- **Digital channels:** Check website, social media, email templates
- **Print materials:** Review any new collateral against brand kit
- **Internal comms:** Check presentations, documents, proposals
- **Partnerships:** Review co-branded materials

### 3. Deviation Detection
| Check | Method | Threshold |
|-------|--------|----------|
| **Color accuracy** | Compare HEX values in use vs. spec | ±5 HEX tolerance |
| **Logo usage** | Check clear space, minimum size, variants | Must match spec |
| **Typography** | Verify font usage in digital/print | Must match spec |
| **Voice consistency** | Sample copy against voice guide | Score against dimensions |
| **Asset integrity** | Verify no modified/unauthorized assets | Zero tolerance |

### 4. Compliance Scoring
| Score | Grade | Action |
|-------|-------|--------|
| 95-100 | A | Excellent — maintain |
| 85-94 | B | Good — minor corrections |
| 70-84 | C | Needs attention — schedule corrections |
| 50-69 | D | Drifting — intervention needed |
| <50 | F | Off-brand — emergency retraining |

### 5. Remediation Report
- Flag each deviation with severity (critical/major/minor)
- Provide specific correction instructions
- Link to relevant Brand Kit section
- Track correction status

---

## Output

```markdown
# Brand Guardian Report — [Brand Name]
## Audit Date: [date]

## Overall Compliance: [X]% — Grade [A-F]

## Channel Scores
| Channel | Score | Status |
|---------|-------|--------|
| Website | 98% | ✅ Compliant |
| Social Media | 87% | ⚠️ Minor issues |
| Email Templates | 92% | ✅ Compliant |
| Print Collateral | 75% | ⚠️ Needs correction |

## Deviations Found
| # | Severity | Channel | Issue | Brand Kit Section | Fix |
|---|----------|---------|-------|-------------------|-----|
| 1 | Critical | Social | Logo stretched | §3 Logo System | Replace with approved asset |
| 2 | Major | Print | Wrong Pantone | §4 Color Palette | Use approved PMS [code] |
| 3 | Minor | Web | Off-brand font | §5 Typography | Replace with [approved font] |

## Trend (vs. last audit)
- Overall: ↑2% / ↓5% / → same
- Notable: [what changed]

## Recommendations
1. [Priority correction]
2. [Training need]
3. [Process improvement]
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- Munari is **read-only** — flags issues, never fixes
- Baseline captured at delivery (Phase 7)
- All audits logged to PostgreSQL as `BRAND_GUARDIAN_AUDIT`
- Zero tolerance for logo misuse (always critical)