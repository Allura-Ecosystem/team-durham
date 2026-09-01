# Layout & Spacing · Frontend Craft Systematize Phase

Layout is the skeleton of the interface. If the skeleton is wrong, decoration merely paints the fracture.

---

## Core Principles

1. **Use a small spacing scale** — excess values create accidental complexity.
2. **Align before embellishing** — visual rhythm is a contract.
3. **Whitespace is active** — it groups, separates, and prioritizes.
4. **Responsive by structure, not exception** — avoid breakpoint tar pits.
5. **Content defines containers** — do not stretch readable text to fill screens.

---

## Spacing Scale

Use this scale unless the selected direction documents a deliberate exception.

```css
:root {
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;
}
```

| Token | Use |
|---|---|
| `--space-1` | icon gaps, dense controls |
| `--space-2` | label/input gaps, compact lists |
| `--space-3` | default component internal padding |
| `--space-4` | card padding, section sub-gaps |
| `--space-5` | panel padding, modal padding |
| `--space-6` | section spacing |
| `--space-7/8` | hero/major page rhythm |

Fail audit if similar elements use arbitrary values like 13px, 19px, 27px.

---

## Containers

```css
.container {
  width: min(100% - (2 * var(--space-4)), 1120px);
  margin-inline: auto;
}

.container-narrow {
  width: min(100% - (2 * var(--space-4)), 720px);
  margin-inline: auto;
}

.container-wide {
  width: min(100% - (2 * var(--space-4)), 1440px);
  margin-inline: auto;
}
```

Rules:

- Reading text: 60–80 characters per line.
- Dashboards: allow wide canvases, but constrain card internals.
- Forms: usually 480–640px max width.
- Modals: max 90vw and sensible fixed content width.

---

## Grid and Flex

Use CSS Grid for page layout and two-dimensional alignment. Use Flexbox for one-dimensional alignment.

```css
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-4);
}

.cluster {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
```

Avoid nested grids unless each grid has a clear responsibility.

---

## Breakpoints

Test at these widths:

| Width | Meaning |
|---:|---|
| 320px | Small mobile minimum |
| 768px | Tablet / large mobile |
| 1024px | Small laptop |
| 1440px | Standard desktop |
| 1920px | Wide desktop |

```css
:root {
  --page-gutter: var(--space-4);
}

@media (max-width: 767px) {
  :root { --page-gutter: var(--space-3); }
}

@media (min-width: 1440px) {
  :root { --page-gutter: var(--space-5); }
}
```

Mobile is not a shrunken desktop. Reorder only when the information architecture remains intact.

---

## Visual Rhythm

Use rhythm helpers instead of one-off margins.

```css
.flow > * + * {
  margin-block-start: var(--flow-space, var(--space-3));
}

section + section {
  margin-block-start: var(--space-6);
}

.card {
  padding: var(--space-4);
  border-radius: 16px;
}
```

Rules:

- Related controls should sit closer than unrelated controls.
- More important content earns more space around it.
- Dense UIs need stronger alignment, not more borders.

---

## Layout Anti-Patterns

- Cards inside cards inside cards.
- Full-width paragraphs on large displays.
- Center-aligning dense information.
- Mixing left and center alignment in one section without reason.
- Using borders to compensate for poor grouping.
- Desktop-only sidebar that collapses into unusable mobile navigation.
- Every section using equal vertical padding regardless of importance.

The best layout feels quiet because its decisions have already been made.

---

## Allura-Specific Layout

### Graph Page Layout

- Canvas container: `min(100vw, 1440px)` with side panel at 320px.
- Card spacing: `--space-4` between cards, `--space-6` between major sections.
- Grid: 3-column minimum, 4-column ideal for evidence nodes.

### Review Page Layout

- Evidence tree: 300px fixed, collapsible.
- Content area: 60-80 character line length.
- Empty state: Centered with max-width container.

### Memory Cards Layout

- Grid: 1-2-4 columns based on viewport.
- Card padding: `--space-4` internal, `--space-3` external.
- Loading skeleton: Match card dimensions exactly.

### Evidence Detail Layout

- Side panel: Key metadata only (tags, dates, relationships).
- Main content: Narrative flow with generous line-height.
- Relationship arrows: Use `--space-2` spacing.
