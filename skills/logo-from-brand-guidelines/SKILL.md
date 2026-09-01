---
name: logo-from-brand-guidelines
description: Extract real logo assets from supplied brand-guideline boards before building presentations, Figma/Penpot files, websites, or brand kits. Trigger when a user says “get the logo out of the brand guidelines,” “use the logo from the board,” “extract logo,” “crop logos,” “don’t use placeholder logo,” or when only PNG/JPG brand boards exist and Team Durham needs production-ready logo assets.
---

# Logo From Brand Guidelines

## Purpose

When a client provides a brand-guideline board as a PNG/JPG/PDF, use the actual visual logo from the board before creating any presentation, website mockup, Figma/Penpot system, or brand kit. Do not recreate the mark from text unless extraction fails.

This common workflow prevents placeholder-logo failures and keeps Team Durham asset-first.

## Trigger Conditions

Use this skill when:

- The client directory contains a brand board image (`brandg.png`, `brand-guidelines.png`, `logo-system.png`, etc.)
- The user asks to “get the logo out of the brand guidelines”
- A brand presentation needs logo cards but no SVG/PNG logo files exist
- The deliverable references “actual logo,” “real logo,” “not placeholder,” or “asset-first”

## Required Inputs

- Source guideline image path
- Client slug/path
- Output folder, usually:
  - `clients/{client}/extracted-logos/`
  - `clients/{client}/presentation-artifacts/assets/`

## Workflow

### 1. Inspect the board visually

Open the guideline image with vision. Identify:

- Primary logo lockup
- Reversed logo lockup
- Monogram/icon-only variant
- Favicon/app icon variant
- Monochrome variant
- Any tagline lockups

Record visible brand tokens from the same board:

- Color names + hex values
- Typography names and weights
- Logo variation labels
- Usage rules

### 2. Prefer extraction over recreation

Crop the actual logo areas from the source board using image tooling (`sharp` is preferred when available). Use transparent PNG when the source supports it; otherwise preserve board background and document that the crop is from a raster guideline source.

Suggested output names:

```text
extracted-logos/
├── primary-lockup.png
├── reverse-lockup.png
├── icon-only.png
├── favicon-preview.png
├── monochrome-lockup.png
└── wordmark.png
```

### 3. Validate outputs

Check:

- Crops are not empty
- Crops include complete mark/wordmark with no clipped edges
- File sizes are non-zero
- Primary, reverse, icon, and favicon variants are represented when visible

### 4. Use extracted assets in deliverables

When building HTML, Figma, Penpot, or brand kits:

- Reference extracted PNGs directly
- Do not substitute text-only “DD” placeholder marks if extracted assets exist
- If using a CSS recreation for decorative backgrounds, label it as decorative only

### 5. Log to Allura Brain

After extraction, log a memory with:

- Source board file
- Output files
- Brand tokens observed
- Any limitations (raster only, no transparent source, crop approximate)

## Output Note Template

```md
Logo extraction complete.

Source: {source_file}
Outputs:
- {output_file_1}
- {output_file_2}
- {output_file_3}

Observed tokens:
- Colors: ...
- Typography: ...
- Logo rules: ...

Limitations:
- Raster crop from brand board; request source SVG/AI/PDF for final production if needed.
```

## Common Pitfalls

- **Pitfall:** Rebuilding a logo from letters because it is faster.
  **Fix:** Crop the actual logo first; recreate only as a fallback.

- **Pitfall:** Using text color values from memory when the board shows different hex values.
  **Fix:** Vision-observed board tokens override stale memory.

- **Pitfall:** Cropping too tightly and clipping drop shadows or tagline.
  **Fix:** Add padding around the logo; create separate tight and padded variants if needed.
