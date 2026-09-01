---
name: design-tokens
description: Create semantic design token architecture with Brain-backed color, typography, and spacing systems. Replaces primitive values (Warm Yellow) with semantic tokens (color/action/primary) that resolve to primitives.
---

# Design Tokens Skill

> **Principle:** Semantic over primitive. Tokens tell you *when* to use a color, not just *what* color to use.
>
> Fixes: Team Durham used `Warm Yellow` directly. This skill creates `color/action/primary` → resolves to → `Warm Yellow`.

## The Semantic Token Architecture

```
Semantic Token → Primitive Token → Value
─────────────────────────────────────────
color/action/primary → color/brand/warm-yellow → #FFC300
color/text/primary → color/brand/dark-gray → #142329
color/surface/primary → color/brand/white → #F5F5F5
```

## When to Use

- Building Figma variable collections
- Creating theme-aware color systems
- Setting up dark mode transformations
- Establishing token governance

## Token Categories

### 1. Primitive Tokens (Brand DNA)
Source: Brand Kit Section 4 — Color Palette

```javascript
// Collection: "Allura Primitives"
{
  "color/brand/warm-yellow": { value: "#FFC300", type: "color" },
  "color/brand/warm-green": { value: "#BDBD0D", type: "color" },
  "color/brand/deep-blue": { value: "#0581A7", type: "color" },
  "color/brand/dark-gray": { value: "#142329", type: "color" },
  "color/brand/white": { value: "#F5F5F5", type: "color" }
}
```

### 2. Semantic Tokens (Usage-Driven)
Source: Caregiver archetype + Brand DNA

```javascript
// Collection: "Allura Semantic"
{
  // Action Colors
  "color/action/primary": { ref: "color/brand/warm-yellow" },
  "color/action/secondary": { ref: "color/brand/deep-blue" },
  "color/action/tertiary": { ref: "color/brand/warm-green" },

  // Text Colors
  "color/text/primary": { ref: "color/brand/dark-gray" },
  "color/text/secondary": { ref: "color/brand/deep-blue" },
  "color/text/inverted": { ref: "color/brand/white" },

  // Surface Colors
  "color/surface/primary": { ref: "color/brand/white" },
  "color/surface/secondary": { ref: "color/brand/warm-yellow", opacity: 0.1 },
  "color/surface/inverted": { ref: "color/brand/dark-gray" },

  // Status Colors
  "color/status/success": { ref: "color/brand/warm-green" },
  "color/status/info": { ref: "color/brand/deep-blue" },
  "color/status/warning": { ref: "color/brand/warm-yellow" }
}
```

### 3. Component Tokens (Context-Specific)

```javascript
// Collection: "Allura Components"
{
  "button/primary/bg": { ref: "color/action/primary" },
  "button/primary/text": { ref: "color/text/inverted" },
  "button/secondary/bg": { ref: "color/surface/primary" },
  "button/secondary/border": { ref: "color/action/secondary" },
  "card/bg": { ref: "color/surface/primary" },
  "card/shadow": { ref: "color/brand/dark-gray", opacity: 0.08 }
}
```

## Workflow

### Step 1: Search Brain for Existing Tokens
```javascript
memory_search({
  query: "design tokens color palette primitives",
  group_id: "allura-team-durham",
  user_id: "eva-lotta-lamm"
});
```

### Step 2: Create Primitive Collection
From Brand Kit Section 4 — map all colors.

### Step 3: Create Semantic Collection
From archetype + usage patterns:
- Caregiver warmth → action/primary = warm-yellow
- Trust moments → action/secondary = deep-blue
- Community connection → action/tertiary = warm-green

### Step 4: Create Component Collection
From UI components needed.

### Step 5: Log to Brain
```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "eva-lotta-lamm",
  content: "Design token system created: 5 primitives, 12 semantic tokens, 8 component tokens. Mode support: Light/Dark. Naming convention: category/usage/variant.",
  metadata: {
    client: "allura-memory",
    tokens: {
      primitives: 5,
      semantic: 12,
      component: 8
    },
    modes: ["Light", "Dark"],
    naming_convention: "category/usage/variant"
  }
});
```

## Naming Convention

```
{category}/{usage}/{variant}

Categories:
- color/
- font/
- space/
- size/
- shadow/
- radius/

Examples:
- color/action/primary
- font/body/large
- space/inline/comfortable
- size/button/height
- shadow/card/elevation-1
- radius/button/pill
```

## Figma Variable Scopes

When creating Figma variables, set scopes explicitly:

```javascript
// Color variables
{
  name: "color/action/primary",
  scopes: ["ALL_FILLS", "STROKE_FILL", "TEXT_FILL"]
}

// Spacing variables
{
  name: "space/stack/large",
  scopes: ["GAP", "WIDTH_HEIGHT", "HORIZONTAL_PADDING", "VERTICAL_PADDING"]
}

// Font variables
{
  name: "font/family/primary",
  scopes: ["FONT_FAMILY", "FONT_STYLE"]
}
```

## Invariants

1. **Always semantic first** — Never use primitives directly in components
2. **Mode support** — Every semantic token must work in Light + Dark
3. **Naming consistency** — category/usage/variant always
4. **Brain logging** — Token system must be logged before use
5. **Scope restriction** — Set specific scopes, never ALL_SCOPES

## Success Criteria

- ✅ Primitive collection: All brand colors mapped
- ✅ Semantic collection: Usage-driven token names
- ✅ Component collection: UI-specific contexts
- ✅ Mode support: Light/Dark transformations
- ✅ Brain logged: Full token system documented
- ✅ Naming consistent: category/usage/variant

## Integration with Party Mode

When `/party` dispatches token creation:
1. Eva-Lotta Lamm creates token architecture
2. Brain search validates against existing systems
3. Glaser validates color application in Figma
4. Munari validates token coverage in QA
5. All logged to Brain with TOKEN_SYSTEM_CREATED event
