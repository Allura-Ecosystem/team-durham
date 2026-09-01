---
description: "IntentGate — classify user intent before Brooks routes work"
allowed-tools: ["Read", "Grep", "Glob", "Task", "allura-brain_memory_search"]
---

# IntentGate

Classify the user's request before acting. IntentGate is a routing gate, not an execution agent.

## Required sequence

1. Search Allura Brain for prior blockers/decisions/outcomes relevant to the request.
2. If implementation may be required, dispatch Scout or require existing Scout context.
3. Classify the request into one intent.
4. Route to Brooks for architecture approval when the route changes contracts, commands, agents, skills, MCPs, or guidelines.

## Intent taxonomy

```text
chat
status
research
architecture
implementation
debugging
frontend-design
documentation
skill-creation
mcp-configuration
ralph-loop
party-mode
exit
needs-clarification
```

## Routing table

| Intent | Route |
|---|---|
| research | Scout |
| architecture | Brooks |
| implementation | Scout → Woz |
| debugging | systematic-debugging → Bellard/Carmack/Woz |
| frontend-design | frontend-design/allura-design → Woz |
| documentation | quick-update/readme-memory |
| skill-creation | Brooks → skill-creator |
| mcp-configuration | Brooks/Hightower → mcp-harness |
| ralph-loop | Brooks → Ralph Skill Gate → Ralph Loop |
| party-mode | Brooks → Team RAM dispatch |

If confidence is low, return `needs-clarification` and ask one concise question.
