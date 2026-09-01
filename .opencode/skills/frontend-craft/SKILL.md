---
name: frontend-craft
description: >
  Professional-grade frontend development with Brooksian conceptual integrity.
  Shape → Explore → Select → Systematize → Build → Audit → Polish → Harden.
  Huashu Design (HTML-native prototypes) meets Impeccable (audit polish harden).
  Allura Memory variant: Next.js App Router + Tailwind CSS + ForceGraph2D.
compatibility: opencode
metadata:
  audience: frontend-developers
  workflow: frontend-craft
  pattern: shape-explore-select-systematize-build-audit-polish-harden
  allura-stack: nextjs-app-router, tailwindcss, forcegraph2d
---

# Frontend Craft · Brooksian Frontend Workflow (Allura Memory Variant)

## Conceptual Integrity

Frontend Craft is not a UI library. It is a **process membrane** enforcing Fred Brooks' principle of conceptual integrity through deliberate, staged workflows.

- **What it does**: Enforces Shape → Explore → Select → Systematize → Build → Audit → Polish → Harden sequence
- **What it does not do**: Skips phases, guesses requirements, violates design-system contracts
- **Invariant**: No build starts before direction sign-off; no polish without audit checklist

## Phase 1: Shape (Clarify Intent)

### Command: `/frontend-craft shape`

```bash
/frontend-craft shape
```

### What happens:

1. Ask user: "What are you building? What does success look like?"
2. Capture: Project name, primary goal, success metric, Constraints (timeline, tech, brand)
3. Output: `.frontend-craft/shape.md` with:
   ```markdown
   ## Shape
   - Project: [name]
   - Goal: [one sentence]
   - Success: [measurable outcome]
   - Constraints: [timeline, tech stack, brand requirements]
   ```

### Brooks Law: "If you have a job to do, and you don't know how to do it, you have to learn."

> Don't build until you can answer: "What problem are you solving, and how will you know it's fixed?"

## Phase 2: Explore (Research & Reference)

### Command: `/frontend-craft explore`

```bash
/frontend-craft explore
```

### What happens:

1. Search Brain for `design-system`, `brand-spec`, `typography`, `color-palette`, `layout-guide`
2. Search codebase for `tailwind.config.js`, `src/lib/tokens.ts`, `src/styles/brand-tokens.css`, `src/styles/presets/allura.css`
3. Identify starting assumptions and avoid reinventing wheel

### Output: `.frontend-craft/explore.md` with:
```markdown
## Explore
- Brain assets found: [N items]
- Existing tokens: [yes/no, path]
- Starting assumptions:
  - [3-5 bullet points of assumptions to validate]
- References:
  - [list of URLs or file paths]
- Rejection candidates:
  - [patterns to avoid based on search findings]
```

## Phase 3: Select (Choose One Direction)

### Command: `/frontend-craft select`

```bash
/frontend-craft select
```

### What happens:

1. Load `references/design-directions.md` from this skill
2. Present **exactly three** directions:
   - **A. Professional Data** — clean, authoritative, data-forward (Bloomberg Terminal meets Notion)
   - **B. Warm Cognitive** — coral + gold accents, friendly but serious (Stripe Dashboard warmth)
   - **C. Eastern Minimalism** — extreme reduction, let the data breathe (Kenya Hara)
3. User **must select one direction**; reject others explicitly
4. Document reasoning: "Chose X because [constraints, audience, success metric]"

### Output: `.frontend-craft/select.md` with:
```markdown
## Selected Direction
- Choice: [A/B/C + name]
- Rejected:
  - [Direction 1]: Why not (based on constraints)
  - [Direction 2]: Why not (based on constraints)
- Rationale: [2-3 sentences, tied to success metric]
- Design tokens to preserve: [from brand specs]
```

### Brooks Law: "The absence of constraints breeds mediocrity. Good design is achieved through constraints."

> **No "let's try both approaches" allowed. Choose one direction, commit, iterate.**

## Phase 4: Systematize (Create Design System)

### Command: `/frontend-craft systematize`

```bash
/frontend-craft systematize
```

### What happens:

1. Load reference files from `.opencode/skills/frontend-craft/references/`:
   - `typography.md` → font scale, line-height, heading hierarchy
   - `color-and-contrast.md` → accessible palette, semantic roles
   - `layout-and-spacing.md` → 8px grid, component spacing scale
   - `interaction-states.md` → hover/focus/active/disabled states
2. Validate tokens against `src/lib/tokens.ts` and `src/styles/brand-tokens.css`
3. Create `.frontend-craft/tokens.md` with token usage guidelines

### Token Authority (CRITICAL INVARIANT)

**All token consumption must use the Allura token system — never raw hex values or generic shadcn color utilities. Two paths are authoritative:**

**Path 1 — HTML/JSX + Tailwind (preferred for component styling):**
- Use `bg-[var(--allura-blue) etc.]`, `text-[var(--dashboard-text-primary) etc.]`, `border-[var(--tone-blue-bg) etc.]` in Tailwind className strings
- CSS custom properties (`var(--allura-blue) etc.`, `var(--dashboard-text-primary) etc.`, `var(--tone-blue-bg) etc.`) defined in `brand-tokens.css` and `allura.css` ARE the token system for Tailwind contexts
- ✅ CORRECT: `className="bg-[var(--allura-cream)] text-[var(--allura-charcoal)]"`
- ❌ WRONG: `style={{ backgroundColor: 'var(--allura-cream)' }}` — inline `var()` in `style={{}}` is prohibited

**Path 2 — Canvas 2D / JS-only contexts (where CSS vars cannot be consumed):**
- Use `tokens.ts` imports: `tokens.color.primary.default`, `tokens.color.graph.edge`, `tokens.shadow.sm`
- Required for ForceGraph2D canvas rendering, dynamic calculations, or any JS context without DOM access
- ✅ CORRECT: `const color = tokens.color.graph.edge`
- ❌ WRONG: `"#9CA3AF"` — raw hex in JS code

**Prohibitions (automatic audit fail):**
- No raw hex values in component code (`#FF5A2E`, `#1D4ED8`, etc.) — neither in JSX nor in JS
- No generic shadcn color utilities (`bg-muted`, `text-muted-foreground`) without Allura token mapping
- No inline `style={{ backgroundColor: 'var(--...)' }}` — use Tailwind `bg-[var(--allura-blue) etc.]` class syntax instead

**Known exception:** Shadow rgba values in cva template literals (`button.tsx`) require literal strings due to Tailwind+cva build constraints. Documented as DD-004.

### Token Paths (Allura Architecture)
- `tokens.ts` is at `src/lib/tokens.ts`
- `brand-tokens.css` is at `src/styles/brand-tokens.css`
- `allura.css` is at `src/styles/presets/allura.css`

### Output: `.frontend-craft/tokens.md` with:
```markdown
## Allura Token Authority
- Path 1 (Tailwind/HTML): `bg-[var(--allura-blue) etc.]` class syntax
- Path 2 (Canvas/JS): `import { tokens } from '@/lib/tokens'`
- No hardcoded hex colors in component code
- No inline `style={{ var() }}` — use Tailwind class syntax
- No generic shadcn color utilities (`bg-muted`, `text-muted-foreground`)
- Exception: cva shadow rgba values (DD-004 documented limitation)

## Brand Tokens (Allura)
- Primary: #1D4ED8 (blue)
- Secondary/Coral: #FF5A2E
- Success: #157A4A
- Accent Gold: #C89B3C
- Surface default: #FFFFFF
- Surface subtle: #F6F4EF
- Text primary: #0F1115
- Text secondary: #6B7280

## Typography (Allura)
- Body: IBM Plex Sans (primary)
- Code/Data: IBM Plex Mono (evidence/logs)
- No Montserrat or Inter references (Allura uses IBM Plex Sans + IBM Plex Mono only)

## Spacing (8px base)
--allura-xs: 4px
--allura-sm: 8px
--allura-md: 12px
--allura-lg: 16px
--allura-xl: 24px
--allura-xxl: 32px
--allura-xxxl: 48px

## Radius Tokens
--allura-r-sm: 4px
--allura-r-md: 8px
--allura-r-lg: 12px
--allura-r-full: 999px

## Shadow Tokens
--allura-sh-sm: 0 1px 2px rgba(15,17,21,.05)
--allura-sh-md: 0 4px 6px -1px rgba(15,17,21,.10),0 2px 4px -2px rgba(15,17,21,.10)
--allura-sh-lg: 0 18px 40px rgba(15,17,21,.14)

## Semantic Aliases (from brand-tokens.css)
- --dashboard-text-primary: var(--allura-charcoal)
- --dashboard-text-secondary: var(--allura-gray-500)
- --dashboard-success: var(--allura-green)
- --dashboard-accent: var(--allura-orange)
```

