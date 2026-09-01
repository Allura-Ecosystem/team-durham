---
name: client-feedback-loop
description: "Client feedback ingestion and iteration workflow. Trigger when processing client feedback, iterating on deliverables, or managing revision rounds. Use when agent_id=kotler runs CF (Client Feedback) command."
globs: ["clients/**", ".claude/**"]
---

# Skill: Client Feedback Loop

> **Phase:** Post-delivery (any phase)
> **Executor:** @Kotler (brand-orchestrator)
> **group_id:** `allura-team-durham`

---

## Purpose

Route client revision requests back into the correct pipeline phase. Currently, Team Durham's pipeline is one-directional: Phases 0→7 with no mechanism for the client to say "change this" after a phase completes. This skill closes the loop.

---

## Trigger Conditions

- Client requests changes to any deliverable after phase completion
- Client rejects a deliverable (e.g., "We don't like these logo directions")
- Client provides new information that affects earlier phases
- Stakeholder feedback requires rework

---

## Workflow

### 1. Ingest Feedback
```json
{
  "phase": 3,
  "deliverable": "logo-direction-generator",
  "feedback_type": "rejection|revision|new_info",
  "feedback_text": "Client says colors feel too corporate",
  "severity": "minor|major|blocking"
}
```

### 2. Classify the Feedback
| Feedback Type | Action | Rerun Phase? |
|--------------|--------|-------------|
| **Minor revision** | Adjust within current phase | No — producing agent fixes |
| **Major revision** | Return to producing agent with expanded brief | No — but agent must re-deliver |
| **Strategic misalignment** | Feedback contradicts locked Strategy Pack | Yes — must unlock and re-run from Phase 1 |
| **New information** | Client provides info that changes the brief | Yes — return to Phase 0 |

### 3. Route to Agent
| Phase | Agent | Command |
|-------|-------|---------|
| 0 | @Kotler | Re-validate brief |
| 1 | @Aaker | Re-lock Strategy Pack (requires approval) |
| 2 | @Aaker+Ogilvy | Revise Naming Pack |
| 3 | @Glaser | Revise Logo Pack / Visual Direction |
| 4 | @Ogilvy+Rand | Revise Copy Pack / Brand Kit |
| 5 | @Munari | Re-run QA after fixes |

### 4. Guard Rails
- **Strategy Pack is locked.** If feedback contradicts positioning, Kotler must approve unlocking
- **QA is read-only.** Feedback fixes go to producing agent, never to Munari
- **Maximum 3 revision rounds** per phase before escalation to client call
- **All feedback is logged** to PostgreSQL with `event_type = 'CLIENT_FEEDBACK'`

### 5. Event Logging
```sql
INSERT INTO events (event_type, group_id, agent_id, status, metadata)
VALUES ('CLIENT_FEEDBACK', 'allura-team-durham', 'kotler', 'routed',
  '{"phase": 3, "deliverable": "logo-pack", "feedback_type": "minor_revision", "routed_to": "glaser"}');
```

---

## Output

```markdown
# Client Feedback Report

## Feedback Summary
- **Phase:** [X]
- **Deliverable:** [name]
- **Classification:** [minor/major/strategic]
- **Routed To:** [@agent]

## Feedback Details
[Client's exact words]

## Action Plan
1. [What the producing agent must change]
2. [What stays the same]
3. [Impact on downstream phases]

## Impact Assessment
- **Upstream affected:** [yes/no + which phases]
- **Downstream affected:** [yes/no + which phases]
- **Estimated revision round:** [X of 3]
```

---

## Invariants

- `group_id = 'allura-team-durham'`
- Strategy Pack changes require **Kotler approval** to unlock
- Maximum **3 revision rounds** per phase
- All feedback **logged to PostgreSQL** before routing
- QA (@Munari) **never receives feedback** — only producing agents