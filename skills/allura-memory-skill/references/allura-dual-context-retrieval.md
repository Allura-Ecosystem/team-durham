# Scoped, Bounded Retrieval

Start with the authenticated project's authorized `group_id`, a focused topic
plus decisions/blockers/outcomes, `include_global: false`, and limit 5. Resolve
actual host tool names and current request schemas. Do not substitute a team
name, persona, or guessed personal tenant for authenticated scope.

Use relevant dates, sources, status/lineage actually returned, and current local
evidence to assess results. High score is relevance, not human approval. Empty
results are no matches, not an inventory. Graph-only results do not establish
episodic coverage; state this limitation. Inspect the live schema: the current
search tool supports `status: "approved" | "all"`. Prefer approved retrieval;
authorized `all` results may include historical or unapproved evidence. A failed
`all` call leaves broader coverage unconfirmed, even if approved retrieval works.

Global/cross-project retrieval requires explicit authorization and actual tool
support. `include_global` is a scope flag, not a way to retrieve unapproved or
deprecated records. Never use an unscoped direct graph or SQL search fallback.

Share concise relevant findings and a receipt (query, tenant, time, result
count, limitations). Reuse only while objective, workspace revision, tenant,
authority, and evidence remain fresh. Refresh for changed scope or blockers;
do not duplicate the same startup search for each specialist.

When records conflict, preserve both as evidence and seek the better-supported
current source. If lineage/provenance cannot be verified, say so and propose
human review; do not silently choose the newer note or rewrite history.
