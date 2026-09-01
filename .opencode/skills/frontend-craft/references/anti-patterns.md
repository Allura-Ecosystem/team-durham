# Anti-Patterns · Frontend Craft Audit

These anti-patterns are **not allowed** during any phase of the Frontend Craft workflow. Each triggers a FAIL in the audit phase.

---

## 1. Intent Anti-Patterns (Shape & Explore)

### ❌ "Just make it look good"
- **What it looks like**: User provides no concrete goal, success metric, or constraints
- **Why it fails**: Builds without direction create design debt and rework
- **Fix required**: Run `/frontend-craft shape` to capture explicit intent
- **Red flag**: No "success" criteria defined

### ❌ "Do what you think"
- **What it looks like**: Delegate without boundaries; no brand spec search
- **Why it fails**: Creates inconsistent design that conflicts with existing systems
- **Fix required**: Run `/frontend-craft explore` to search Brain for design tokens
- **Red flag**: "I don't know" in place of constraints

---

## 2. Direction Anti-Patterns (Select)

### ❌ "Let's try both approaches"
- **What it looks like**: User wants to build two directions, compare, then choose
- **Why it fails**: Violates Fred Brooks' "conceptual integrity" principle
- **Fix required**: Choose exactly one direction (A, B, or C); document why not the others
- **Red flag**: "I'll pick the better one after I see both"

### ❌ "Generic modern" / "Trendy" / "Like [Competitor]"
- **What it looks like**: Direction selection based on aesthetic preference, not constraints
- **Why it fails**: Aesthetic alone cannot guide technical decisions
- **Fix required**: Re-select with explicit tie to project constraints
- **Red flag**: "It looks cool" as primary justification

---

## 3. Token Anti-Patterns (Systematize)

### ❌ Hardcoded Colors
- **What it looks like**: `#2563eb` inline in HTML/CSS instead of `var(--color-primary)`
- **Why it fails**: Makes design-system updates require code changes, not style updates
- **Fix required**: Replace all color values with CSS custom properties
- **Red flag**: Search for `#` or `rgb(` in production files

### ❌ Using `!important` for Overrides
- **What it looks like**: `background-color: #fff !important;`
- **Why it fails**: Creates cascade debt; design system contracts become unenforceable
- **Fix required**: Refactor to proper specificity or extend token with semantic name
- **Red flag**: `grep -r "!important" src/`

### ❌ Inconsistent Spacing Values
- **What it looks like**: Mix of `10px`, `12px`, `14px`, `15px` for similar spacing needs
- **Why it fails**: Breaks 8px grid; creates visual noise
- **Fix required**: Refactor to use only tokens from `--space-1` through `--space-6`
- **Red flag**: Spacing values not multiples of 4px

---

## 4. Implementation Anti-Patterns (Build)

### ❌ "Just make it work, I'll refactor later"
- **What it looks like**: Temporarily hardcoded values, placeholder classes, inline styles
- **Why it fails**: Technical debt compounds; "later" never comes
- **Fix required**: Implement with tokens from Day 1, even if copied from existing system
- **Red flag**: `TODO:` comments in production code

### ❌ Missing Interaction States
- **What it looks like**: Buttons only have default and hover; no focus, active, disabled, error states
- **Why it fails**: Accessibility violation and inconsistent UX
- **Fix required**: Implement all interaction states per `references/interaction-states.md`
- **Red flag**: `:hover` exists but `:focus-visible`, `:active`, `:disabled` do not

### ❌ Semantic HTML Violations
- **What it looks like**: `div` with `role="button"`, links without `href`, missing `aria-label`
- **Why it fails**: Screen reader users cannot navigate; SEO penalty
- **Fix required**: Use semantic elements (`button`, `a`, `nav`, `main`) with correct attributes
- **Red flag**: Tools like axe-core flag "generic click handler" or "missing link context"

---

## 5. Audit Anti-Patterns (Audit Phase)

### ❌ "It works on my machine"
- **What it looks like**: No responsive testing, no cross-browser check
- **Why it fails**: User base uses varied devices and browsers
- **Fix required**: Test at 5 breakpoints (320px, 768px, 1024px, 1440px, 1920px)
- **Red flag**: "I use Chrome, it's fine"

### ❌ "We'll fix accessibility later"
- **What it looks like**: WCAG audit pending "Phase 2"
- **Why it fails**: Accessibility debt is harder to fix than architectural debt
- **Fix required**: Pass WCAG AA audit before polish phase
- **Red flag**: axe-core results show "critical" violations

### ❌ ignoring Lighthouse Performance
- **What it looks like**: No performance budget, no Core Web Vitals tracking
- **Why it fails**: Performance is user experience; slow sites lose users
- **Fix required**: Lighthouse ≥ 90 for performance, accessibility, SEO
- **Red flag**: Largest Contentful Paint > 2.5s

---

## 6. Polish & Harden Anti-Patterns

### ❌ "Almost done" Shipping
- **What it looks like**: Rushing to deploy without polish or harden phase
- **Why it fails**: Production bugs damage trust; harder to fix in production
- **Fix required**: Complete polish (fix blocks/quick wins) and harden (a11y/perf/responsive)
- **Red flag**: "We'll ship and iterate in prod"

### ❌ Missing Production Sign-Off
- **What it looks like**: No `prod-ready-checklist.md` signed off by Woz and Pike
- **Why it fails**: No accountability for production quality
- **Fix required**: Complete harden phase, generate sign-off checklist
- **Red flag**: No checklist or electronic signature

---

## Audit Quick-Check: Red Flags

Run this search in your editor:

```bash
# Intent
git grep -i "just make it look good" src/
git grep -i "do what you think" src/

# Tokens
git grep -E "#[0-9a-fA-F]{3,6}" src/ | grep -v "color-palette.md"
git grep -E "!important" src/

# Interactions
git grep -E "button|:hover|\.click" src/ | grep -v ":focus-visible\|:active\|:disabled"

# Accessibility
git grep -E "role=|aria-" src/ | grep -v "aria-label\|aria-hidden\|aria-expanded"

# Performance
git grep -E "lighthouse\|core web vitals\|cwv" src/
```

If any result exists that isn't in a reference document: **FAILED AUDIT**.

---

## Token Authority

**In HTML/JSX+Tailwind**: Use `var(--allura-blue) etc.` CSS custom properties.

**In Canvas 2D/JS**: Use `tokens.ts` imports.

**Never**: Raw hex values, generic shadcn color utilities (`bg-muted`, `text-muted-foreground`).

Token authority is non-negotiable. The design system contracts are enforced at the token layer, not at the implementation layer.
