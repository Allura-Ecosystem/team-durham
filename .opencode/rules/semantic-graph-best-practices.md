---
description: Semantic graph best practices for Allura Brain versioned knowledge
globs: [".claude/**", "clients/**"]
---

# Semantic Graph Best Practices — Team Durham

The semantic graph is the versioned-knowledge layer. Agents never address it directly. Every
read and write goes through the governed `allura-brain_memory_*` interface, which is the only
surface that enforces tenancy, approval, and lineage.

## The Rules

1. **SUPERSEDES, never mutate** — When knowledge needs updating, a new version is created and
   linked to the old one. The prior version is marked deprecated, not deleted. History is never
   rewritten.
2. **Search first** — Always `allura-brain_memory_search` before `allura-brain_memory_add`.
   Never create duplicates. Signal, not noise.
3. **group_id on every call** — Every read and write MUST carry `group_id` matching `^allura-`.
   A missing `group_id` is a hard failure, not a default.
4. **Promotion gate** — Only Kotler promotes. All other agents write episodic traces and read
   approved knowledge; they cannot promote their own output into active knowledge.
5. **Batch writes** — At most one promotion per completed task or decision.

## Access Interface

| Operation | Tool | Notes |
|-----------|------|-------|
| Search | `allura-brain_memory_search` | `group_id` required |
| List | `allura-brain_memory_list` | recent context hydration |
| Get | `allura-brain_memory_get` | by id |
| Add | `allura-brain_memory_add` | writes episodic; does NOT create active knowledge |
| Promote | `allura-brain_memory_promote` | Kotler only; subject to the approval gate |

## Write Discipline

PostgreSQL first. The episodic trace lands in the `events` table before anything reaches the
semantic graph. If the Postgres write fails, abort — do not promote. A promoted insight with no
trace behind it is unauditable.

Promotion is a gate, not a step. `memory_add` returning `stored: "episodic"` means the content
scored below the promotion threshold and is working as designed.

## What Is Not Permitted

- No direct database access from an agent prompt — no query language, no shell, no driver.
- No in-place edit of a historical node.
- No promotion without an approval event.
- No write that omits `group_id`.

These are enforced by the governance hooks in `.opencode/plugins/`. The hooks are the tripwire;
this file is the rule they defend.
