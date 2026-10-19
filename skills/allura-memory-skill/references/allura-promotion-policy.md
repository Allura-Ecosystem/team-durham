# Human-Governed Promotion and Correction

Promotion requires evidence, a duplicate/conflict search, a useful durable
claim, and explicit human approval through `curator:approve`. Confidence alone
does not grant approval. User emphasis or a general request to finish work is
not semantic promotion authority.

An authorized agent may prepare a candidate containing the source trace IDs,
claim, rationale, validation, conflicting records, and proposed lineage. Inspect
the current proposal tool schema before using it; do not assume a
`memory_promote` tool exists or immediately queues a proposal. A proposal is not
approved knowledge. Munari remains read-only and cannot submit promotion.
Every proposal and read uses the current authenticated authorized group_id;
proposal permission does not grant another project's scope.

For corrections, preserve append-only episodic history. Human-approved semantic
changes create immutable new versions with `SUPERSEDES` lineage; never add
observations to existing canonical nodes as a shortcut. Kotler coordinates
version proposals but has no exemption from the approval gate. Agents never
approve/promote their own work or call direct SQL/graph operations to bypass it.

Unexpected semantic storage from an ordinary outcome write requires review of
the write path and approval provenance before further writes. Do not claim a
violation without evidence, infer approval, delete the record, or “repair” its
history in place. Removal/recovery uses only separately authorized verified
procedures; no assumed soft-delete or 30-day recovery guarantees.
