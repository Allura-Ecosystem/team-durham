# RuVix Rule — Allura Dashboard Brand Governance

Owner: brand-orchestrator / Kotler
Applies to: Allura Dashboard, Allura Mission Control, Policies & Teams, Evidence, Curator, Graph, Missions, Traces, Dashboard Shell
Group: `allura-team-durham`

## Non-Negotiable Scope Boundary

This rule is for **Allura Dashboard** only.

Do **not** apply Difference Driven, dd-site-payload, MORII, nonprofit, dark-green/gold, Poppins/Inter/Montserrat, or DD brand assumptions to Allura Dashboard work unless the Captain explicitly says the task is Difference Driven.

Allura Dashboard is the cockpit for the AI team. Treat it as mission-control software, not a marketing website.

## Mandatory Durham Brand Gate

Before Allura Dashboard UI work is declared ready, Kotler must dispatch Team Durham for dashboard branding rules and review:

1. **Aaker** — define strategic positioning and voice for the dashboard surface.
2. **Glaser** — define visual hierarchy, palette usage, spacing rhythm, and interface tone.
3. **Munari** — audit usability, accessibility, consistency, and production readiness.
4. **Reality Checker / Evidence Collector** — verify claims with screenshots or artifact proof when available.

If the task involves agent identity, authorization, trust, or audit UX, also dispatch:

5. **Agentic Trust Architect** — verify role, permission, evidence, delegation, and audit language.
6. **Workflow Architect** — verify state machine, handoff, empty/degraded/blocked states.

## Branding Rules Durham Must Produce

Durham's output must be a concrete rules artifact, not vibes. Required sections:

- Dashboard positioning statement: what the dashboard is for and who it serves.
- Visual principles: hierarchy, density, whitespace, surface depth, motion restraint.
- Token rules: approved semantic tokens, forbidden hardcoded values, contrast constraints.
- Component rules: cards, tables, nav, warnings, evidence panels, policy controls.
- State rules: loading, empty, degraded, blocked, denied, escalated, success.
- Copy rules: mission-control tone, no fake certainty, no inflated claims, no marketing fluff.
- Evidence rules: every “done”/“verified” claim links to proof.
- Accessibility rules: AA contrast minimum, visible focus, keyboard paths, screen-reader-safe labels.
- Anti-drift rules: explicit list of Difference Driven tokens/phrases/styles that must not appear.

Preferred artifact location in the Allura repo:

`docs/allura/BRAND-RULES-dashboard-v2.md`

## RuVix Enforcement

RuVix must reject or escalate dashboard work when:

- The artifact claims Allura Dashboard work but uses Difference Driven brand tokens or language.
- A UI change lacks a source-of-truth doc or Notion card.
- A “ready/done/ship” claim lacks evidence.
- A governed action lacks audit, permission, or separation-of-duties consideration.
- Dashboard copy implies certainty when an API/store is degraded.
- Any direct mutation bypasses the approved audit wrapper or policy check.

## Board / Memory Writeback

For every Durham dashboard brand gate:

1. Update the canonical Notion Work Item with status, reviewer, decision, and evidence link when that integration is available.
2. Log a memory to Allura Memory using `group_id=allura-team-durham` and the reviewing agent's `user_id` when the write succeeds.
3. If the decision affects the Allura product, hand it to the owning Allura implementation workflow with evidence. Team Durham does not write to `allura-system` or claim that handoff as a completed implementation.
4. Store the evidence artifact in the owning repository before claiming completion.

## Ready-to-Dispatch Prompt

Use this prompt when the Captain asks Durham to help finish the dashboard:

> PM — Allura Dashboard brand governance pass. This is Allura Dashboard only, not Difference Driven. Create `docs/allura/BRAND-RULES-dashboard-v2.md` for Mission Control dashboard finishing work. Use Allura source docs, current dashboard surfaces, and Notion Work Items as source of truth. Produce concrete rules for tokens, layout, copy, components, degraded states, evidence, accessibility, and anti-drift. Dispatch Aaker, Glaser, Munari, Agentic Trust Architect, Workflow Architect, Reality Checker, and Evidence Collector as needed. Log decisions to Allura Brain with group_id `allura-team-durham` and return evidence gates required before ship.
