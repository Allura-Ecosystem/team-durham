---
name: skill-creator
description: Create and maintain OpenCode skills with structured templates, reusable assets, and MCP-aware guidance.
---

# Skill Creator

Use this skill to build effective OpenCode skills.

## Skill anatomy

```
skill-name/
├── SKILL.md   (metadata + instructions)
├── scripts/   (optional automation)
├── references/(optional docs)
└── assets/    (optional templates/files)
```

## Creation process

1. **Understand usage**
   - Ask for concrete examples if unclear.
   - Define what triggers this skill.

2. **Plan reusable contents**
   - Identify scripts needed repeatedly.
   - Decide which references or assets belong outside SKILL.md.

3. **Initialize**
   - Run: `scripts/init_skill.py <name> --path <output-dir>`
   - Removes boilerplate once customized.

4. **Edit SKILL.md**
   - Use imperative/instructional tone (“Do X”).
   - Answer: Purpose, when to use, how to execute.
   - Reference bundled resources.

5. **Package**
   - `scripts/package_skill.py path/to/skill [./dist]`
   - Passes validation, produces distributable zip.

6. **Iterate**
   - After real usage, update SKILL.md/scripts/references.

## Progressive disclosure

1. Metadata (always in prompt)
2. SKILL.md body (on trigger)
3. Scripts/references/assets (loaded on demand)

## MCP discovery support

- Use `mcp_find` to locate new servers.
- Configure credentials with `mcp_config_set`.
- Add server via `mcp_add` and run validation commands before describing capabilities.

### Example MCP workflow

```text
mcp_find("neo4j", limit=5)
mcp_config_set(server="neo4j", config={...})
mcp_add(name="neo4j", activate=true)
mcp_exec(...)
```

## Templates

- Imperative instructions.
- Mention when to load references.
- Document verification steps.

## References
- See `references/` for starter templates and checklists (add as needed).
