---
name: "source-command-validate"
description: "Validate brand deliverables against the QA checklist"
---

# source-command-validate

Use this skill when the user asks to run the migrated source command `validate`.

## Command Template

# Validate Command

Run QA validation on brand deliverables using the Munari QA Reviewer agent.

## Usage

```
/validate
/validate [client-name]
/validate [client-name] --phase [phase-number]
```

## What This Command Does

1. **Load QA Checklist** — 60 items across 5 categories
2. **Read all deliverables** for the client
3. **Run validation** using the qa-reviewer agent
4. **Generate QA Report** with pass/fail scoring

## Validation Categories

| Category | Items | Weight |
|----------|-------|--------|
| Strategy Alignment | 10 | Critical |
| Visual Consistency | 15 | Critical |
| Copy Consistency | 10 | Major |
| Deliverable Completeness | 15 | Major |
| Production Readiness | 10 | Standard |

## Scoring

| Result | Threshold | Action |
|--------|-----------|--------|
| **PASS** | 85%+ (51+/60) | Proceed to Phase 6 |
| **CONDITIONAL** | 70-84% (42-50/60) | Fix critical issues |
| **FAIL** | <70% (<42/60) | Return to producing agents |

## Output Format

```
# QA Validation Report — [Client Name]

## Summary
- **Score:** [X]/60 ([X]%)
- **Result:** [PASS/CONDITIONAL/FAIL]
- **Validator:** Munari

## Category Breakdown
[Detailed scoring by category]

## Critical Issues
[Must-fix items]

## Recommendations
[Next steps]
```

## Rules

- QA is read-only — flags issues but does not fix
- 85% threshold is non-negotiable
- All critical issues must be resolved before proceeding
