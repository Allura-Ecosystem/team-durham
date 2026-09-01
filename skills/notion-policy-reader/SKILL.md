---
name: notion-policy-reader
description: >
  Read policy documents from Notion at boot and write brand deliverables to Notion pages.
  Use when (1) agents need to load policy/guidelines from Notion at startup,
  (2) writing deliverables to Notion for client review,
  (3) searching for existing policy pages,
  (4) updating Notion pages with new content.
  Handles the Notion MCP integration with proper error handling.
---

# Notion Policy Reader

> **Executor:** Any Team Durham agent
> **Type:** Policy Loading & Publishing
> **Prerequisite:** NOTION_API_TOKEN configured via MCP Docker
> **group_id:** `allura-team-durham`

---

## Purpose

Notion serves as the external policy repository and client delivery interface for Team Durham. This skill enables agents to:

1. **Read policy documents** from Notion at boot (brand guidelines, project specs, client requirements)
2. **Write deliverables** to Notion pages for client review
3. **Search and discover** existing pages and databases
4. **Handle errors gracefully** with fallback patterns

---

## Tool Reference

### Core Notion MCP Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `notion_read_page` | Read page content by ID or URL | Loading policy docs, reading existing deliverables |
| `notion_search` | Search pages and databases | Finding policy docs, discovering client pages |
| `notion_create_page` | Create new pages | Publishing deliverables, creating policy pages |
| `notion_update_page` | Update existing pages | Appending content, modifying properties |

---

## Reading Policy Documents

### At-Boot Policy Loading Pattern

Agents should load policy documents at startup to ground their work in current guidelines:

```
# Step 1: Search for policy documents
notion_search({
  query: "Brand Guidelines OR Policy OR Standards",
  filter: { property: "object", value: "page" }
})

# Step 2: Read the relevant policy page
notion_read_page({
  page_id: "[page-id-from-search]"
})

# Step 3: Cache policy content for session
# Store in agent context or session memory
```

### Example: Loading Brand Guidelines

```
# Search for brand guidelines
notion_search({ query: "Brand Guidelines" })

# Read the guidelines page
notion_read_page({ page_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" })

# Parse and apply constraints
# - Color palette restrictions
# - Typography rules
# - Voice and tone guidelines
```

### Example: Loading Project Specifications

```
# Search for project-specific docs
notion_search({
  query: "Project Brief client-name",
  filter: { property: "object", value: "page" }
})

# Read the brief
notion_read_page({ page_id: "[brief-page-id]" })
```

---

## Writing Deliverables to Notion

### Creating a Brand Deliverable Page

```
notion_create_page({
  parent: {
    type: "page_id",
    page_id: "[client-parent-page-id]"
    // OR use: { type: "workspace" } for root-level pages
  },
  title: "[BRAND NAME] — Strategy Pack",
  content: `
# Strategy Pack

## Brand Archetype
[Content from deliverable]

## Positioning Statement
[Content from deliverable]

## Target Audience
[Content from deliverable]

## Competitive Differentiation
[Content from deliverable]
  `,
  icon: "🎯",
  properties: {
    "Status": { select: { name: "Draft" } },
    "Phase": { select: { name: "Strategy" } },
    "Agent": { select: { name: "Aaker" } }
  }
})
```

### Updating an Existing Page

```
notion_update_page({
  page_id: "[existing-page-id]",
  content: `
## Updated Section

New content appended here...
  `,
  append: true  // Append rather than replace
})
```

---

## Error Handling Patterns

### Pattern 1: Token Not Configured

```
Error: NOTION_API_TOKEN not set

Resolution:
1. Check if Notion MCP is configured
2. If not configured, inform user:
   "Notion integration requires NOTION_API_TOKEN.
    Please configure via MCP Docker: MCP_DOCKER_mcp-config-set --server notion --config '{"internal_integration_token": "your-token"}'"
3. Fall back to local file reading
```

### Pattern 2: Page Not Found

```
Error: object_not_found

Resolution:
1. Verify page_id is correct
2. Check if page has been moved or deleted
3. Search for the page by title:
   notion_search({ query: "[page-title]" })
4. If found, use the new page_id
5. If not found, create a new page
```

### Pattern 3: Permission Denied

```
Error: insufficient_permissions

Resolution:
1. Verify the integration token has access to the workspace
2. Check if the page is in a private workspace
3. Request user to share the page with the integration
4. Fall back to local file operations
```

