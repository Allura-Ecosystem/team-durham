# Roundtable vs Party-Mode: When to Use Which

## The Distinction

| | **Roundtable** | **Party-Mode** |
|---|---|---|
| **Purpose** | Think, debate, decide | Build, implement, validate |
| **Output** | Diverse perspectives, consensus, or informed disagreement | Working code, schema, tests, commits |
| **Agent tools** | ❌ Forbidden — discussion only | ✅ Required — files, code, tests |
| **Duration** | Open-ended conversation | Bounded task burst |
| **User role** | Active participant in discussion | Task delegator receiving deliverables |

## Decision Tree

```
Does the user want to...

Build something or change files? ──► Party-Mode
                                  (Woz writes, Fowler gates, Brooks synthesizes)

Hear diverse opinions on a topic? ──► Roundtable
                                  (Agents debate, user decides, no code output)
```

## Examples

### Use Roundtable

- "Should we go monolith or microservices for MVP?"
- "Review this architecture decision — any red flags?"
- "Our last sprint was a disaster. What went wrong?"
- "How do we make onboarding feel magical?"
- "Is our current auth approach secure enough?"

### Use Party-Mode

- "Implement OAuth2 with session management"
- "Add a new API endpoint with tests and docs"
- "Debug this failing test suite and fix it"
- "Run load tests and optimize if needed"
- "Design and migrate the user schema"

## Why Separate Them

Mixing discussion and execution in one mode causes confusion:

- Discussion-mode agents attempting grounded code review without tool access causes hallucination
- Our party-mode forbids open-ended conversation to prevent scope creep and undefined deliverables
- Roundtable forbids tool access to keep agents focused on thinking, not accidentally writing code mid-discussion

## Complementary Usage

A typical workflow might use **both**:

1. **Roundtable**: "Should we use OAuth2 or OIDC?" → Agents debate, user decides OAuth2
2. **Party-Mode**: "Implement OAuth2 with the agreed approach" → Woz builds, Knuth designs schema, Hightower updates Docker

This preserves conceptual integrity: thinking is separated from building, and each mode does one thing well.

---
*Reference for: `.opencode/skills/roundtable/`*