## Phase 5: Build (Implement with Huashu Design)

### Command: `/frontend-craft build`

```bash
/frontend-craft build
```

### What happens:

1. If `huashu-design` is available, use it for HTML-native high-fidelity prototype workflow; otherwise apply the same prototype discipline locally
2. Follow **Junior Designer Workflow**:
   - Start with **assumptions + placeholders + reasoning**
   - Never "just make it look good" without placeholders marked for review
3. Use **Tweaks** to generate 2-3 variations within selected direction
4. Generate **Speaker Notes** explaining design decisions

### Huashu Design Integration:

| Frontend Craft Phase | Huashu Design Action |
|---|---|
| Select → Build | Junior Designer: assumptions/placeholder/reasoning |
| Systematize → Build | React+Babel tokens, design system compliance |
| Build (initial) | HTML high-fidelity prototype |
| Build (iteration) | Tweaks to generate variation +Speaker Notes |

### Output: `.frontend-craft/build/` with:
```
build/
├── prototype.html          # H5 prototype with correct semantic HTML
├── source.hx               # Huashu Design .hx source (for Tweaks)
├── speaker-notes.md        # Design rationale for each major component
└── variation-1.html        # First variation (alternative)
```

## Phase 6: Audit (Impeccable Review)

> **Audit Boundary:** This skill's audit (`/frontend-craft audit`) checks **implementation quality** — are we token-compliant, a11y-compliant, motion-safe, and interaction-complete? For brand alignment (are we on-brand, on-direction?), use `$frontend-design audit` from the `frontend-design` skill. The two audits are complementary, not redundant.

### Command: `/frontend-craft audit`

```bash
/frontend-craft audit
```

### What happens:

1. Load `.opencode/skills/frontend-craft/references/review-checklist.md`
2. Run **5-phase audit**:
   - **Phase 1: Typography Audit** (font scale, line-height, hierarchy)
   - **Phase 2: Color & Contrast Audit** (WCAG AA/AAA, semantic clarity)
   - **Phase 3: Layout & Spacing Audit** (8px grid, rhythm consistency)
   - **Phase 4: Interaction States Audit** (hover, focus, active, disabled, empty, error)
   - **Phase 5: Motion & Performance Audit** (subtlety, FPS, layout shifts)
3. Record findings in `.frontend-craft/audit.md`

### Color & Contrast Audit (Allura-Specific Examples)

Use **Allura token names and contrast ratios** for audit entries:

