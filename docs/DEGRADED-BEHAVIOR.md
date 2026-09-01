# Degraded Behavior

Team Durham is useful without every optional integration, but it must remain honest about what happened.

| Missing or failed capability | Allowed behavior | Prohibited claim |
| --- | --- | --- |
| Allura Memory read | Continue using user-provided and local authoritative context; label recall unavailable | “Context hydrated from Memory” |
| Allura Memory write | Preserve the result locally when in scope and report writeback failure | “Recorded,” “promoted,” or “synced” |
| Figma | Produce a file-based spec or stop the Figma-specific phase | “Updated Figma” or “pixel matched” |
| fal.ai | Produce prompts/directions or stop image generation | “Images generated” |
| Notion | Produce a local publishing packet | “Published to Notion” |
| Docker/MCP tool | Continue only with independently available tools | “Validated through MCP” |
| Browser or screenshot evidence | Report validation incomplete | “Visually verified” |
| Approval authority | Prepare a review packet | “Approved” or “shipped” |

## Failure protocol

1. Name the unavailable capability and the real error.
2. Preserve completed, verifiable work.
3. Identify which downstream claims are now impossible.
4. Offer a bounded fallback if one exists.
5. Resume the blocked path only after the prerequisite is verifiably restored.

Local logs, queued writes, generated prompts, and agent self-reports are not substitutes for external-state verification.
