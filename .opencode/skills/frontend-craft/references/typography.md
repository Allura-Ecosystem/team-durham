# Typography · Frontend Craft Systematize Phase

Typography is not decoration. It is **information architecture in time**.

---

## Core Principles

1. **Hierarchy**: Content order through font scale, weight, and spacing
2. **Legibility**: Readable at 16px base, no smaller without user control
3. **Rhythm**: Consistent line-height and vertical spacing
4. **Accessibility**: Minimum 4.5:1 contrast for normal text, 3:1 for large text

---

## Font Scale

### Base Unit: 16px (Desktop-first)

| Size | Desktop | Mobile | Use Case |
|---|---|---|---|
| `--font-size-base` | 16px | 15px | Body text (paragraphs, lists) |
| `--font-size-lg` | 18px | 16px | Prefaces, captions, form hints |
| `--font-size-xl` | 20px | 18px | Subheadings, callout text |
| `--font-size-2xl` | 24px | 20px | H3s, section headings |
| `--font-size-3xl` | 32px | 24px | H2s, hero headings |
| `--font-size-4xl` | 40px | 32px | H1s, major section headings |

### Hierarchy Mapping

| HTML Element | CSS Font Size | Heading Level | Use |
|---|---|---|---|
| `h1` | `var(--font-size-4xl)` (40px) | H1 | Page title, hero section |
| `h2` | `var(--font-size-3xl)` (32px) | H2 | Major section headings |
| `h3` | `var(--font-size-2xl)` (24px) | H3 | Subsections |
| `h4` | `var(--font-size-xl)` (20px) | H4 | Sub-subsections |
| `h5` | `var(--font-size-lg)` (18px) | H5 | Minor headings |
| `p` | `var(--font-size-base)` (16px) | — | Body text |
| `small` | `calc(var(--font-size-base) * 0.875)` (14px) | — | Captions, footnotes |

### Responsive Adjustments

```css
/* Mobile-first typography scale (320px-767px) */
@media (max-width: 767px) {
  :root {
    --font-size-base: 15px;
    --font-size-lg: 16px;
    --font-size-xl: 18px;
    --font-size-2xl: 20px;
    --font-size-3xl: 24px;
    --font-size-4xl: 32px;
  }
}

/* Tablet (768px-1023px) — optional, if desktop scale feels too large */
@media (min-width: 768px) and (max-width: 1023px) {
  :root {
    --font-size-xl: 19px;
    --font-size-2xl: 23px;
  }
}
```

---

## Line Height (Leading)

### Body Text: 1.5 (Universal Standard)

| Font Size | Line Height | Rationale |
|---|---|---|
| 14px | 21px | 1.5x — minimum for legibility |
| 16px | 24px | 1.5x — comfortable reading |
| 18px | 27px | 1.5x — slightly larger, same ratio |
| 20px | 30px | 1.5x | 
| 24px | 36px | 1.5x | 
| 32px | 48px | 1.5x | 
| 40px | 60px | 1.5x | 

### Headings: 1.25 (Tighter, More Impact)

| Font Size | Line Height | Rationale |
|---|---|---|
| 24px | 30px | 1.25x — compact, still readable |
| 32px | 40px | 1.25x |
| 40px | 50px | 1.25x |

### Special Cases: Hero Lines (1.1-1.2)
Never use line-height < 1.1 — causes descender clipping and "cramped" appearance.

---

## Font Families (System UI Fonts)

### Primary: IBM Plex Sans (Custom Web Fonts)

```css
:root {
  --font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

### Code/Data Blocks: IBM Plex Mono

```css
:root {
  --font-family-mono: "IBM Plex Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
```

### Rationale for IBM Plex Sans
1. **Performance**: Optimized for screen rendering
2. **Compatibility**: Works on every device, every OS
3. **Accessibility**: Open-source with excellent legibility at all sizes
4. **Branding**: Professional, modern aesthetic for Allura

### IBM Plex Mono Usage
- Code blocks: `font-family: var(--font-family-mono);`
- Tables with data: `font-family: var(--font-family-mono);`
- Technical documentation: `font-family: var(--font-family-mono);`

### When to Use Custom Fonts
- You have **brand requirements** (logo, iconography, specific typography)
- You need **variable fonts** (weight, width, slant axes)
- You're building a **marketing site** (not internal tooling)

### Custom Font Protocol
1. Load with `font-display: swap` (FOUT, not FOIT)
2. Serve via `rel="preconnect"` + `rel="preload"`
3. Subset fonts (Latin only, unless i18n required)
4. Test at 16px, 12px, 8px — smallest size must be legible

---

## Spacing & Rhythm

### Vertical Rhythm: One Baseline Grid

All vertical spacing (margin, padding) must be multiples of `4px` (which is 1/4 of 16px base).

| Spacing Token | Pixels | Em | Rationale |
|---|---|---|---|
| `--space-1` | 4px | 0.25em | Quarter-line, "quiet" spacing |
| `--space-2` | 8px | 0.5em | Half-line, tight spacing |
| `--space-3` | 16px | 1em | Full line, body text spacing |
| `--space-4` | 24px | 1.5em | Body + half-line, section spacing |
| `--space-5` | 32px | 2em | Two lines, paragraph spacing |
| `--space-6` | 48px | 3em | Three lines, major section spacing |

### Application

| Context | Spacing Token | Pixels | Em | Rationale |
|---|---|---|---|---|
| Between paragraphs | `--space-3` | 16px | 1em | One full line break |
| Between sections | `--space-4` | 24px | 1.5em | Body + half-line spacing |
| Between major sections | `--space-6` | 48px | 3em | Three-line break |
| Form field label & input | `--space-2` | 8px | 0.5em | Tight, clear grouping |
| Input & hint text | `--space-1` | 4px | 0.25em | Minimal, still visible |

### CSS Implementation
```css
/* Spacing scale */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
}

