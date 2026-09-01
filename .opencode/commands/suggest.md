---
description: "Suggest skills, hooks, and policies for the current task. Allura-native — learns from execution history."
argument-hint: "<task description or question>"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Skill
  - mcp__allura-brain__memory_search
  - mcp__allura-brain__memory_add
---

# /suggest — Skill Advisor

Analyze the current task and recommend which skills to load, which hooks apply, and which governance policies are relevant.

## Usage

```
/suggest implement user authentication
/suggest what skills do I need for this bug?
/suggest
```

When invoked, load and execute the `skill-advisor` skill. Pass `$ARGUMENTS` as the task context. If no arguments, analyze the current conversation context.

## Protocol

1. Load skill: `skill-advisor`
2. Execute the full recommendation protocol from the skill
3. Present the structured recommendation table
4. Offer to load the recommended skills: "Load these skills? [Y/n]"
5. If yes, invoke `/skill-load` for each P0 skill automatically
