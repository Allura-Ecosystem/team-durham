# Allura Memory Model

PostgreSQL holds append-only episodic events and traces. RuVector/PostgreSQL
holds the production semantic graph and vector search; Neo4j is a fallback only
when explicitly selected by the active runtime. Memory tools mediate access;
this reference does not authorize direct storage operations.

Every operation must carry the authorized `group_id`. Identity comes from the
authenticated transport, not a persona name. The current live MCP schema, not
historical example SQL or graph labels, defines accepted request fields.

An episodic correction appends a new trace citing the original ID and evidence.
Semantic correction creates an immutable version and a new-to-old `SUPERSEDES`
lineage edge (PG `graph_supersedes`) through the governed human curator path.
Never mutate existing versions or historical event rows.

Retrieved records may be historical, proposed, disputed, or superseded. Verify
the returned provenance and available lineage against current source evidence;
do not infer approval from storage layer, score, or an automatic curator label.
Absent provenance remains unknown, not approved. Returned counters and tags
are descriptive only until their collection semantics have been verified.