### Pattern 4: Rate Limiting

```
Error: rate_limited

Resolution:
1. Implement exponential backoff
2. Wait 5-10 seconds before retry
3. Log the rate limit event
4. Consider batching operations
```

---

## Integration with Team Durham Pipeline

### Phase 0: Intent Gate (Kotler)

```
# Load client brief from Notion
notion_search({ query: "Client Brief [brand-name]" })
notion_read_page({ page_id: "[brief-page-id]" })

# Validate brief completeness
# Proceed to Phase 1
```

### Phase 1: Strategy (Aaker)

```
# Write Strategy Pack to Notion
notion_create_page({
  parent: { type: "page_id", page_id: "[client-folder-id]" },
  title: "01 Strategy Pack",
  content: "[Strategy Pack content]",
  icon: "🎯"
})
```

### Phase 2: Naming (Aaker + Ogilvy)

```
# Write Naming Pack to Notion
notion_create_page({
  parent: { type: "page_id", page_id: "[client-folder-id]" },
  title: "02 Naming Pack",
  content: "[Naming Pack content]",
  icon: "🏷️"
})
```

### Phase 3: Visual Direction (Glaser)

```
# Write Logo Pack to Notion
notion_create_page({
  parent: { type: "page_id", page_id: "[client-folder-id]" },
  title: "03 Logo Pack",
  content: "[Logo Pack content with image URLs]",
  icon: "🎨"
})
```

### Phase 4: Brand Kit (Rand)

```
# Write Brand Kit to Notion
notion_create_page({
  parent: { type: "page_id", page_id: "[client-folder-id]" },
  title: "04 Brand Kit",
  content: "[10-section Brand Kit content]",
  icon: "📚"
})
```

### Phase 5: QA (Munari)

```
# Write QA Report to Notion
notion_create_page({
  parent: { type: "page_id", page_id: "[client-folder-id]" },
  title: "05 QA Report",
  content: "[QA findings and recommendations]",
  icon: "✅"
})
```

---

## Content Formatting Guidelines

### Notion-Compatible Markdown

Notion supports a subset of Markdown:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet list item
- Another item
  - Nested item

1. Numbered list
2. Second item

[Link text](https://example.com)

| Table | Column |
|-------|--------|
| Data  | Value  |

> Blockquote

`inline code`

```
code block
```
```

### Image Handling

Notion does not support embedded binary images via MCP. Use image URLs instead:

```markdown
![Alt text](https://your-cdn.com/image.png)
```

For brand assets, upload to a CDN or image hosting service first, then reference by URL.

---

## Configuration Requirements

### Required Environment Variable

```bash
# Set via MCP Docker configuration
NOTION_API_TOKEN=secret_your_integration_token_here
```

### Obtaining a Notion Integration Token

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Team Durham Brand Harness"
4. Copy the "Internal Integration Token"
5. Share relevant pages/databases with the integration

### Workspace Permissions

The integration must be added to:
- Policy/guideline pages (read access)
- Client project pages (write access)
- Any databases used for tracking

---

## Fallback Strategy

If Notion MCP is unavailable:

1. **Read operations:** Fall back to local files in `clients/{brand}/`
2. **Write operations:** Save to local files and notify user
3. **Log the failure** to Allura Brain events table
4. **Retry on next session** when Notion is available

---

## Quick Reference

### Common Queries

| Task | Query |
|------|-------|
| Find brand guidelines | `notion_search({ query: "Brand Guidelines" })` |
| Find client brief | `notion_search({ query: "Brief [client-name]" })` |
| Find policy docs | `notion_search({ query: "Policy OR Standards" })` |
| Read page by ID | `notion_read_page({ page_id: "uuid-here" })` |
| Create deliverable | `notion_create_page({ parent, title, content })` |
| Update page | `notion_update_page({ page_id, content, append: true })` |

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `object_not_found` | Page doesn't exist or no access | Search and verify |
| `insufficient_permissions` | Token lacks access | Check workspace sharing |
| `rate_limited` | Too many requests | Backoff and retry |
| `validation_error` | Invalid content format | Check Markdown syntax |

---

## Related Skills

- `notion-brand-publisher` — Specialized skill for brand presentation publishing
- `mcp-docker` — For configuring the Notion MCP server
- `client-brief-intake` — Phase 0 policy loading patterns
