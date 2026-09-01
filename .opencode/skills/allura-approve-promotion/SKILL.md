# Allura Approve Promotion

## Trigger
HITL curator action — "approve this proposal", "promote proposal X", "mark as canonical"

## Required Inputs
| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `group_id` | string | **YES** | Tenant namespace (must match `^allura-*`). No calls without it. |
| `proposal_id` | string | yes | Canonical proposal ID to approve |
| `curator_id` | string | yes | Identity of the human curator (must not be "system" or "auto") |
| `rationale` | string | no | Reason for approval (required in SOC2 mode) |

## MCP Tool Allowlist
- `allura-brain__memory_promote` — execute the promotion after HITL approval
- `allura-brain__memory_search` — verify the promoted memory is retrievable after promotion
- `allura-brain__memory_get` — confirm the proposal exists and is in pending status

## Output Contract
```json
{
  "memory_id": "string — Neo4j canonical node ID",
  "status": "approved",
  "witness_hash": "string — SHAKE-256 hash for audit trail",
  "group_id": "string — tenant namespace"
}
```

## Guardrails
- **Human-only.** `curator_id` must identify a human — never "system", "auto", or "auto-promote". Auto-promotion uses `src/lib/curator/auto-promote.ts`, not this skill.
- **group_id required.** Every call must include group_id. Reject if missing.
- **Pending only.** Proposals must be in `status=pending`. Reject if already approved or rejected.
- **Verify after promotion.** After calling `memory_promote`, run `memory_search` to confirm the canonical memory is retrievable. If not retrievable, log a warning and return partial success.
- **Immutable after approval.** Once a proposal is approved, its `witness_hash` is frozen. Never modify an approved proposal.
- **SOC2 mode.** When `PROMOTION_MODE=soc2`, the `rationale` field is mandatory. Reject if missing.