---
name: editorial-system
description: Create layered shadow systems, editorial grids, and visual depth for sophisticated brand presentations. Replaces flat design with 3-layer editorial shadows (ambient + directional + contact).
---

# Editorial System Skill

> **Principle:** "Less but better" — Dieter Rams. Layered depth without decoration.
>
> Fixes: Team Durham v3.1 used flat, single-layer shadows. This skill creates editorial sophistication with 3-layer shadow systems.

## The Editorial Shadow System

### Philosophy

Editorial shadows create depth through **layered elevation**, not single drop shadows:

1. **Ambient Shadow** — Large, soft, low opacity (the room light)
2. **Directional Shadow** — Offset, sharper, medium opacity (the window light)
3. **Contact Shadow** — Small, tight, high opacity (the ground contact)

### Visual Effect

```
Single Layer (Flat)          3-Layer Editorial (Sophisticated)
        ↓                              ↓
    ┌─────┐                    ┌─────────────┐  ← Ambient (large, soft)
    │     │                    │  ┌─────┐    │
    │ BOX │                    │  │     │    │  ← Directional (offset)
    │     │                    │  │ BOX │    │
    └─────┘                    │  │     │    │
       ↓                       │  └─────┘    │
    Shadow                    │     ↓       │  ← Contact (tight)
                               └─────────────┘
```

## Shadow Specifications

### Base Configuration

```javascript
const editorialShadows = {
  // Layer 1: Ambient (always present, provides base depth)
  ambient: {
    x: 0,
    y: 4,
    blur: 20,
    spread: -4,
    opacity: 0.08,
    color: "#142329" // Dark Gray
  },

  // Layer 2: Directional (simulates light source)
  directional: {
    x: 0,
    y: 8,
    blur: 16,
    spread: -4,
    opacity: 0.12,
    color: "#142329"
  },

  // Layer 3: Contact (anchors to surface)
  contact: {
    x: 0,
    y: 2,
    blur: 4,
    spread: 0,
    opacity: 0.16,
    color: "#142329"
  }
};
```

### Elevation Levels

```javascript
const elevation = {
  // Level 0: Flat (no elevation)
  flat: [],

  // Level 1: Card (default card elevation)
  card: [ambient, directional],

  // Level 2: Hover (interactive hover state)
  hover: [
    { ...ambient, y: 8, blur: 30, opacity: 0.10 },
    { ...directional, y: 12, blur: 24, opacity: 0.14 },
    contact
  ],

  // Level 3: Modal/Overlay (highest elevation)
  modal: [
    { ...ambient, y: 20, blur: 60, opacity: 0.15 },
    { ...directional, y: 24, blur: 48, opacity: 0.18 },
    { ...contact, y: 4, blur: 8, opacity: 0.20 }
  ]
};
```

## Editorial Grid System

### Baseline Grid
```
4px base unit (matches spacing tokens)
│
├─ Text aligns to baseline
├─ Spacing uses multiples of 4
└─ Creates vertical rhythm
```

### Column Grid
```
12-column editorial grid
│
├─ Desktop: 48px margins, 24px gutters
├─ Tablet: 24px margins, 16px gutters
└─ Mobile: 16px margins, 16px gutters
```

### Content Zones
```
┌─────────────────────────────────────┐
│         FULL-BLEED HERO             │
├─────────────────────────────────────┤
│  ┌──────────┐    ┌──────────────┐  │
│  │  MAIN    │    │   SIDEBAR    │  │
│  │ CONTENT  │    │              │  │
│  │          │    │   Related    │  │
│  │          │    │   Links      │  │
│  └──────────┘    └──────────────┘  │
└─────────────────────────────────────┘
```

## Workflow

### Step 1: Search Brain for Editorial References
```javascript
memory_search({
  query: "editorial shadows layered visual depth",
  group_id: "allura-team-durham",
  user_id: "dieter-rams"
});
```

### Step 2: Define Shadow System
- Choose base color (usually brand dark)
- Define 3 layers per elevation level
- Test on actual backgrounds

### Step 3: Define Grid System
- Baseline: 4px
- Column: 12-col responsive
- Zones: Hero, Main, Sidebar patterns

### Step 4: Apply to Components
- Cards: elevation.card
- Buttons (hover): elevation.hover
- Modals: elevation.modal

### Step 5: Log to Brain
```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "dieter-rams",
  content: "Editorial shadow system created: 3-layer architecture (ambient+directional+contact), 4 elevation levels, responsive 12-column grid with 4px baseline.",
  metadata: {
    client: "allura-memory",
    shadows: {
      layers: 3,
      levels: 4,
      base_color: "#142329"
    },
    grid: {
      baseline: "4px",
      columns: 12,
      responsive: true
    }
  }
});
```

## Figma Implementation

### Creating Effect Styles

```javascript
// In Figma, create effect styles for each elevation
const cardEffect = {
  type: "DROP_SHADOW",
  color: { r: 0.078, g: 0.137, b: 0.161, a: 0.08 },
  offset: { x: 0, y: 4 },
  radius: 20,
  spread: -4
};

// Multiple effects on one style
figma.createEffectStyle({
  name: "Elevation/Card",
  effects: [ambientEffect, directionalEffect]
});
```

### Layer Naming Convention
```
Effect/{Usage}/{Variant}

Examples:
- Effect/Elevation/Card
- Effect/Elevation/Hover
- Effect/Elevation/Modal
- Effect/Shadow/Soft (ambient only)
- Effect/Shadow/Deep (all layers)
```

## Invariants

1. **Always 3 layers minimum** — Never single shadow for elevated elements
2. **Consistent base color** — All shadows use brand dark gray
3. **Responsive grids** — 12-col adapts to viewport
4. **4px baseline** — All vertical spacing aligns
5. **Less but better** — Remove decorative elements, keep functional depth

## Success Criteria

- ✅ 3-layer shadows defined (ambient + directional + contact)
- ✅ 4 elevation levels (flat, card, hover, modal)
- ✅ 12-column responsive grid
- ✅ 4px baseline alignment
- ✅ Figma effect styles created
- ✅ Brain logged with full specifications

## Integration with Party Mode

When `/party` dispatches editorial system:
1. Dieter Rams defines shadow philosophy
2. Bret Victor validates responsive grid
3. Eva-Lotta Lamm connects to spacing tokens
4. Glaser applies to Figma components
5. Munari validates visual sophistication
6. All logged to Brain with EDITORIAL_SYSTEM_CREATED event

## Comparison: Team Durham v3.1 vs v3.2

| Aspect | v3.1 (Flat) | v3.2 (Editorial) |
|--------|-------------|------------------|
| Shadow layers | 1 | **3** |
| Elevation levels | 2 (card, modal) | **4** (flat, card, hover, modal) |
| Grid system | Basic 12-col | **Responsive editorial** |
| Baseline | Ad hoc | **4px strict** |
| Visual feel | Template-like | **Sophisticated, warm** |
