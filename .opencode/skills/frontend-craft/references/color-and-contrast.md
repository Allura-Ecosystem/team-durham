# Color & Contrast · Frontend Craft Systematize Phase

Color is not decoration. It is **information encoding**. Every color decision must serve a semantic role or it is noise.

---

## Core Principles

1. **Semantic before decorative** — every color has a job.
2. **Contrast before beauty** — unreadable beauty is a castle in the air.
3. **Tinted neutrals, not dead gray** — pure gray is rarely alive enough for modern UI.
4. **Dark mode is a second palette** — not an inverted light palette.
5. **One primary accent** — more than one primary is no primary.

---

## OKLCH Primer

Prefer OKLCH for new palettes because it is perceptually uniform.

```css
:root {
  --color-primary: oklch(0.56 0.18 255);
  --color-primary-muted: oklch(0.92 0.04 255);
  --color-primary-strong: oklch(0.42 0.20 255);
}
```

| Channel | Meaning | Practical Use |
|---|---|---|
| `L` | Lightness | Contrast and dark/light mode |
| `C` | Chroma | Saturation/intensity |
| `H` | Hue | Brand direction |

If the stack cannot emit OKLCH safely, generate HEX fallbacks at build time. Do not abandon semantic tokens.

---

## Semantic Color Roles

```css
:root {
  --color-background: oklch(0.985 0.005 255);
  --color-surface: oklch(0.96 0.008 255);
  --color-surface-raised: oklch(0.99 0.004 255);
  --color-border: oklch(0.84 0.018 255);

  --color-text: oklch(0.18 0.025 255);
  --color-text-muted: oklch(0.46 0.035 255);
  --color-text-inverse: oklch(0.98 0.006 255);

  --color-primary: oklch(0.56 0.18 255);
  --color-primary-muted: oklch(0.92 0.04 255);
  --color-primary-strong: oklch(0.42 0.20 255);

  --color-success: oklch(0.56 0.14 150);
  --color-warning: oklch(0.72 0.14 80);
  --color-error: oklch(0.56 0.20 28);
  --color-info: oklch(0.58 0.14 235);

  --color-focus-ring: oklch(0.62 0.18 255);
}
```

### Role Rules

- Primary: one main action per view.
- Success: completed or safe state only.
- Warning: recoverable risk.
- Error: failure or destructive state.
- Info: neutral system information.
- Muted text: metadata, never critical instructions.

---

## Contrast Thresholds

| Element | Minimum | Preferred |
|---|---:|---:|
| Body text | 4.5:1 | 7:1 |
| Large text | 3:1 | 4.5:1 |
| Icons conveying meaning | 3:1 | 4.5:1 |
| Button boundaries | 3:1 | 4.5:1 |
| Focus rings | 3:1 vs adjacent colors | 4.5:1 |

Fail the audit if:

- Placeholder text is used as the only label.
- Muted text falls below 4.5:1 for meaningful content.
- A colored background contains gray text.
- Focus rings disappear on colored surfaces.

---

## Allura Color Palette Reference

| Token | Hex | Description | WCAG on White |
|---|---|---|---|
| `--allura-primary` | `#1D4ED8` | Primary Blue | 4.6:1 AA |
| `--allura-coral` | `#FF5A2E` | Allura Coral | 3.1:1 — large text/buttons/icons only |
| `--allura-surface-subtle` | `#F6F4EF` | Surface Subtle | N/A |
| `--allura-success` | `#157A4A` | Success Green | 4.9:1 AA |
| `--allura-accent-gold` | `#C89B3C` | Accent Gold | 2.8:1 — large text only |
| `--allura-text-primary` | `#0F1115` | Text Primary | 16.4:1 AAA |

### Usage Notes

- Primary Blue (#1D4ED8) on White: 4.6:1 AA — suitable for body text.
- Allura Coral (#FF5A2E) on White: 3.1:1 — **large text/buttons/icons only** (18pt/24px+).
- Text Primary (#0F1115) on White: 16.4:1 AAA — meets AAA requirement.
- Primary Blue (#1D4ED8) on Surface Subtle (#F6F4EF): 4.9:1 AA — suitable for UI elements.

---

## Tinted Neutrals

Neutral scales should inherit a trace of the brand hue.

```css
:root {
  --neutral-50: oklch(0.985 0.005 255);
  --neutral-100: oklch(0.955 0.008 255);
  --neutral-200: oklch(0.90 0.012 255);
  --neutral-500: oklch(0.52 0.025 255);
  --neutral-900: oklch(0.18 0.025 255);
}
```

Avoid pure black except for deliberate print-like editorial work. Avoid pure white when the interface needs calm.

---

## Dark Mode Strategy

Dark mode is not `filter: invert(1)`.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: oklch(0.14 0.018 255);
    --color-surface: oklch(0.19 0.020 255);
    --color-surface-raised: oklch(0.24 0.022 255);
    --color-border: oklch(0.34 0.026 255);

    --color-text: oklch(0.94 0.010 255);
    --color-text-muted: oklch(0.70 0.018 255);

    --color-primary: oklch(0.70 0.14 255);
    --color-primary-muted: oklch(0.28 0.08 255);
    --color-focus-ring: oklch(0.76 0.15 255);
  }
}
```

Dark-mode rules:

- Reduce chroma by 15–30%.
- Increase spacing around dense content if the page feels heavy.
- Never place saturated red, green, or blue directly on dark surfaces without contrast testing.

---

## Anti-AI-Slop Palette Rules

Reject these unless the selected direction explicitly justifies them:

- Purple-to-blue gradient hero sections.
- Generic glassmorphism cards with glowing borders.
- Gray text over colored backgrounds.
- Five accent colors in one viewport.
- Random pastel chips without semantic mapping.
- Error/success/warning colors used as decoration.

The palette should look inevitable, not assembled from a model's memory of SaaS landing pages.

---

## Token Authority

**In HTML/JSX+Tailwind**: Use `var(--allura-blue) etc.` CSS custom properties.

**In Canvas 2D/JS**: Use `tokens.ts` imports.

**Never**: Raw hex values, generic shadcn color utilities (`bg-muted`, `text-muted-foreground`).
