---
name: "source-command-dashboard"
description: "Open, read, and update the Team Durham Dashboard in Notion"
---

# source-command-dashboard

Use this skill when the user asks to run the migrated source command `dashboard`.

## Command Template

# Team Durham Dashboard

The central command center for all brand production operations. Use this skill to read the dashboard, check active projects and tasks, and update it.

**Dashboard URL**: https://www.notion.so/7e32227adb984542ba5e7b494e951232

---

## Dashboard Structure

```
Team Durham Dashboard
├── Nav: Home | Projects | Tasks | Recent
├── Left Column
│   ├── Quick Action (button)
│   ├── Navigation (Skills, Plugins, Prompts, Frameworks)
│   ├── Operations (Github Repos, Youtube Videos)
│   └── Backend (Databases)
└── Right Column
    ├── In Progress
    ├── Current Tasks
    └── Quick Buttons (4)
```

---

## Reading the Dashboard

### Load current state

```javascript
mcp__MCP_DOCKER__notion-fetch({
  id: "https://www.notion.so/7e32227adb984542ba5e7b494e951232"
})
```

### Check active projects

```javascript
mcp__MCP_DOCKER__notion-fetch({
  id: "https://www.notion.so/9971d9be65b3825c9d1f81219a20e443"
})
```

### Check current tasks

```javascript
mcp__MCP_DOCKER__notion-fetch({
  id: "https://www.notion.so/e961d9be65b3839b8fd881a03513ebe8"
})
```

---

## Maintaining the Dashboard

- **Skills page** — add a new entry whenever a skill is created
- **Projects database** — one entry per active project; update status as work progresses
- **Tasks database** — keep in sync with project state
- **Prompts page** — add any reusable prompts discovered during sessions
- **Frameworks page** — document any new brand patterns adopted

## Never Do This

- Do not edit dashboard structure without user confirmation
- Do not delete entries — mark as archived/done instead
- Do not create duplicate entries — search first
