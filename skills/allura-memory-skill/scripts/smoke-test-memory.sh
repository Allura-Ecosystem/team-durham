#!/usr/bin/env bash
# Manual read-only checklist; never runs production mutation or cleanup tests.
set -euo pipefail
printf '%s\n' \
  'MANUAL READ-ONLY CHECKLIST — no live tests have run.' \
  'Use current host MCP schemas and an authenticated authorized group_id.' \
  'Verify a focused search returns the reported results; distinguish empty/degraded/denied.' \
  'Verify returned provenance before calling semantic records approved.' \
  'Check policy scenarios: no persona user_id, no alternate tenant retry, no DB/local fallback.' \
  'Check role boundaries: Munari read-only; Ogilvy/Tufte no episodic writes.' \
  'Do not create, promote, mutate, delete, or clean up real memories for this checklist.' \
  'Any future write-path test needs separate authorization and isolated fixtures.'
