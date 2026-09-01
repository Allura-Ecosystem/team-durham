# Allura Propose Promotion

## Trigger
Memory score ≥ threshold in SOC2 mode, or explicit request to "propose this memory for promotion", "nominate for canonical", "submit for approval"

## Required Inputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `group_id` | string | **YES** | Tenant namespace (must match `^allura-*`). No calls without it. |
| `id` | string | yes | Episodic memory ID to propose for promotion |
| `rationale` | string | no | Reason for proposing this memory (auto-generated if omitted) |

## MCP Tool Allowlist
- `allura-brain__memory_promote` — submit episodic memory for canonical promotion
- `allura-brain__memory_search` — verify the memory exists and check its score
- `allura-brain__memory_get` — retrieve memory details before proposing

## Output Contract
```json
{
  "proposal_id": "string — canonical_proposals row ID",
  "status": "pending — always pending after propose (approval is separate skill)",
  "score": "number — relevance/confidence score",
  "group_id": "string — tenant namespace"
}
```

## Guardrails
- **Propose only.** This skill creates proposals — it does NOT approve or reject them. Approval requires the `allura-approve-promotion` skill or direct HITL action.
- **group_id required.** Every call must include group_id. Reject if missing.
- **No direct semantic graph writes.** Promotion goes through the curator pipeline (`canonical_proposals` table), never directly to the semantic graph.
- **No auto-approval.** Even when `PROMOTION_MODE=auto`, this skill only proposes. The `auto-promote.ts` service handles the approval side.
- **Verify before proposing.** Always `memory_get` to confirm the memory exists and is eligible (not already proposed, not deleted).
- **One proposal per memory.** If a proposal already exists for this memory ID, return the existing proposal_id — do not create duplicates.