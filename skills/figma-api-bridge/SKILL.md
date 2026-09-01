---
name: figma-api-bridge
description: "Bridge Figma REST and plugin APIs for design automation."
---

# Figma API Bridge — Brand Kit Export Skill

> **Executor:** @Rand (Brand Kit Builder) or any Team Durham agent
> **Type:** Figma File Creation + Design Token Export
> **Prerequisites:** Approved `04_brand-kit-builder_brand-kit.md`
> **group_id:** `allura-team-durham`

---

## Purpose

Transform the approved Brand Kit into a living Figma design system. This skill bridges the gap between static brand documentation and interactive design assets that designers can actually use.

**What it does:**
1. Reads the Brand Kit markdown file
2. Creates a new Figma file via API
3. Sets up Variables/tokens (colors, typography, spacing)
4. Creates component library (logos, color swatches, type specimens)
5. Exports file URL for client delivery

---

## Core Principle

**The Figma file IS the brand kit.**

Every specification in the Brand Kit must exist as a usable design token or component in Figma. If it's not in the Figma file, it doesn't exist for designers.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  INPUT: Brand Kit (04_brand-kit-builder_brand-kit.md)       │
│  ├── Section 1: Brand Overview                              │
│  ├── Section 3: Logo System                                   │
│  ├── Section 4: Color Palette                                 │
│  ├── Section 5: Typography                                    │
│  └── Section 6: Voice & Messaging                           │
└────────────────────┬──────────────────────────────────────┘
                     │ parse
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  BRAND KIT PARSER (create-brand-file.js)                    │
│  Extracts: colors, typography, logos, spacing values          │
│  Validates: All 4 color formats present, type scales valid  │
└────────────────────┬──────────────────────────────────────┘
                     │ creates
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  FIGMA FILE CREATION                                        │
│  ├── Create new file via figma_create_new_file              │
│  ├── Set up page structure                                  │
│  └── Return fileKey for subsequent operations               │
└────────────────────┬──────────────────────────────────────┘
                     │ populates
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  DESIGN TOKENS (export-tokens.js)                           │
│  ├── Color Variables (HEX/RGB/CMYK/Pantone)               │
│  ├── Typography Styles (font families, sizes, weights)      │
│  ├── Spacing Variables (margins, padding, gaps)             │
│  └── Effect Styles (shadows from editorial-system)            │
└────────────────────┬──────────────────────────────────────┘
                     │ builds
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPONENT LIBRARY                                            │
│  ├── Logo Components (primary, horizontal, icon-only)         │
│  ├── Color Swatches (visual reference + variable binding)     │
│  ├── Type Specimens (all heading/body styles)                 │
│  └── Layout Grids (spacing examples)                          │
└────────────────────┬──────────────────────────────────────┘
                     │ exports
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  OUTPUT: Figma File URL                                     │
│  ├── File URL for sharing                                     │
│  ├── Component library ready for use                        │
│  └── Design tokens consumable by other files                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5-Step Workflow

### Step 1: Parse Brand Kit

**Tool:** `create-brand-file.js`

Read and validate the Brand Kit markdown:

```javascript
const brandKit = await parseBrandKit('clients/{brand}/04_brand-kit-builder_brand-kit.md');

// Validation checks:
// - Section 4: All colors have HEX, RGB, CMYK, Pantone
// - Section 5: Typography has primary/secondary fonts
// - Section 3: Logo files exist in generated-images/
// - Section 1: Brand name and promise defined
```

**Exit criteria:** Brand Kit parsed, all required sections present, no validation errors.

---

### Step 2: Create Figma File

**Tool:** `figma_create_new_file`

Create a new Figma design file:

```javascript
const { fileKey, fileUrl } = await figmaCreateNewFile({
  fileName: `${brandKit.brandName} — Brand Kit`,
  editorType: 'design'
});
```

**Page structure created:**
1. **Cover** — Brand name, version, status
2. **Getting Started** — How to use this file
3. **Colors** — Color variables + swatches
4. **Typography** — Type styles + specimens
5. **Logos** — Logo components + usage rules
6. **Spacing** — Spacing tokens + examples
7. **Components** — Reusable brand components

