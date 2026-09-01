---
name: brand-presentation-builder
description: "Build client-facing brand presentation HTML pages from approved brand kit data. Trigger when creating presentation pages, making client slides, or deploying brand pages for review. Generates 5 standard HTML pages. Use when agent_id=rand runs PB (Presentation Build) command."
globs: ["clients/**", ".claude/**"]
---

# Brand Presentation Builder

> **Purpose:** Transform 10-section brand kits into interactive, client-ready HTML presentation artifacts
> **Executor:** @Rand (Brand Kit Builder) + @Glaser (Visual Direction)
> **Output:** 5 HTML pages with warm, rounded, floating-card aesthetic
> **group_id:** `allura-team-durham`

---

## When to Use

Use this skill when:
- Brand Kit v3.x is complete (all 10 sections approved)
- Client needs shareable, visual brand guidelines (not just markdown)
- Presentation artifacts must match brand aesthetic (warmth, rounded, approachable)
- Output needs to be self-contained HTML (no build step, works locally)

---

## Quick Start

```bash
# Generate presentation artifacts for a client
/skill brand-presentation-builder --client allura-memory

# With options
/skill brand-presentation-builder --client allura-memory --theme warm --animations true
```

---

## Output Structure

```
clients/<client-slug>/presentation-artifacts/
├── index.html              # Navigation hub / Brand Overview
├── logo-chooser.html       # Logo system with interactive variants
├── color-system.html       # Interactive color swatches + accessibility
├── typography.html         # Type scale + live examples
├── applications.html       # Business cards, letterhead, social templates
├── assets/
│   ├── logos/              # Copied from client assets
│   ├── images/             # Generated hero images
│   └── fonts/              # Outfit + Inter (Google Fonts CDN)
└── css/
    ├── allura-theme.css    # Design tokens + variables
    ├── components.css      # Card, button, navigation styles
    └── animations.css      # Hover effects, transitions
```

---

## The 5 Pages

### 1. Brand Overview (`index.html`)

**Sections:**
- Hero: Full-width gradient with brand promise
- Origin Story: Mission, vision, values (warm narrative)
- Brand Personality: Aaker dimensions with visual meters
- Brand Archetype: Caregiver/Creator/Explorer breakdown
- Quick Navigation: Cards linking to other pages

**Design Pattern:**
- Warm gradient hero (Yellow → Cream → Blue)
- Floating stat cards with 3-layer shadows
- Typography showcase with Outfit headings

---

### 2. Logo System (`logo-chooser.html`)

**Sections:**
- Logo Gallery: Interactive variant selector
- Clearspace Calculator: Visual safe-zone demonstration
- Size Guidelines: Min/max with responsive preview
- Do's & Don'ts: Side-by-side comparison grid
- Download Section: All variants with copy-to-clipboard links

**Interactive Features:**
- Click logo variant to see it in context (light/dark bg)
- Slider for size preview (32px → 400px)
- Animated clearspace visualization

---

### 3. Color System (`color-system.html`)

**Sections:**
- Primary Palette: Warm Yellow, Deep Blue, Warm Green swatches
- Neutral Scale: Dark Gray, White, tints
- Semantic Tokens: Action, Text, Surface color mapping
- Accessibility Matrix: WCAG AAA pairings with contrast ratios
- Usage Ratios: Visual pie chart (60/20/15/5)

**Interactive Features:**
- Click swatch to copy HEX/RGB/CMYK
- Live contrast checker (text color vs bg)
- Dark mode toggle preview

---

### 4. Typography (`typography.html`)

**Sections:**
- Typefaces: Outfit + Inter pair showcase
- Scale: H1-H3, Body, Caption with line-height
- Hierarchy: Visual examples of heading/body combinations
- Voice & Tone: Writing principles with examples
- Channel Adaptations: Web, social, email samples

**Design Pattern:**
- Live type specimens (editable preview)
- Pairing recommendations
- Responsive scale demonstration

---

### 5. Applications (`applications.html`)

**Sections:**
- Business Card: Front/back preview with specs
- Letterhead: 8.5×11 layout example
- Email Signature: Copy-paste HTML snippet
- Social Media: Instagram, LinkedIn, Twitter templates
- Presentation: 16:9 slide template preview

**Interactive Features:**
- Business card color variant toggle
- Social template size switcher (platform presets)
- Downloadable templates (CSS + HTML)

---

## Design System Integration

