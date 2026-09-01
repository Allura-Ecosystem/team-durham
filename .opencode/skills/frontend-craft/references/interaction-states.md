# Interaction States · Frontend Craft Build and Audit Phase

An interface is not a picture. It is a conversation. Every interactive element must answer the user: "What am I? What can I do? What just happened?"

---

## Required States

Every interactive component must define:

- Default
- Hover
- Focus-visible
- Active/pressed
- Disabled
- Loading/pending
- Error, where applicable
- Success, where applicable
- Empty state, where applicable

Missing states fail audit.

---

## Focus Visible

Never remove outlines without replacing them.

```css
:where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 3px;
}
```

Rules:

- Focus ring must be visible on every surface color.
- Focus order must match visual order.
- Keyboard users must be able to reach every action.
- Escape closes dismissible overlays.
- Tab does not enter hidden content.

---

## Buttons

```css
.button {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding-inline: var(--space-4);
  border-radius: 12px;
  transition: background-color 150ms ease-out, transform 150ms ease-out;
}

.button:hover:not(:disabled) {
  background-color: var(--color-primary-strong);
}

.button:active:not(:disabled) {
  transform: translateY(1px);
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
```

Button labels must be verbs: "Save changes," not "OK."

---

## Forms

Required form behavior:

- Labels remain visible when fields are filled.
- Errors attach to the field and appear near it.
- Required fields are indicated textually, not by color alone.
- Inputs preserve user-entered data after validation failure.
- Submit button enters loading state and prevents duplicate submission.

```css
.field[data-invalid="true"] input {
  border-color: var(--color-error);
}

.field-error {
  color: var(--color-error);
  font-size: 0.875rem;
}
```

---

## Loading States

Use loading states that preserve layout.

Good:

- Skeleton with same approximate dimensions.
- Inline spinner plus "Saving..." label.
- Disabled submit while request is pending.

Bad:

- Blank page.
- Spinner with no label.
- Layout jumping after data loads.

---

## Empty States

An empty state must include:

1. What happened.
2. Why it matters.
3. What to do next.

Template:

```text
No memories found
Try a broader search or create a new memory.
[Create memory]
```

Do not use jokes in critical workflows.

---

## Error and Success States

Error states should be recoverable whenever possible.

```text
Could not save memory
The server timed out before confirming the write. Your draft is still here.
[Try again]
```

Success states should confirm the outcome, not merely say "Success."

```text
Memory saved to PostgreSQL and queued for promotion review.
```

---

## Touch Targets

- Minimum target: 44px × 44px.
- Minimum gap between adjacent targets: 8px.
- Destructive actions require clear separation from primary actions.

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

Reduced motion must preserve meaning. Do not hide state changes just because animation is disabled.

---

## Allura-Specific Patterns

### Graph Page (ForceGraph2D)

- Empty state: "No connections found. Try a different search term or expand your network."
- Loading state: "Connecting nodes..." with spinner.
- Error state: "Graph failed to load. Refresh or try a smaller dataset."

### Memory Cards

- Hover: Scale 1.05 with subtle shadow lift.
- Focus: 2px solid `#1D4ED8` outline.
- Active: Scale 0.98 with quick spring effect.

### Review Page

- Empty state: "No reviews yet. Submit your first review to help others."
- Loading state: "Loading evidence graph..." with skeleton cards.
