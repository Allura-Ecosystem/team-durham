---
name: mcp-libre
description: "LibreOffice MCP integration — create, read, edit, and export LibreOffice documents (Writer, Calc, Impress, Draw) via the mcp-libre server. Trigger when generating brand documents, pitch decks, spreadsheets, or exporting to PDF/PPTX using LibreOffice."
globs: ["**/*.odt", "**/*.odp", "**/*.ods", "**/*.pptx", "**/*.docx", "**/*.xlsx"]
---

# MCP-Libre — LibreOffice MCP Integration

## Overview

This skill connects Codex to a running LibreOffice instance via the [mcp-libre](https://github.com/jwingnut/mcp-libre) MCP server. It enables direct creation, editing, and export of LibreOffice documents without manual intervention.

## Setup (One-Time)

### 1. Install mcp-libre

```bash
git clone https://github.com/jwingnut/mcp-libre.git ~/tools/mcp-libre
pip install fastmcp httpx
```

### 2. Add to Codex

```bash
Codex mcp add libreoffice -- fastmcp run ~/tools/mcp-libre/libreoffice_mcp_server.py
```

### 3. Add to OpenCode (`opencode.json`)

```json
"libreoffice": {
  "type": "local",
  "command": ["fastmcp", "run", "${MCP_LIBRE_ROOT}/libreoffice_mcp_server.py"],
  "enabled": true,
  "timeout": 60000
}
```

### 4. Install LibreOffice Extension (for live editing)

```bash
cd ~/tools/mcp-libre/plugin
./build.sh
unopkg add ../build/libreoffice-mcp-extension-1.0.0.oxt
```
Then in LibreOffice: **Tools > MCP Server > Start MCP Server** → runs on `localhost:8765`

---

## 9 MCP Tools

| Tool | Key Actions | Use For |
|------|-------------|---------|
| `document` | create, info, list, content | New Writer/Impress/Calc/Draw docs |
| `text` | insert, format | Add + style text |
| `structure` | outline, paragraph, range | Navigate document |
| `cursor` | goto_paragraph, position, context | Precise positioning |
| `selection` | paragraph, range, replace, delete | Select + edit regions |
| `search` | find, replace, replace_all | Find/replace content |
| `track_changes` | enable, disable, list, accept, reject | Revision management |
| `comments` | list, add | Annotations |
| `save` | save, export | Save or export to PDF/PPTX |

---

## Common Workflows

### Create a new Impress presentation

```
document(action="create", type="impress", filename="/path/to/deck.odp")
```

### Insert text at current cursor

```
text(action="insert", content="Faith Meats — Halal Distribution")
text(action="format", bold=true, font_size=36)
```

### Export to PDF

```
save(action="export", format="pdf", path="/path/to/output.pdf")
```

### Export to PowerPoint

```
save(action="export", format="pptx", path="/path/to/output.pptx")
```

### Find and replace across document

```
search(action="replace_all", query="old text", replacement="new text")
```

### Add a comment

```
comments(action="add", text="Review this section", author="Kotler")
```

---

## Brand Maker Usage

### Convert HTML slide deck → LibreOffice Impress

1. Create new Impress file
2. For each slide: insert content, apply brand formatting
3. Export as `.pptx` for client delivery

### Generate brand document (Writer)

1. `document(action="create", type="writer")`
2. Insert brand strategy sections via `text`
3. Apply heading styles, gold accents
4. `save(action="export", format="pdf")`

---

## HTTP API (when extension is running)

```bash
# Health check
curl http://localhost:8765/health

# Get open document info
curl -X POST http://localhost:8765/tools/get_document_info_live -d '{}'

# Find text
curl -X POST http://localhost:8765/tools/find_text_live \
  -H "Content-Type: application/json" \
  -d '{"query": "Faith Meats"}'
```

---

## Agent Permissions

| Agent | Allowed Actions |
|-------|----------------|
| Rand (Brand Kit Builder) | All — primary document producer |
| Kotler (Orchestrator) | create, save, export |
| Ogilvy (Copywriter) | text insert/format, search/replace |
| Munari (QA Reviewer) | document read, content, comments (read-only) |
| Scout | document info, content (read-only) |

---

## Cross-Reference

- **`brand-kit-10-section`** — Brand Kit assembly workflow (source content for docs)
- **`figma-implement-design`** — Design → code; mcp-libre handles design → document
- **`mcp-docker`** — For Docker-based MCP servers (mcp-libre is pip-based, not Docker)
- **`global-mcp-lookup`** — Full MCP registry
