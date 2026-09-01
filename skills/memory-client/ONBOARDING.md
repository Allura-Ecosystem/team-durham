# Allura Brain Memory Logging — Quick Reference

## Status: ✅ Brain Always Online

PostgreSQL (episodic) and the RuVector semantic graph are connected. Use direct Brain logging only — no local file fallback.

---

## Quick Log Entry

### Using the Script (Recommended)
```bash
./scripts/log_brain_event.sh \
  "FIGMA_FILE_UPDATED" \
  "glaser" \
  "completed" \
  '{"file_key": "FIGMA_FILE_KEY_EXAMPLE", "changes": ["logo_imported", "colors_corrected"]}'
```

### Verify It Worked
```bash
make db-events  # Show last 10 events
```

---

## Event Types by Agent

| Agent | Common Event Types |
|-------|-------------------|
| **kotler** | BRAND_ORCHESTRATION, STRATEGY_PACK_CREATED, PARTY_MODE_SESSION |
| **aaker** | STRATEGY_PACK_CREATED, POSITIONING_LOCKED, ARCHETYPE_VALIDATED |
| **glaser** | LOGO_PACK_CREATED, COLOR_PALETTE_DEFINED, TEXT_STYLES_CREATED, FIGMA_COMPONENT_CREATED |
| **rand** | BRAND_KIT_ASSEMBLED, SPACING_SYSTEM_CREATED, SHADOW_STYLES_CREATED |
| **munari** | QA_REPORT_GENERATED, CONSISTENCY_CHECK, PRODUCTION_READINESS_VALIDATED |
| **ogilvy** | NAMING_PACK_CREATED, COPY_PACK_CREATED, TAGLINE_OPTIONS_GENERATED |

---

## When to Log

### Always Log:
- ✅ New deliverables created
- ✅ Brand decisions made (positioning, naming, colors)
- ✅ Figma/file modifications
- ✅ QA findings (pass/fail)
- ✅ Party Mode sessions
- ✅ Bug fixes and resolutions

### Never Log:
- ❌ File reads (ephemeral)
- ❌ "Started working on X" (git shows this)
- ❌ Play-by-play steps

---

## Invariant: Brain-Only

**Never use local files for memory.** If Brain is down:
1. Run `make db-status` to check connections
2. Fix the issue (containers may need restart)
3. **Do not work without Brain** — memory would be lost

---

## Direct SQL (For Admins)

```bash
docker exec knowledge-postgres psql -U ronin4life -d memory -c "
SELECT event_type, agent_id, status, created_at
FROM events
WHERE group_id = 'allura-team-durham'
ORDER BY created_at DESC
LIMIT 10;
"
```

---

*Last updated: 2026-04-20*