- **Primary Blue (#1D4ED8)**: Must achieve 4.5:1 against white (#FFFFFF), 7.5:1 against pure black
- **Coral (#FF5A2E)**: Must achieve 3:1 against white, 4.5:1 against dark surfaces (#F3F4F6)
- **Success Green (#157A4A)**: Must achieve 4.5:1 against white, 7:1 against dark surfaces
- **Gold Accent (#C89B3C)**: Must achieve 3:1 against white, 4.5:1 against subtle surface (#F6F4EF)

**Checklist items:**
- [ ] `tokens.color.primary.default` used instead of hardcoded `#1D4ED8`
- [ ] `tokens.color.secondary.default` used instead of `#FF5A2E`
- [ ] `tokens.color.success.default` used instead of `#157A4A`
- [ ] `tokens.color.accent.gold` used instead of `#C89B3C`
- [ ] All interactive states (hover, focus, active) use token-derived values

### Anti-Patterns (from `anti-patterns.md`):

1. "Just make it look good" without direction selection
2. Using `!important` for overrides (design system debt)
3. Hardcoded colors instead of semantic tokens (e.g., `bg-blue-600` without token indirection)
4. Missing hover/focus/active states for interactive elements
5. "It works on my machine" (no responsive viewport testing)
6. "We'll fix accessibility later" (WCAG audit must pass before polish)
7. Excessive motion (animation should be 10-20% of load budget)
8. "Close enough" spacing (every spacing value must be from 8px scale)
9. **Token violations**: Direct hex colors in TSX, shadcn color utilities (`bg-muted`, `text-muted-foreground`)

### Output: `.frontend-craft/audit.md` with:
```markdown
## Audit Results

### Typography
- [ ] Font scale compliance: [pass/fail]
- [ ] Line-height readability: [pass/fail]
- [ ] Heading hierarchy: [pass/fail]
- Fixes: [list]

### Color & Contrast
- [ ] WCAG AA compliance: [yes/no]
- [ ] Semantic roles distinct: [yes/no]
- [ ] Error state clarity: [yes/no]
- [ ] Token Authority compliance: [yes/no]
- Fixes: [list]

### Layout & Spacing
- [ ] 8px grid adherence: [pass/fail]
- [ ] Component rhythm consistency: [pass/fail]
- [ ] Responsive container constraints: [pass/fail]
- Fixes: [list]

### Interaction States
- [ ] Focus visible on all interactive elements: [yes/no]
- [ ] Hover states on buttons/forms: [yes/no]
- [ ] Active/disabled states: [yes/no]
- [ ] Empty/error states: [yes/no]
- Fixes: [list]

### Motion & Performance
- [ ] Animation FPS target met: [yes/no]
- [ ] Layout shifts < 0.1 per interaction: [yes/no]
- [ ] Animation duration < 300ms: [yes/no]
- Fixes: [list]

### Overall: [PASS / FAIL]
- Critical blockers: [list]
- Quick wins: [list]
```

## Phase 7: Polish (Harden Quality)

### Command: `/frontend-craft polish`

```bash
/frontend-craft polish
```

### What happens:

1. Fix **all critical blockers** and **quick wins** from audit
2. Perform the polish checklist manually or with project-local commands:
   - Validate token usage (`tokens.ts` imports only, no hardcoded hex)
   - Check token authority compliance (no shadcn color utilities)
   - Check font loading (FOUT/FOIT control)
   - Verify focus traps in modals
   - Test keyboard navigation through all interactive flows
   - Run the project's configured accessibility/performance checks when present

3. If Playwright is already available in the project, run the project's existing Playwright command against key viewports. Do not install new dependencies from this skill.

4. Update implementation/prototype files with all fixes

### Output: `.frontend-craft/polished/prototype.html`

## Phase 8: Harden (Production-Ready)

### Command: `/frontend-craft harden`

```bash
/frontend-craft harden
```

### What happens:

1. **Contract Hardening**:
   - Verify `src/lib/tokens.ts` exports match component usage
   - Export tokens to `design-tokens.json` for engineering handoff
   - Generate CSS custom properties file for teams
   - Create React component storybook (if applicable)

2. **Accessibility Hardening**:
   - Run axe-core audit (target: 0 critical, < 2 moderate)
   - Verify screen reader navigation order
   - Add ARIA labels to landmark regions

3. **Responsive Hardening**:
   - Test across 5 breakpoints: 320px, 768px, 1024px, 1440px, 1920px
   - Verify touch targets ≥ 44px
   - Check font scaling on mobile

4. **Performance Hardening**:
   - Audit critical CSS (inlined vs deferred)
   - Verify lazy loading for images
   - Run Lighthouse or the project's equivalent audit if available (target: performance ≥ 90, accessibility ≥ 90, SEO ≥ 90, PWA ≥ 80 when applicable)

### Output: `.frontend-craft/hardened/` with:
```
hardened/
├── design-tokens.json      # JSON for engineering
├── css-variables.css       # CSS module export
├── a11y-report.html        # Axe Core audit
├── responsive-test.csv     # 5 breakpoints test results
├── lighthouse-audit.json   # Lighthouse scores
└── prod-ready-checklist.md # Sign-off document
```

## Commands Summary

| Command | Purpose | When to Use |
|---|---|---|
| `/frontend-craft shape` | Clarify intent | Start of any frontend project |
| `/frontend-craft explore` | Research & reference | After shaping, before selection |
| `/frontend-craft select` | Choose one direction | After exploration, before systematization |
| `/frontend-craft systematize` | Create design system | After direction selection |
| `/frontend-craft build` | Implement with Huashu Design | After tokens finalized |
| `/frontend-craft audit` | 5-phase scrutiny | After initial build |
| `/frontend-craft polish` | Fix blocks + quick wins | After audit review |
| `/frontend-craft harden` | Production handoff | After polish, before deploy |

## Directory Structure

```
.frontend-craft/
├── shape.md                # Phase 1 output
├── explore.md              # Phase 2 output
├── select.md               # Phase 3 output
├── tokens.md               # Phase 4 output
├── build/
│   ├── prototype.html      # Phase 5 output (initial)
│   ├── source.hx           # Huashu Design source
│   └── speaker-notes.md    # Design rationale
├── audit.md                # Phase 6 output
├── polished/
│   └── prototype.html      # Phase 7 output
├── hardened/
│   ├── design-tokens.json  # Phase 8 engineering artifact
│   ├── css-variables.css
│   ├── a11y-report.html
│   ├── responsive-test.csv
│   ├── lighthouse-audit.json
│   └── prod-ready-checklist.md
└── references/
    ├── anti-patterns.md
    ├── design-directions.md
    ├── typography.md
    ├── color-and-contrast.md
    ├── layout-and-spacing.md
    ├── interaction-states.md
    ├── motion.md
    └── review-checklist.md
```

## Team RAM Routing

| User Intent | Primary Agent | Secondary Agent | Skill(s) |
|---|---|---|---|
| "build frontend / make a page / create UI" | Woz (builder) | — | Frontend Craft (full flow) |
| "review this design / give feedback" | Pike (interface) | — | Frontend Craft (audit only) |
| "design system / tokens / brand spec" | Brooks (architect) | Pike (review) | Frontend Craft (shapes 1-4) |
| "polish / harden / production ready" | Woz (builder) | Hightower (infra) | Frontend Craft (polish/harden) |
| "improve accessibility / WCAG" | Pike (interface) | — | Frontend Craft (audit phase) |
| "performance / lighthouse / speed" | Bellard (performance) | Woz (builder) | Frontend Craft (harden phase) |

**Note on Allura-specific routing:**
- **Brooks** and **Pike** handle design-direction selection (Phase 3: Select)
- **Woz** handles the build (Phases 1, 4, 5, 7, 8)
- **Fowler** handles audit and refactor safety (Phase 6: Audit)

## Invariants

1. **Shape first** — No build without clarity of intent
2. **One direction only** — No "try both" allowed; choose A, B, or C
3. **Tokens before code** — No hardcoded colors; no inline `style={{ var() }}` without Tailwind class
4. **Token Authority** — Two paths: `bg-[var(--allura-blue) etc.]` for Tailwind/HTML, `tokens.ts` for Canvas/JS; no raw hex, no generic shadcn colors without mapping
5. **Audit before polish** — 5-phase audit must pass before polish
6. **Polish before harden** — Quick wins + critical fixes must be in before production handoff
7. **No smart quotes in code** — Use `&quot;` or template literals for HTML attributes
8. **Responsive testing** — No desktop-first mindset; test at 320px width

## References

- `references/` — bundled audit checklists and design standards
- Optional: `huashu-design` skill — HTML-native prototype workflow when installed
- Optional: `code-review` skill — implementation review when installed
- Optional: local agent routing docs such as `AGENTS.md` or `.opencode/AGENTS.md` when present
- **Allura-specific tokens**:
  - `src/lib/tokens.ts` — semantic color/token definitions
  - `src/styles/brand-tokens.css` — CSS custom property definitions
  - `src/styles/presets/allura.css` — shadcn compatibility preset

## Author & License

**Created by:** Team RAM (Brooks, Woz, Pike, Hightower, Bellard)  
**License:** Apache 2.0  
**Version:** v1.0.1 - Allura Memory Variant (Next.js App Router + Tailwind CSS + ForceGraph2D)

> "The quality of the design is inversely proportional to the number of meetings held about the design."
> — The Mythical Man-Month