---

### Step 3: Create Design Tokens

**Tool:** `export-tokens.js` + `figma_use_figma`

Create Figma Variables for all brand specifications:

#### Color Variables

```javascript
// Primitive colors (raw values)
const colorPrimitives = await createColorPrimitives({
  'color/primary/500': '#FFC300',
  'color/secondary/500': '#0581A7',
  'color/accent/500': '#BDBD0D',
  'color/neutral/900': '#142329',
  'color/neutral/0': '#F5F5F5'
});

// Semantic colors (alias to primitives)
const colorSemantic = await createColorSemantic({
  'color/brand/primary': 'color/primary/500',
  'color/brand/secondary': 'color/secondary/500',
  'color/text/primary': 'color/neutral/900',
  'color/text/inverse': 'color/neutral/0',
  'color/background/default': 'color/neutral/0'
});
```

**Scopes:**
- Background colors: `["FRAME_FILL", "SHAPE_FILL"]`
- Text colors: `["TEXT_FILL"]`
- Border colors: `["STROKE_COLOR"]`

#### Typography Styles

```javascript
const textStyles = await createTextStyles({
  'heading/h1': { fontFamily: 'Outfit', fontSize: 48, fontWeight: 700 },
  'heading/h2': { fontFamily: 'Outfit', fontSize: 36, fontWeight: 600 },
  'body/large': { fontFamily: 'Inter', fontSize: 18, fontWeight: 400 },
  'body/default': { fontFamily: 'Inter', fontSize: 16, fontWeight: 400 }
});
```

#### Spacing Variables

```javascript
const spacingVars = await createSpacingVariables({
  'spacing/xs': 4,
  'spacing/sm': 8,
  'spacing/md': 16,
  'spacing/lg': 24,
  'spacing/xl': 48,
  'spacing/2xl': 64
});
```

**Scopes:**
- Gap: `["GAP"]`
- Padding: `["WIDTH", "HEIGHT", "PADDING_LEFT", "PADDING_RIGHT", "PADDING_TOP", "PADDING_BOTTOM"]`
- Radius: `["CORNER_RADIUS"]`

---

### Step 4: Build Component Library

**Tool:** `figma_use_figma`

Create reusable components from Brand Kit assets:

#### Logo Components

```javascript
// Primary logo component
const primaryLogo = await createLogoComponent({
  name: 'Logo/Primary',
  sourceFile: 'generated-images/logo-primary.png',
  variants: ['default', 'dark-bg', 'monochrome']
});

// Horizontal logo variant
const horizontalLogo = await createLogoComponent({
  name: 'Logo/Horizontal',
  sourceFile: 'generated-images/logo-horizontal.png'
});

// Icon-only variant
const iconLogo = await createLogoComponent({
  name: 'Logo/Icon',
  sourceFile: 'generated-images/logo-icon.png'
});
```

#### Color Swatch Components

```javascript
// Create color swatch component with variable binding
const colorSwatch = await createColorSwatchComponent({
  name: 'Color Swatch',
  colors: colorPrimitives,
  showValues: true // Display HEX/RGB/CMYK/Pantone
});
```

#### Type Specimen Components

```javascript
// Create type specimen showing all styles
const typeSpecimen = await createTypeSpecimenComponent({
  name: 'Type Specimen',
  styles: textStyles,
  sampleText: 'The quick brown fox jumps over the lazy dog.'
});
```

---

### Step 5: Export and Deliver

**Output:**