/* Typography helpers */
.typography-body {
  font-size: var(--font-size-base);
  line-height: 1.5;
  margin-bottom: var(--space-3); /* 16px after each paragraph */
}

.typography-heading {
  line-height: 1.25;
}

/* Consistent spacing between elements */
.element + .element {
  margin-top: var(--space-3);
}

/* Section spacing */
section + section {
  margin-top: var(--space-4);
}
```

---

## Accessibility Thresholds

### Contrast Ratios (WCAG 2.1 AA)

| Text Size | Minimum Contrast | AAA Requirement |
|---|---|---|
| Normal text (< 18px or < 14px bold) | 4.5:1 | 7:1 |
| Large text (≥ 18px or ≥ 14px bold) | 3:1 | 4.5:1 |
| UI components (buttons, form controls) | 3:1 (non-text) | 3:1 (all) |

### Check Your Typography Contrast
```bash
# Run Lighthouse accessibility audit
npx lighthouse <url> --view --only-categories=accessibility

# Or use axe-core CLI
npx axe <url>
```

### Recommended Palette for Typography (Allura)

| Text | Token | Contrast (Text on White) |
|---|---|---|
| **Body text** | `#0F1115` (Allura Text Primary) | 16.4:1 ✓ AAA |
| **Muted text** | `#64748b` (Slate-500) | 6.7:1 ✓ |
| **Links** | `#1D4ED8` (Allura Blue) | 4.6:1 ✓ AA |
| **Error text** | `#DC2626` (Red-600) | 4.6:1 ✓ AA |
| **Success text** | `#157A4A` (Allura Success) | 4.9:1 ✓ AA |
| **Warning text** | `#C89B3C` (Allura Gold) | 2.8:1 — large text only |

### Reject If:
- Text contrast < 4.5:1 for normal size
- Text contrast < 3:1 for large size
- Link color indistinguishable from body text
- Hover/focus states don't change text color **or** add underline
- Allura Coral (#FF5A2E) used for body text (low contrast)

---

## Mobile Typography

### Smaller Readable Sizes (320px-767px)
| Size | Desktop | Mobile | Rationale |
|---|---|---|---|
| Body | 16px | 15px | Slightly smaller on mobile, same readability |
| H3 | 24px | 20px | Headings can be smaller, not larger |
| H2 | 32px | 24px | Same ratio, smaller absolute size |
| H1 | 40px | 32px | Hero headings don't need to be 40px on mobile |

### Mobile-Specific Rules
1. **Never < 14px** on mobile (user resize)
2. **Cap line-length**: 60-80 characters per line
3. **Use larger spacing**: 8px → 9px on mobile for 320px width
4. **Test legibility**: Can you read this at arm's length?

---

## Code/Data Typography

### IBM Plex Mono Scale
```css
/* Code blocks and data tables */
.code-block {
  font-family: var(--font-family-mono);
  font-size: 14px;
  line-height: 1.6;
}

/* Data table cells */
.table-cell {
  font-family: var(--font-family-mono);
  font-size: 14px;
}
```

### Best Practices
- Code examples: 14px minimum
- Line numbers: 12px, muted contrast
- Syntax highlighting: Use semantic tokens, not generic colors

---

## Quick Reference: Font Scale Calculator

| Desktop Size | Mobile Size | Calculation |
|---|---|---|
| 16px → | 15px | `16 * 0.9375` |
| 18px → | 16px | `18 * 0.8889` |
| 20px → | 18px | `20 * 0.9` |
| 24px → | 20px | `24 * 0.8333` |
| 32px → | 24px | `32 * 0.75` |
| 40px → | 32px | `40 * 0.8` |

**Rule of thumb**: Reduce by **5-25%** for mobile, relative to desktop size.

---

## Token Authority

**In HTML/JSX+Tailwind**: Use `var(--allura-blue) etc.` CSS custom properties.

**In Canvas 2D/JS**: Use `tokens.ts` imports.

**Never**: Raw hex values, generic shadcn color utilities (`bg-muted`, `text-muted-foreground`).
