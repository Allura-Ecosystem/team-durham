---
name: notion-brand-publisher
description: >
  Create and update Notion pages with brand presentation content, screenshots, and
  delivery links for client review. Use when (1) user asks to 'publish to Notion',
  'update Notion page', 'share brand on Notion', (2) brand presentation is complete
  and needs a client-facing Notion page, (3) screenshots exist and need to be
  cataloged on Notion, (4) any agent needs to push brand deliverables to Notion for
  client visibility. Handles page creation, content formatting, screenshot inventory,
  and the known Notion MCP integration mismatch workaround.
---

# Notion Brand Publisher

> **Executor:** Any Team Durham agent
> **Type:** Publishing (Notion integration)
> **Prerequisite:** Completed brand presentation with screenshots
> **group_id:** `allura-team-durham`

---

## Purpose

Notion is the client's primary interface for reviewing brand work. This skill handles creating and updating Notion pages with brand presentation content — overview, logo options, color system, typography, screenshots, and next-step CTAs. It accounts for the known Notion MCP integration limitations and provides reliable workarounds.

---

## Notion MCP Integration Architecture

### The Two Integrations Problem

The workspace has **two** Notion MCP integrations with different capabilities:

| Integration | Tools | Works | Limitation |
|-------------|-------|-------|------------|
| `notion-remote` | `notion-search`, `notion-fetch`, `notion-get-comments` | **Yes** | Read-only |
| Raw API tools | `MCP_DOCKER_API-post-page`, `MCP_DOCKER_API-patch-page` | **401 errors likely** | Token may be invalid or misconfigured |
| Hybrid tools | `MCP_DOCKER_notion-create-pages`, `MCP_DOCKER_notion-update-page` | **Partial** | Create works; update may fail with `object_not_found` |

### Decision Rule

1. **Creating a new page** → Use `MCP_DOCKER_notion-create-pages` (most reliable)
2. **Updating an existing page** → Try `MCP_DOCKER_notion-update-page` first; if it fails with `object_not_found`, fall back to creating a new page and linking it
3. **Reading/searching** → Use `MCP_DOCKER_notion-search` or `MCP_DOCKER_notion-fetch`
4. **Never rely on** `MCP_DOCKER_API-post-page` or `MCP_DOCKER_API-patch-page` — these raw API tools have authentication issues

---

## Page Structure

### Brand Presentation Page — Content Sections

A brand presentation Notion page should contain these sections, in order:

```markdown
# [BRAND NAME] — Brand Identity Presentation

## Overview
[Brief intro: who the client is, what this page covers]

## Brand Strategy
[Archetype, positioning statement, brand promise]

## Logo Directions
[Each direction with name, description, evaluation criteria]
[Bullet list, not embedded images — Notion Markdown supports image URLs]

## Color System
[Token names, hex values, usage rules, WCAG results]
[Present as table for readability]

## Typography
[Font families, scale, pairing rules]

## Messaging & Voice
[Brand pillars, taglines, voice principles]

## Presentation Screenshots
[Inventory of all screenshot files with descriptions]

## Next Steps
[Deposit CTA, timeline, contact info]
```

### Brand Token Tables

Colors, typography, and WCAG data are best presented as Notion tables:

**Example — Color Token Table:**
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#D42B2B` | CTA buttons, accent bars, key highlights |
| Secondary | `#E8A838` | Warm accents, photo frame borders |
| Tertiary | `#2EC4C4` | Interactive elements, links, hover states |

**Example — WCAG Contrast Table:**
| Foreground | Background | Ratio | AA Normal | AA Large |
|-----------|-----------|-------|-----------|----------|
| `#1A1A1A` | `#F5EDE0` | 14.2:1 | ✅ Pass | ✅ Pass |
| `#F5EDE0` | `#D42B2B` | 3.1:1 | ❌ Fail | ✅ Pass |

---

## Creation Workflow

### Step 1: Create the Page

Use `MCP_DOCKER_notion-create-pages`:

```
parent: { type: "workspace" }  // Or page_id if there's a parent
pages: [{
  properties: { title: "[BRAND NAME] — Brand Identity Presentation" },
  content: "[Full page content in Notion Markdown]",
  icon: "🎨",
  cover: "[Optional: brand-related image URL]"
}]
```

