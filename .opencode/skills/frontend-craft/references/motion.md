# Motion · Frontend Craft Polish Phase

Motion is explanation over time. If it does not clarify cause, continuity, or hierarchy, remove it.

---

## Motion Principles

1. **Purpose first** — motion explains what changed.
2. **Short by default** — users came to act, not watch.
3. **Transform and opacity only** — avoid layout-triggering animation.
4. **Respect reduced motion** — accessibility is not optional.
5. **No theatrical bounce** — unless the selected direction explicitly demands playfulness.

---

## Duration Scale

| Motion Type | Duration |
|---|---:|
| Hover/focus feedback | 100–150ms |
| Button press | 75–120ms |
| Toast enter/exit | 150–220ms |
| Modal/sheet enter | 200–300ms |
| Page transition | 250–400ms |
| Anything > 500ms | Requires explicit justification |

Fail audit for routine UI animations longer than 500ms.

---

## Easing

```css
:root {
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

Rules:

- Entering elements: ease-out.
- Exiting elements: ease-in.
- State changes: standard.
- Avoid bounce/elastic unless the selected direction is explicitly playful.

---

## Safe Properties

Prefer:

```css
transform: translateY(4px);
opacity: 0;
```

Avoid animating:

- width / height
- top / left / right / bottom
- margin / padding
- box-shadow on many elements
- filter / backdrop-filter on large surfaces

These often trigger layout or expensive paints.

---

## Staggering Lists

Use small stagger intervals.

```css
.item {
  animation: fade-up 180ms var(--ease-out) both;
  animation-delay: calc(var(--index) * 35ms);
}
```

Rules:

- Max stagger per item: 50ms.
- Max total stagger: 300ms.
- Do not stagger long data tables.

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .motion-enter,
  .motion-exit,
  .item {
    animation: none;
    transition: none;
  }
}
```

Reduced motion should replace movement with immediate state change, opacity change, or static affordance.

---

## Performance Targets

| Metric | Target |
|---|---:|
| Animation frame rate | 60fps target, never below 30fps sustained |
| Cumulative Layout Shift | < 0.1 |
| Interaction to Next Paint | < 200ms preferred |
| Animation main-thread blocking | none visible |

Audit signs of bad motion:

- Text blurs during transform.
- Cards jump after images load.
- Scroll feels sticky.
- Hovering many items causes frame drops.

---

## Motion Anti-Patterns

- Bounce easing on enterprise or compliance workflows.
- Infinite decorative animation near reading text.
- Loading spinners without progress or context.
- Page transitions that hide slow data fetching.
- Animating layout instead of transform.
- Motion required to understand state.

Motion should be the hand of the guide, not the magician's cape.

---

## Allura-Specific Motion Patterns

### ForceGraph2D Transitions

- Node enter: 200ms opacity + scale 0.8 → 1.0, ease-out.
- Link draw: 150ms stroke-dasharray animation.
- Selection pulse: 100ms scale 1.05 → 1.0, no elastic.

### Memory Cards

- Expandable: 250ms height animation, ease-in-out.
- Search filters: 150ms opacity fade + transform translateY(4px).

### Review Page

- Evidence tree collapse: 200ms opacity + transform scaleY(0.95), ease-out.
- Loading skeleton: 1.5s infinite opacity fade.

### Modal/Dialog

- Enter: 300ms opacity + scale 0.9, ease-out.
- Exit: 200ms opacity, ease-in.
