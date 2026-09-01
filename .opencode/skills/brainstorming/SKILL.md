---
name: brainstorming
description: "MUST use before any creative work — creating features, building components, adding functionality. Explores intent, requirements, and design before implementation. Produces spec with B#/F# traceability."
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "Agent", "allura-brain__memory_search", "allura-brain__memory_add"]
---

# Brainstorming Ideas Into Designs

Turn ideas into fully formed designs through collaborative dialogue. Produce specs that trace to the Blueprint's B#/F# requirements.

<HARD-GATE>
Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.
</HARD-GATE>

**Announce at start:** "I'm using the brainstorming skill to refine this into a design."

## Process

### 1. Hydrate Context

Before asking questions:

```javascript
// Search Brain for prior work on this topic
allura-brain__memory_search({ query: "<topic>", group_id: "allura-system", limit: 5 })
```

Also read:
- `docs/allura/BLUEPRINT.md` — identify relevant B# and F# requirements
- `docs/allura/RISKS-AND-DECISIONS.md` — check for prior decisions on this topic

### 2. Ask Clarifying Questions

- One question at a time
- Prefer multiple choice when possible
- Focus on: purpose, constraints, success criteria
- If scope covers multiple subsystems, decompose first

### 3. Propose 2-3 Approaches

- Present options with trade-offs
- Lead with your recommendation and reasoning
- Reference relevant AD-## entries if alternatives were already evaluated

### 4. Present Design

Scale each section to its complexity. Cover:
- Architecture / components
- Data flow
- Error handling
- Testing strategy

Ask after each section whether it looks right.

### 5. F# Traceability (MANDATORY)

Before saving the spec, explicitly state:

```markdown
## Requirements Traceability

| F# | Requirement | How This Spec Satisfies It |
|----|-------------|---------------------------|
| F12 | ... | ... |
| F14 | ... | ... |
```

Every spec MUST trace to at least one F# from the Blueprint. If no existing F# covers this work, flag it — the Blueprint may need updating.

### 6. Write Design Spec

Save to: `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`

Include at the top:

```markdown
> [!NOTE]
> **AI-Assisted Documentation**
> Portions of this document were drafted with the assistance of an AI language model.
> When in doubt, defer to the source code, JSON schemas, and team consensus.
```

Commit the spec.

### 7. Spec Self-Review

1. **Placeholder scan** — no TBD, TODO, or vague sections
2. **Internal consistency** — architecture matches feature descriptions
3. **F# coverage** — every referenced F# has a corresponding design section
4. **Ambiguity check** — no requirement interpretable two ways
5. **AI-GUIDELINES compliance** — cross-references present, naming matches Data Dictionary

### 8. Log to Brain

```javascript
allura-brain__memory_add({
  group_id: "allura-system",
  user_id: "brooks",
  content: "SPEC: <topic>. Satisfies F12, F14. Approach: <summary>. Saved to docs/superpowers/specs/<file>."
})
```

### 9. Transition to Implementation

> "Spec complete and saved. Ready to create the implementation plan using writing-plans."

Invoke `writing-plans` skill. Do NOT invoke any other skill.

## Key Principles

- **YAGNI ruthlessly** — remove unnecessary features
- **One question at a time** — don't overwhelm
- **F# traceability is non-negotiable** — no spec without it
- **Brain search before proposing** — don't re-propose rejected patterns
- **Design for isolation** — units with clear boundaries, well-defined interfaces
