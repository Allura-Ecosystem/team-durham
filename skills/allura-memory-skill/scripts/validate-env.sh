#!/usr/bin/env bash
# Read-only checklist; deliberately performs no network, container, or DB calls.
set -euo pipefail
printf '%s\n' \
  'MANUAL CHECKLIST — no live connectivity has been tested.' \
  '1. Discover the configured Brain MCP tools and inspect their current schemas.' \
  '2. Resolve authenticated project scope and principal; do not guess either.' \
  '3. Run a bounded memory_search in the authorized group_id, include_global=false.' \
  '4. Record actual result count, backend coverage, degradation, and provenance limits.' \
  '5. On denial stop; on unavailable Brain disclose the gap. No alternate tenant or DB fallback.'
