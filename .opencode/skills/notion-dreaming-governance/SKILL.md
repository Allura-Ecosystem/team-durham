---
name: notion-dreaming-governance
description: Enforces Notion-first governance for Dreaming product artifacts under the Allura memory Notion project. Use whenever creating, updating, researching, or planning Dreaming product brief, PRD, stories, governance, ADR drafts, or research artifacts. Prevents local product-doc drift and requires Brain-first retrieval, Allura memory Notion target fetch, governed Notion writes, and outcome logging.
---

# Notion Dreaming Governance

Use this skill whenever work touches **Dreaming** product artifacts, including:

- product brief
- PRD
- domain research
- market research
- implementation stories
- governance notes
- ADR or decision drafts
- Notion dashboard/project updates for Dreaming

## Canonical target

Dreaming artifacts live under the **Allura memory** Notion project unless the human explicitly chooses another Notion target.

- Allura memory page: `https://www.notion.so/Allura-memory-33b1d9be65b38045b6b0fa8c48dbc17b`
- Page ID: `33b1d9be65b38045b6b0fa8c48dbc17b`
- Governance page: `https://www.notion.so/35b1d9be65b381f88d5dff703b02a452`
- Decision page: `https://www.notion.so/35b1d9be65b38122b86defcefd75f7ab`

## Required workflow

1. **Search Allura Brain first**
   - Use `allura-brain_memory_search`.
   - Always include `group_id: "allura-system"`.
   - Query must include the artifact type and `Dreaming blockers decisions outcomes`.

2. **Fetch the Notion target before writing**
   - Use Notion fetch on the Allura memory page.
   - Confirm the target is the Allura memory project or a human-approved replacement.

3. **Do not create local Dreaming product docs by default**
   - Do not write product brief, PRD, research, or story artifacts under `docs/` unless the human explicitly requests a repo mirror.
   - Local executable skill files are allowed because they enforce workflow rather than acting as product artifacts.

4. **Write artifacts to Notion**
   - Product brief, research, PRD, and story drafts should be child pages under Allura memory unless a database is explicitly selected.
   - Implementation-ready stories may go into the Allura stories Work Items database after human approval.
   - Decisions should remain draft pages unless explicitly promoted to canonical docs or an insights/ADR registry.

5. **Respect stack boundaries**
   - Dreaming is the operator bridge.
   - Allura Brain is the governed memory/API layer.
   - RuVector/RuVix/Cognitum is foundational substrate in this stack.
   - Agents must not bypass Allura Brain governance to write directly to RuVector, Neo4j, or canonical Notion knowledge.

6. **Log outcome to Brain**
   - Use `allura-brain_memory_add` before final response.
   - Include what was created/updated, Notion URLs, and any unresolved blockers.
   - Use `user_id` matching the agent persona, e.g. `brooks-architect`.

## Artifact naming

Use clear titles:

- `Dreaming Product Brief — YYYY-MM-DD`
- `Dreaming Domain Research — YYYY-MM-DD`
- `Dreaming Market Research — YYYY-MM-DD`
- `Dreaming PRD — YYYY-MM-DD`
- `Dreaming Implementation Stories — YYYY-MM-DD`
- `Decision — <short decision>`

## Governance rules

- Notion is the planning source of truth for Dreaming.
- The existing Allura canon remains the canonical six-document set until the human approves promotion.
- Research and product artifacts do not override canon.
- Canon changes require explicit approval and must update the relevant canonical doc and traceability artifacts together.
- Memory promotion to semantic/canonical stores requires the curator/HITL path.

## Completion checklist

Before saying work is complete, confirm:

- Brain was searched.
- Allura memory Notion target was fetched.
- Artifact was written to Notion, not local product docs.
- URL(s) are included in the response.
- Outcome was logged to Allura Brain.
