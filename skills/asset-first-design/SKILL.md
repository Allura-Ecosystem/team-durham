---
name: asset-first-design
description: Import and measure actual brand assets before creating Figma components. Fixes the Team Durham failure where text placeholders were used instead of real logos. Searches Brain first, measures geometry, logs specs, then builds.
---

# Asset-First Design Skill

> **Principle:** Real assets before systems. Measurement before construction.
>
> Fixes: Team Durham created text "allura" placeholders because they couldn't import PNGs. This skill ensures actual logo droplets are measured, specced, and logged to Brain before any Figma work begins.

## When to Use

- **Logo componentization** — Before creating Figma logo components
- **Asset audit** — Verify brand assets exist and are usable
- **Measurement capture** — Document geometry for scaling/proportion rules
- **Figma prep** — Ensure assets are ready before design system build

## Workflow

```
Search Brain → Verify Assets → Measure Geometry → Log Specs → Figma Ready
```

## Commands

### `/skill asset-first-design`
**Interactive mode** — guides through asset discovery and measurement

### `/skill asset-first-design --client <slug>`
**Client mode** — automatically checks client's asset directory

## Process

### Step 1: Brain Search
Search for existing asset records:
```javascript
memory_search({
  query: "logo assets measurement geometry",
  group_id: "allura-team-durham",
  user_id: "glaser"
})
```

### Step 2: Asset Discovery
If Brain has no asset records, discover from filesystem:
- Check `clients/<slug>/assets/logos/`
- List all logo files (PNG, SVG, AI, EPS)
- Verify file integrity

### Step 3: Measurement (Jony Ive Method)
For each logo asset:
- **Droplet radius** — curve measurement at 100% scale (e.g., 12px)
- **X-height** — lowercase letter height (e.g., 28px)
- **Inter-letter spacing** — kerning values (e.g., 4px)
- **Stroke weight** — outline thickness (e.g., 2px)
- **Sweep angle** — unique curve characteristics (e.g., 15° upward)

### Step 4: Brain Log
Record measurements for future reference:
```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "glaser",
  content: "Asset measurement: Logo droplet radius=12px, x-height=28px, kerning=4px, stroke=2px, sweep=15°. File: allura-logo-primary.png",
  metadata: {
    client: "<slug>",
    asset_type: "logo",
    measurements: {
      droplet_radius_px: 12,
      x_height_px: 28,
      kerning_px: 4,
      stroke_weight_px: 2,
      sweep_angle_deg: 15
    },
    source_file: "allura-logo-primary.png"
  }
})
```

### Step 5: Figma Componentization
Only after assets are measured and logged:
- Import measured assets to Figma
- Create component variants (color, mono, reverse)
- Apply geometry specs for responsive scaling
- Set up instance swap properties

## Example: Allura Memory Logos

**Assets Found:**
- `allura-logo-primary.png` — Full color, transparent background
- `allura-logo-mono-dark.png` — Single color, dark
- `allura-logo-mono-light.png` — Single color, light
- `allura-icon-droplet.png` — Icon only, 32×32px
- `allura-wordmark.png` — Text only, no droplet

**Measurements Logged:**
```json
{
  "droplet_radius": "12px at 100%",
  "x_height": "28px",
  "inter_letter_spacing": "4px custom (not font default)",
  "stroke_weight": "2px",
  "a_character_sweep": "15° upward",
  "scaling_formula": "proportional (radius * scale_factor)"
}
```

**Figma Components Created:**
- `Logo/Full/Color` — Primary with specs applied
- `Logo/Full/Mono-Dark` — Measured proportions preserved
- `Logo/Full/Mono-Light` — Measured proportions preserved
- `Logo/Icon/32px` — Droplet with 15° sweep maintained
- `Logo/Wordmark` — Kerning locked at 4px

## Invariants

1. **Never create text placeholders** — Always use actual measured assets
2. **Log before building** — Brain record must exist before Figma component
3. **Measure at 100%** — All specs relative to base scale
4. **Preserve craft** — The 15° sweep is warmth; never approximate

## Integration with Party Mode

When `/party` dispatches Glaser for logo work:
1. Pre-hook: Search Brain for asset measurements
2. If missing: Run asset-first-design discovery
3. Post-hook: Log completion with file_key

## Success Criteria

- ✅ All logo assets discovered and validated
- ✅ Geometry measured and logged to Brain
- ✅ Figma components use actual assets, not placeholders
- ✅ Responsive scaling preserves proportions
- ✅ QA: 100% asset integrity (vs Team Durham's 0%)
