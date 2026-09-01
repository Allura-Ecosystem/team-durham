# Allura Memory Round 4: Ideogram V3 Execution Reference

## Quick Start

```bash
cd /path/to/your/project

# Install fal client (if not already installed)
npm install @fal-ai/client

# Set your API key
export FAL_KEY="your-api-key-here"

# Run the executor
node .opencode/skills/fal-ideogram-executor/scripts/execute-round4.js
```

## What's in This Round

**Strategy**: Sage60/Lover25/Ruler15 (Tuned April 15)
**Model**: fal-ai/ideogram/v3
**Focus**: Logos + Branded Applications with Lover archetype

### Key Differences from Rounds 1-3:

| Aspect | Before | After (Round 4) |
|--------|--------|-----------------|
| Archetype | Sage70/Ruler30 | **Sage60/Lover25/Ruler15** |
| Temperature | Clinical, precise | **Warm, magnetic, sensory** |
| Key Concept | Structure | **Structure + Grace** |
| Magic | None (avoided) | **"Thin magic" — craft bordering on enchanting** |
| Curves | Sharp geometric | **Softened corners, graceful arcs** |
| Feel | "Inspectable" | **"Invites inspection"** |

### The 8 Prompts

1. **Logo Primary Horizontal** — Trace Frame with softened corners
2. **Logo Compact Variant** — Minimal wordmark, architectural grace
3. **Logo Mark-Only Icon** — Simplified frame, refined proportions
4. **Business Card Mockup** — Restrained elegance, magnetic presence
5. **Website Hero Header** — Infrastructure software with warmth
6. **Social Media Assets** — Profile/banner with graceful proportions
7. **Presentation Template** — Teachable, controlled, thin magic
8. **Pattern Library** — Modular cards with Lover's touch

## Execution Notes

### Style Presets Used:
- **MINIMAL_ILLUSTRATION** — Clean brand assets (4 prompts)
- **GEO_MINIMALIST** — Geometric precision (2 prompts)
- **EDITORIAL** — Premium presentation (2 prompts)

### Rendering Speed:
- **QUALITY** — Best output for final review
- Switch to **BALANCED** for faster exploration

### Expected Output:
- 8 generated images
- Metadata JSON files for each
- All saved to `clients/allura-memory/generated-images/round4/`

## Review Criteria

When evaluating outputs, look for:

✅ **Sage (60%)**: Clear structure, visible logic, inspectable
✅ **Lover (25%)**: Softened corners, graceful curves, warmth
✅ **Ruler (15%)**: Containment, boundaries, governance
✅ **Thin Magic**: Does it make you lean in? Is the craft so refined it borders on enchanting?

### What to Avoid:

❌ Princess-soft femininity
❌ Pastel-washed softness
❌ Seduction as manipulation
❌ Icy/clinical coldness
❌ Decorative ornamentation
❌ Cyberpunk/tech tropes

## Post-Generation Workflow

1. **Download** images from generated URLs
2. **Review** against strategy criteria
3. **Flag** best Lover archetype embodiments
4. **Note** any "thin magic" moments
5. **Shortlist** top 3-5 for client presentation
6. **Log** results to PostgreSQL events table

## Files

- Prompts: `clients/allura-memory/04_visual-director_round4-ideogram-prompts.md`
- Executor: `.opencode/skills/fal-ideogram-executor/scripts/execute-round4.js`
- Skill: `.opencode/skills/fal-ideogram-executor/SKILL.md`

---

**Ready to execute?** Set your FAL_KEY and run the script. The prompts are optimized for Ideogram V3's typography handling and logo capabilities while fully embodying the tuned feminine/enticing strategy.