**Save the returned page ID** — it's needed for any updates.

### Step 2: Verify Page Exists

```
MCP_DOCKER_notion-fetch({ id: "[page-id-from-step-1]" })
```

Confirm the content rendered correctly. Notion Markdown has specific syntax — verify headings, tables, and formatting.

### Step 3: Record Page URL

Log the Notion page URL to the client's project files:

```bash
echo "[Notion Page URL]" >> clients/{client-slug}/presentation-artifacts/notion-page-url.txt
```

This URL is the primary sharing link for the client.

---

## Update Workflow

### Attempt Update (may fail)

```
MCP_DOCKER_notion-update-page({
  page_id: "[page-id]",
  command: "update_content",
  content_updates: [{
    old_str: "## Next Steps\n[old content]",
    new_str: "## Next Steps\n[new content with screenshots and links]"
  }]
})
```

### If Update Fails with `object_not_found`

The two integrations have different workspace access. The page was created by one integration but the update tool uses a different one. **Workaround:**

1. Create a **new page** with the updated content using `MCP_DOCKER_notion-create-pages`
2. Log the new page URL
3. If the old page is findable via `notion-search`, add a comment pointing to the new page
4. **Do not attempt to delete the old page** — just let it exist as an earlier version

### Content Update Patterns

**Adding screenshots inventory:**
```markdown
## Presentation Screenshots

| # | File | Description |
|---|------|-------------|
| 1 | `01-brand-overview.png` | Hero section with archetype and promise |
| 2 | `02-logo-chooser.png` | Interactive logo selection cards |
| 3 | `03-color-system.png` | Color tokens, WCAG table, dark mode |
| 4 | `04-typography.png` | Font specimens and type scale |
| 5 | `05-applications.png` | Touchpoint mockups across media |
```

**Adding server link:**
```markdown
## Live Presentation

🌐 **View live:** `http://localhost:8080/brand-overview.html`

Pages:
- Brand Overview: `/brand-overview.html`
- Logo Chooser: `/logo-chooser.html`
- Color System: `/color-system.html`
- Typography: `/typography.html`
- Applications: `/applications.html`
```

---

## Notion Markdown Reference

Key syntax differences from standard Markdown:

| Element | Standard Markdown | Notion Markdown |
|---------|-----------------|-----------------|
| Page link | `[text](url)` | Use mention object or native link |
| Table | Standard GFM tables | Supported — use `|` pipes |
| Toggle | Not standard | `<details><summary>Title</summary>Content</details>` |
| Callout | Not standard | `{color="blue"}` attribute on heading |
| Image | `![alt](url)` | Supported with external URLs |
| Code block | Triple backticks | Supported |
| Column | Not standard | Not supported via markdown — use API blocks |

### Tips for Best Results

1. **Use tables for structured data** — Colors, typography, WCAG, logo directions all work better as tables
2. **Avoid complex formatting** — Notion Markdown doesn't support all HTML
3. **Keep paragraphs under 2000 chars** — Notion rich text objects have a 2000 character limit per block
4. **Use bullet lists for attributes** — Logo style/mood attributes render well as bullets
5. **External image URLs must be accessible** — Notion fetches images server-side

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| 401 Unauthorized | Invalid API token in raw API tools | Use `notion-create-pages` instead of `API-post-page` |
| `object_not_found` on update | Integration mismatch (page created by different integration) | Create new page as workaround |
| Table not rendering | Malformed Markdown table | Ensure header row + separator row (`|---|`) exist |
| Content truncated | Rich text 2000-char limit | Split long paragraphs into separate blocks |
| Page not found by search | Notion search index delay | Wait 30s and retry, or use page ID directly via `fetch` |
| Images not loading | Image URL not publicly accessible | Use public URLs; localhost links won't work |

---

## Output

After successful publishing:
1. **Notion page URL** — shared with client for review
2. **URL recorded** in `clients/{client-slug}/presentation-artifacts/notion-page-url.txt`
3. **Event logged** to PostgreSQL `events` table with `agent_id = 'openagent'` and page URL