### From Brand Kit → CSS Variables

```css
/* Primitive Tokens */
:root {
  --color-warm-yellow: #FFC300;
  --color-deep-blue: #0581A7;
  --color-warm-green: #BDBD0D;
  --color-dark-gray: #142329;
  --color-white: #F5F5F5;

  /* Semantic Tokens */
  --color-action-primary: var(--color-warm-yellow);
  --color-text-primary: var(--color-dark-gray);
  --color-surface-primary: var(--color-white);

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 4rem;     /* 64px */

  /* Border Radius (Rounded warmth) */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 9999px;

  /* Editorial 3-Layer Shadows */
  --shadow-ambient: 0 4px 20px -4px rgba(20, 35, 41, 0.08);
  --shadow-directional: 0 8px 16px -4px rgba(20, 35, 41, 0.12);
  --shadow-contact: 0 2px 4px 0 rgba(20, 35, 41, 0.16);
  --shadow-card: var(--shadow-ambient), var(--shadow-directional);
  --shadow-hover: var(--shadow-ambient), var(--shadow-directional), var(--shadow-contact);
}
```

---

## Component Library

### Cards

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-card);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
```

### Buttons

```css
.btn-primary {
  background: var(--color-warm-yellow);
  color: var(--color-dark-gray);
  font-family: var(--font-heading);
  font-weight: 600;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-directional);
}
```

### Navigation

- Sticky header with glassmorphism effect
- Rounded pill navigation items
- Active state with warm yellow underline
- Mobile: Hamburger with slide-out drawer

---

## Animation Principles

**Subtle, Purposeful Motion:**
- Hover lifts: 4-8px translation
- Shadow transitions: 200ms ease
- Page transitions: Fade + slight slide (300ms)
- Card entrances: Staggered fade-up (50ms delay between cards)

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Workflow

### Step 1: Hydrate from Brain

```javascript
// Search for approved brand kit
memory_search({
  query: "brand kit approved v3",
  group_id: "allura-team-durham",
  user_id: "rand",
  limit: 5
});

// Get design tokens
memory_search({
  query: "design tokens color typography",
  group_id: "allura-team-durham"
});
```

### Step 2: Asset Discovery

Check client directory for:
- `deliverables/brand-kit-v*.md` (source of truth)
- `assets/logos/` (PNG variants)
- `generated-images/` (hero imagery)
- `design-tokens.json` (if exists)

### Step 3: Generate Pages

For each of the 5 pages:
1. Parse brand kit section
2. Apply design tokens to CSS variables
3. Build HTML structure with semantic markup
4. Add interactive JavaScript
5. Inline critical CSS, lazy-load rest

### Step 4: Brain Log

```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "rand",
  content: "Generated brand presentation artifacts: 5 HTML pages with interactive elements. Location: clients/allura-memory/presentation-artifacts/. Features: logo variant picker, color swatch copier, WCAG accessibility matrix.",
  metadata: {
    client: "allura-memory",
    skill: "brand-presentation-builder",
    output: "5 HTML pages",
    location: "clients/allura-memory/presentation-artifacts/"
  }
});
```

---

## Validation Checklist

Before marking complete:
- [ ] All 5 pages render without errors
- [ ] Design tokens match brand kit exactly
- [ ] Logo files display correctly (no broken links)
- [ ] Interactive elements work (copy buttons, toggles)
- [ ] Responsive at 320px → 1920px
- [ ] WCAG AA compliance (contrast, focus states)
- [ ] Reduced motion preferences respected
- [ ] Works offline (no external dependencies except fonts)

---

## Invariants

1. **No build step** — Pure HTML/CSS/JS, works in any browser
2. **Design tokens from brand kit** — Never hardcode values
3. **Asset-first** — Use actual PNGs, not placeholders
4. **Client-ready** — Professional enough to share externally
5. **Brain-logged** — Every generation logged with metadata

---

## Integration with Party Mode

When Party Mode dispatches this skill:

```javascript
// Parallel task from Rand
TaskCreate({
  agent: "rand",
  description: "Build HTML presentation artifacts",
  prompt: "Use brand-presentation-builder skill with --client allura-memory. Generate all 5 pages with warm rounded aesthetic.",
  subagent_type: "brand-kit-builder"
});
```

Output becomes part of the brand delivery package alongside:
- Brand Kit (markdown)
- Figma components
- Generated images
- **Presentation Artifacts (HTML)** ← this skill