```markdown
# Figma Brand Kit Export Complete

**Brand:** [Brand Name]
**File URL:** https://figma.com/design/[fileKey]/[fileName]
**Status:** ✅ Ready for client delivery

## What's Included

### Design Tokens (Variables)
- **Colors:** [N] primitive colors, [N] semantic aliases
- **Typography:** [N] text styles
- **Spacing:** [N] spacing tokens

### Components
- **Logos:** Primary, Horizontal, Icon-only variants
- **Color Swatches:** Visual reference with values
- **Type Specimens:** All heading and body styles

### Pages
1. Cover — Brand overview
2. Getting Started — Usage instructions
3. Colors — Color system
4. Typography — Type system
5. Logos — Logo system
6. Spacing — Spacing system
7. Components — Reusable components

## Next Steps

1. Share file URL with client
2. Client can duplicate to their workspace
3. Designers can use tokens in their files
4. Link to brand kit documentation
```

---

## Tool Reference

### MCP Tools Used

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `figma_create_new_file` | Create new Figma file | Step 2 — File creation |
| `figma_use_figma` | Execute Plugin API code | Steps 3-4 — Token/component creation |
| `figma_search_design_system` | Find existing components | Step 4 — Check for reusable assets |
| `figma_get_metadata` | Validate file structure | After each major step |
| `figma_get_screenshot` | Visual validation | After component creation |

### Helper Scripts

| Script | Purpose | Location |
|--------|---------|----------|
| `create-brand-file.js` | Parse Brand Kit + create Figma file | `.claude/skills/figma-api-bridge/` |
| `export-tokens.js` | Create design tokens in Figma | `.claude/skills/figma-api-bridge/` |

---

## Color Format Handling

The Brand Kit specifies colors in 4 formats. In Figma Variables:

| Format | Figma Support | Implementation |
|--------|---------------|----------------|
| HEX | ✅ Native | Store as RGB, display HEX |
| RGB | ✅ Native | Primary variable format |
| CMYK | ❌ Not native | Store in variable description |
| Pantone | ❌ Not native | Store in variable description |

**Best practice:** Create RGB variables as primary, add CMYK/Pantone values to variable descriptions for reference.

---

## Validation Checklist

Before marking export as complete:

- [ ] All Brand Kit sections parsed successfully
- [ ] Figma file created and accessible
- [ ] Color variables created (all 4 formats referenced)
- [ ] Typography styles created
- [ ] Spacing variables created
- [ ] Logo components created from actual files
- [ ] Color swatch components created
- [ ] Type specimens created
- [ ] File URL generated and tested
- [ ] Allura Brain event logged

---

## Allura Brain Integration

Log events at each step:

```javascript
// Step 1 complete
await logBrainEvent({
  agent_id: 'rand',
  event_type: 'BRAND_KIT_PARSED',
  group_id: 'allura-team-durham',
  payload: { brandName, sectionsParsed: 10 }
});

// Step 2 complete
await logBrainEvent({
  agent_id: 'rand',
  event_type: 'FIGMA_FILE_CREATED',
  group_id: 'allura-team-durham',
  payload: { fileKey, fileName }
});

// Step 5 complete
await logBrainEvent({
  agent_id: 'rand',
  event_type: 'BRAND_KIT_EXPORTED',
  group_id: 'allura-team-durham',
  payload: { fileKey, fileUrl, tokensCreated, componentsCreated }
});
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Brand Kit missing | File not found | Verify phase 4 complete |
| Color format incomplete | Missing CMYK/Pantone | Request from Glaser |
| Logo files missing | Images not generated | Run fal.ai generation first |
| Figma API error | Auth/connection | Check Figma MCP server |
| Variable creation fails | Invalid color values | Validate HEX format |

---

## Command Menu

| Code | Command | Description |
|------|---------|-------------|
| FE | Figma Export | Export Brand Kit to Figma |
| FP | File Parse | Parse Brand Kit markdown |
| FT | Token Export | Export design tokens only |
| FC | Component Build | Build component library |
| FV | Validate | Validate Figma export |
| CH | Chat | Open conversation |
| MH | Menu | Show this command menu |
| DA | Exit | Deactivate with session summary |

---

## Invariants

- `group_id = 'allura-team-durham'`
- `agent_id = 'rand'`
- NO export without approved Brand Kit
- Every color must have all 4 format values
- Logo components must reference actual image files
- File must be shareable before marking complete
- Reflection protocol on every command
