---
name: "source-command-dashboard"
description: "Open, read, and update the Ronin Vibe Coding Dashboard in Notion"
---

# source-command-dashboard

Use this skill when the user asks to run the migrated source command `dashboard`.

## Command Template

# Ronin Vibe Coding Dashboard

The central command center for all vibe coding operations. Use this skill to read the dashboard, check active projects and tasks, and update it.

**Dashboard URL**: https://www.notion.so/e821d9be65b383e78b6501774b312c6c

---

## Dashboard Structure

```
Ronin Vibe Coding Dashboard
├── Nav: Home | Projects | Tasks | Recent
├── Left Column
│   ├── Quick Action (button)
│   ├── Navigation
│   │   ├── Skills       → notion.so/e8c1d9be65b3831193f40194a2e83357
│   │   ├── Plugins      → notion.so/63f1d9be65b3828990ec01a19e418f08
│   │   ├── Prompts      → notion.so/6571d9be65b38392a23d81f83929c2ad
│   │   └── Frameworks   → notion.so/ad71d9be65b38233954a01a1ab38afb2
│   ├── Operations
│   │   ├── Github Repos → notion.so/95a1d9be65b3834ca840010feb76ff77
│   │   └── Youtube Videos → notion.so/beb1d9be65b3828b81be011ceebf63ff
│   ├── Backend
│   │   └── Databases    → notion.so/5291d9be65b38282b330012584eb2b70
│   └── Help Center
│       ├── Watch Tutorials → YouTube
│       └── Ask a Question  → Fillout form
└── Right Column
    ├── In Progress      → notion.so/9971d9be65b3825c9d1f81219a20e443
    ├── Current Tasks    → notion.so/e961d9be65b3839b8fd881a03513ebe8
    └── Quick Buttons (4)
```

---

## Reading the Dashboard

### Load current state

```javascript
mcp__claude_ai_Notion__notion-fetch({
  id: "https://www.notion.so/e821d9be65b383e78b6501774b312c6c"
})
```

### Check active projects

```javascript
mcp__claude_ai_Notion__notion-fetch({
  id: "https://www.notion.so/9971d9be65b3825c9d1f81219a20e443"
})
```

### Check current tasks

```javascript
mcp__claude_ai_Notion__notion-fetch({
  id: "https://www.notion.so/e961d9be65b3839b8fd881a03513ebe8"
})
```

---

## Navigating Key Sections

| What you need | Page to fetch |
|---|---|
| Skills library | `notion.so/e8c1d9be65b3831193f40194a2e83357` |
| Plugins list | `notion.so/63f1d9be65b3828990ec01a19e418f08` |
| Prompts | `notion.so/6571d9be65b38392a23d81f83929c2ad` |
| Frameworks | `notion.so/ad71d9be65b38233954a01a1ab38afb2` |
| GitHub repos | `notion.so/95a1d9be65b3834ca840010feb76ff77` |
| Databases | `notion.so/5291d9be65b38282b330012584eb2b70` |

---

## Maintaining the Dashboard

### Add a new skill to the Skills page

```javascript
mcp__claude_ai_Notion__notion-create-pages({
  parent: { page_id: "e8c1d9be65b3831193f40194a2e83357" },
  properties: {
    title: [{ text: { content: "Skill Name" } }]
  },
  children: [
    // skill content blocks
  ]
})
```

### Update a task status

```javascript
mcp__claude_ai_Notion__notion-update-page({
  id: "<task-page-id>",
  properties: {
    Status: { select: { name: "Done" } }
  }
})
```

### Search within the dashboard

```javascript
mcp__claude_ai_Notion__notion-search({
  query: "your search term"
})
```

---

## Maintenance Rules

- **Skills page** — add a new entry whenever a Codex or OpenCode skill is created in this repo
- **Projects database** — one entry per active project; update status as work progresses
- **Tasks database** — mirrors the repo's `.tmp/tasks/` — keep them in sync
- **Prompts page** — add any reusable prompts discovered during sessions
- **Frameworks page** — document any new architectural patterns adopted

---

## Never Do This

- Do not edit dashboard structure (columns, nav) without user confirmation
- Do not delete entries — mark as archived/done instead
- Do not create duplicate skill or project entries — search first
