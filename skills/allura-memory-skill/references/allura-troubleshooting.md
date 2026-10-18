# Allura Memory Troubleshooting

Inspect exposed tool names/schemas, then perform a bounded scoped read through
the configured Brain MCP connection. A successful health response alone does
not confirm memory retrieval, tenant access, approval enforcement, or complete
store coverage.

| Observation | Safe response |
|---|---|
| Tool absent or backend unavailable | Report unavailable; no direct DB/graph or local-memory fallback |
| Identity or scope denial | Stop the operation; verify current authorized context with owner, no alternate tenant/credential retry |
| Empty search | Report no matching results, not “no memories exist” |
| Graph-only results | State episodic coverage is unverified |
| Neo4j disabled under RuVector | Do not call this a RuVector failure; verify selected backend's actual health |
| Unexpected semantic write / `stored: both` | Stop further writes, preserve receipt, investigate approval provenance; do not infer approval or violation |
| Contradictory/stale records | Cite IDs and current evidence; propose append-only correction / governed immutable version |
| Unknown principal required for list/get | Do not guess user_id; use available authorized reads or report bounded coverage |
| Read-only agent has findings | Return findings to an authorized owner; do not bypass role permissions to log them |

Do not restart services, change endpoint/credentials/tenant, execute container
DB commands, or perform destructive cleanup as an implicit diagnostic step.
Continue safe non-memory work from explicit local evidence when allowed,
disclosing the memory gap. Stop work that requires unavailable authority or
memory evidence. Promotion stays human-governed via `curator:approve`.

The bundled shell helpers print checklists only and make no connectivity or
database-integrity claim. Use actual host MCP receipts for live verification;
do not run synthetic production write/delete tests.
