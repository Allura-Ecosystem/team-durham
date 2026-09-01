# Review Checklist · Frontend Craft Audit Phase

This checklist is the gate between "it appears to work" and "it is ready to ship." It integrates typography, color, layout, interaction, motion, accessibility, responsiveness, and performance.

---

## Audit Summary Template

```markdown
# Frontend Craft Audit

- Feature / Page:
- Reviewer:
- Date:
- Selected Direction:
- Overall: PASS / FAIL

## Critical Blockers
- [ ] None

## Quick Wins
- [ ] None

## Sign-off
- Builder:
- Interface Reviewer:
- Architect:
```

---

## 1. Conceptual Integrity

- [ ] The selected direction is documented.
- [ ] Rejected directions are explicitly rejected with reasons.
- [ ] The implementation follows one visual language.
- [ ] No "best parts of all variants" compromise is present.
- [ ] Essential complexity is visible; accidental complexity is hidden.

Fail if the page feels like a committee assembled it.

---

## 2. Typography Audit

- [ ] Body text is at least 16px desktop / 15px mobile.
- [ ] No meaningful text is below 14px.
- [ ] Heading hierarchy is sequential and semantic.
- [ ] Line height is readable: body ~1.5, headings ~1.1–1.3.
- [ ] Line length is 60–80 characters for reading content.
- [ ] Font loading avoids invisible text.
- [ ] Links are visually distinct from body text.
- [ ] Text contrast passes WCAG AA.

References: `typography.md`, `color-and-contrast.md`.

---

## 3. Color & Contrast Audit

- [ ] All colors use semantic tokens.
- [ ] No hardcoded production color values except inside token definitions.
- [ ] Normal text contrast >= 4.5:1.
- [ ] Large text contrast >= 3:1.
- [ ] Focus rings contrast >= 3:1 against adjacent colors.
- [ ] Error/success/warning/info colors are used semantically.
- [ ] Dark mode has been reviewed independently if supported.
- [ ] No generic purple-gradient AI palette unless explicitly selected and justified.
- [ ] No gray text on colored backgrounds.

References: `color-and-contrast.md`, `anti-patterns.md`.

---

## 4. Layout & Spacing Audit

- [ ] Spacing values use the approved scale.
- [ ] Similar components use similar spacing.
- [ ] Content containers have sensible max widths.
- [ ] Dense information is left-aligned or clearly structured.
- [ ] Cards are not nested without semantic reason.
- [ ] Whitespace groups related elements.
- [ ] Mobile layout is not merely a shrunken desktop.
- [ ] Visual rhythm remains intact across viewport sizes.

Required viewport checks:

- [ ] 320px
- [ ] 768px
- [ ] 1024px
- [ ] 1440px
- [ ] 1920px

Reference: `layout-and-spacing.md`.

---

## 5. Interaction States Audit

For every interactive element:

- [ ] Default state exists.
- [ ] Hover state exists where pointer interaction applies.
- [ ] Focus-visible state exists and is obvious.
- [ ] Active/pressed state exists.
- [ ] Disabled state exists where action can be unavailable.
- [ ] Loading state preserves layout.
- [ ] Error state explains recovery.
- [ ] Success state confirms the actual outcome.
- [ ] Empty state explains what happened and what to do next.

Keyboard:

- [ ] Tab order follows visual order.
- [ ] Escape dismisses dismissible overlays.
- [ ] Focus is trapped inside modal dialogs.
- [ ] Focus returns to the invoking control after close.
- [ ] Touch targets are at least 44px × 44px.

Reference: `interaction-states.md`.

---

## 6. Motion & Performance Audit

- [ ] Motion has a purpose: continuity, causality, or hierarchy.
- [ ] Micro-interactions are <= 150ms.
- [ ] Macro transitions are <= 300ms unless justified.
- [ ] No routine animation exceeds 500ms.
- [ ] Animations use transform and opacity where possible.
- [ ] `prefers-reduced-motion` is respected.
- [ ] No infinite decorative motion near reading content.
- [ ] CLS remains below 0.1.
- [ ] Animations do not visibly drop frames.

Reference: `motion.md`.

---

## 7. Accessibility Audit

- [ ] Landmarks are present: header/nav/main/footer where appropriate.
- [ ] Interactive controls use semantic elements.
- [ ] Images have meaningful alt text or are marked decorative.
- [ ] Forms have labels and error associations.
- [ ] ARIA is used only when native HTML is insufficient.
- [ ] Screen-reader order matches visual order.
- [ ] No keyboard trap exists outside intentional modal focus traps.
- [ ] Axe-core has 0 critical issues.

Target:

- Critical: 0
- Serious: 0 preferred
- Moderate: <= 2 with documented rationale

---

## 8. Lighthouse / Production Targets

Minimum targets before harden:

| Category | Target |
|---|---:|
| Performance | >= 90 |
| Accessibility | >= 90 |
| Best Practices | >= 90 |
| SEO | >= 90 where applicable |

If a score misses target, record whether the cause is essential complexity or accidental complexity.

---

## Allura-Specific Validation

### Graph Page (ForceGraph2D)
- [ ] Canvas renders at 60fps with 100+ nodes.
- [ ] Interaction states (hover/selected) are visually distinct.
- [ ] Empty state displays when no connections exist.
- [ ] Loading skeleton matches card dimensions exactly.

### Review Page
- [ ] Evidence tree expand/collapse animations smooth.
- [ ] No keyboard trap in tree navigation.
- [ ] Loading state displays "loading evidence graph..." with context.

### Evidence Detail Page
- [ ] All relationships appear in sidebar.
- [ ] Metadata displays at 15px+ size (mobile).
- [ ] Empty state: "No relationships found for this memory."

### Memory Cards
- [ ] Card expand/collapse maintains vertical rhythm.
- [ ] Loading skeleton matches card dimensions.
- [ ] Hover/focus states are distinct and accessible.

---

## Final Decision

```markdown
## Final Decision

- Overall: PASS / FAIL
- Critical blockers:
  - ...
- Quick wins:
  - ...
- Approved for polish: yes/no
- Approved for harden: yes/no
- Notes:
```

Do not polish around blockers. Fix the root cause first.

---

## Token Authority

**In HTML/JSX+Tailwind**: Use `var(--allura-blue) etc.` CSS custom properties.

**In Canvas 2D/JS**: Use `tokens.ts` imports.

**Never**: Raw hex values, generic shadcn color utilities (`bg-muted`, `text-muted-foreground`).
