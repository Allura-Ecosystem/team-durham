---
name: skill-creator
description: "Meta-skill for creating new skills, editing existing skills, running evals, and benchmarking skill performance. Trigger when creating a skill, optimizing skill descriptions, or testing skill trigger accuracy."
globs: [".claude/skills/**"]
---

# Skill Creator

A meta-skill for creating new skills and iteratively improving them. This skill is used when users want to create a skill from scratch, edit or optimize an existing skill, run evals to test a skill, benchmark skill performance, or optimize a skill's description for better triggering accuracy.

## Core Workflow

1. **Capture Intent** — Understand what the skill should do, when it triggers, expected outputs, and whether test cases are needed
2. **Interview & Research** — Ask about edge cases, inputs/outputs, dependencies; check MCPs for useful context
3. **Write SKILL.md** — YAML frontmatter (name, description) + markdown instructions under 500 lines
4. **Test** — Run 2-3 realistic test prompts, evaluate outputs
5. **Iterate** — Improve based on feedback, rerun, repeat until satisfied
6. **Optimize Description** — After skill is solid, optimize the description field for better triggering

## SKILL.md Anatomy

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/    - Executable code for deterministic tasks
    ├── references/ - Docs loaded into context as needed
    └── assets/     - Files used in output
```

## Writing Guidelines

- Keep SKILL.md under 500 lines; use references/ for longer content
- Explain the **why** behind instructions, not just what to do
- Prefer imperative form in instructions
- Define output formats with templates
- Include examples with Input/Output patterns
- Use theory of mind — make instructions general, not super-narrow

## Testing & Evaluation

- Create 2-3 realistic test prompts
- Run with-skill and baseline (without-skill) comparisons
- Create eval_metadata.json for each test case
- Draft quantitative assertions for objective verification
- Use the eval-viewer for qualitative review

## Description Optimization

After skill is complete:
1. Generate 20 trigger eval queries (mix of should-trigger and should-not-trigger)
2. Review with user
3. Run optimization loop for better triggering accuracy
4. Apply best description to SKILL.md frontmatter