# Design Directions · Frontend Craft Select Phase

Choose **exactly one** direction. Reject the others explicitly.

---

## Direction A: Minimalist Modern (Pentagram Information Architecture)

### Philosophy
> "Information architecture is the art of organizing complexity to reveal clarity."

- **Primary Influence**: Pentagram's information design (Michael Bierut, Paula Scher)
- **Core Principle**: "Information hunger" — users want facts, not fluff
- **Design Mantra**: "Reduce until it breaks, then add one thing back"

### Visual Characteristics
- **Typography**: Sans-serif (IBM Plex Sans,-system-ui) at 16px base; strict 1.5 line-height
- **Color**: Dark text on light background; neutral palette with **one** accent color
- **Layout**: 8px grid, generous whitespace, strict columnar alignment
- **Imagery**: High-fidelity photography or illustration; never AI-generated placeholders

### Interaction Patterns
- **Hover**: 10% opacity change or underline (text) or scale 1.02 (buttons)
- **Focus**: Consistent `:focus-visible` outline (4px, accent color)
- **Active**: Press effect (transform: translateY(1px)) for buttons and form inputs
- **Transitions**: 150ms ease-out for all interactions (never longer)

### When to Choose This Direction
1. Your project is **information-dense** (dashboards, documentation, SaaS)
2. Your audience values **clarity over entertainment** (enterprise, academic, professional)
3. You need to **scale to 50+ pages** without design debt
4. Your brand is **measured, not emotional** (finance, legal, healthcare)

### When to Reject This Direction
- ❌ You need to evoke **emotion** (marketing, entertainment, social)
- ❌ Your audience is **mobile-first** and needs **gesture-first** design
- ❌ You're building a **brand experience** (products, services, personal brands)

### Design Tokens (Direction A)
```css
:root {
  /* Font: IBM Plex Sans,-system-ui; 14-18px max for headers */
  --font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 40px;
  
  /* Line Height: Strict 1.5 for body, 1.25 for headers */
  --line-height-body: 1.5;
  --line-height-heading: 1.25;
  
  /* Spacing: 8px base */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  
  /* Color: Neutral with one accent */
  --color-primary: #1D4ED8; /* Allura Blue */
  --color-primary-muted: #DBEAFE;
  --color-secondary: #475569; /* Slate-600 */
  --color-background: #ffffff;
  --color-surface: #F6F4EF; /* Allura Surface Subtle */
  --color-text: #0F1115; /* Allura Text Primary */
  --color-text-muted: #64748b; /* Slate-500 */
  --color-error: #DC2626;
  --color-success: #157A4A;
  --color-warning: #C89B3C;
  
  /* Interaction */
  --transition-duration: 150ms;
  --transition-ease: ease-out;
}
```

---

## Direction B: Expressive Playful (Sagmeister Experimental)

### Philosophy
> "Design should provoke, not just please."

- **Primary Influence**: Stefan Sagmeister's experimental design (SAGS, OKAY
- **Core Principle**: "Joyful interfaces" — interaction as delight
- **Design Mantra**: "If it doesn't make someone smile, it's not finished"

### Visual Characteristics
- **Typography**: Sans-serif (IBM Plex Sans) with **variable font** support; playful but legible
- **Color**: **Two** accent colors + vibrant primary; high-saturation palette
- **Layout**: Asymmetric grid, intentional "imperfections," whitespace used as whitespace
- **Imagery**: Hand-drawn illustrations, textured backgrounds, micro-animations

### Interaction Patterns
- **Hover**: Scale 1.05, rotate 1-3 degrees, or color shift
- **Focus**: Bouncy outline (scale animation) or glow effect
- **Active**: "Squish" effect (scale 0.95, then spring back)
- **Transitions**: 200-300ms ease-out with spring physics (cubic-bezier(0.34, 1.56, 0.64, 1))

### When to Choose This Direction
1. Your project is **experience-first** (marketing, entertainment, personal brands)
2. Your audience is **mobile-native** and values **playful** interactions
3. You need to **stand out** in a crowded category (competitive differentiation)
4. Your brand is **bold, not measured** (startups, agencies, creators)

### When to Reject This Direction
- ❌ You're building **enterprise software** where clarity beats creativity
- ❌ Your audience needs **accessibility first** (WCAG AA is non-negotiable)
- ❌ You have **deadline constraints** — playful interfaces take 2-3× effort to polish
- ❌ Your project is **data-heavy** — playful UI obscures information

### Design Tokens (Direction B)
```css
:root {
  /* Font: IBM Plex Sans, system-ui; variable font weights 100-700 */
  --font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-bold: 600;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 22px;
  --font-size-2xl: 28px;
  --font-size-3xl: 36px;
  --font-size-4xl: 48px;
  
  /* Line Height: 1.4 for body, 1.1 for headers (playful, not rigid) */
  --line-height-body: 1.4;
  --line-height-heading: 1.1;
  
  /* Spacing: 8px base, but "imperfect" application */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  
  /* Color: Vibrant + playful gradient (primary + one accent) */
  --color-primary: #6366f1; /* Indigo-500 */
  --color-primary-gradient: linear-gradient(135deg, #6366f1, #ec4899);
  --color-secondary: #8b5cf6; /* Violet-500 */
  --color-accent: #ec4899; /* Pink-500 */
  --color-background: #faf5ff; /* Violet-50 */
  --color-surface: #fdf2f8; /* Pink-50 */
  --color-text: #1e1b4b; /* Indigo-900 */
  --color-text-muted: #6366f1;
  --color-error: #f43f5e;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  
  /* Interaction: Spring physics */
  --transition-duration: 250ms;
  --transition-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Direction C: 东方极简 Eastern Minimalism (Kenya Hara)

### Philosophy
> "Designing the absence, not the presence."

- **Primary Influence**: Kenya Hara's "Husm" (Husmu), muji philosophy
- **Core Principle**: "Less but better" — reduction as clarity
- **Design Mantra**: "The white space is the design"

### Visual Characteristics
- **Typography**: Sans-serif (IBM Plex Sans) with **high x-height**; clean, readable at small sizes
- **Color**: **Grayscale primary** with **one** muted accent; negative space > content
- **Layout**: Generous whitespace, strict grid, "呼吸感" (breathing room) between elements
- **Imagery**: Photographs or illustrations in **one color only** (grayscale or single hue)

### Interaction Patterns
- **Hover**: Subtle background shift (5% opacity change) or icon animation
- **Focus**: Minimal outline (1px, same color as text)
- **Active**: No visual change (interaction feedback is auditory or haptic)
- **Transitions**: 100ms ease-in-out (subtle, not noticeable)

### When to Choose This Direction
1. Your project is **content-first** (books, essays, meditation, arts)
2. Your audience values **calm, not stimulation** (mindfulness, education, wellness)
3. You need to **reduce cognitive load** (decision fatigue, information overload)
4. Your brand is **quiet luxury** (premium goods, services, experiences)

### When to Reject This Direction
- ❌ You need to **guide users through complex workflows** (minimalism confuses)
- ❌ Your audience is **mobile-first** and needs **high affordance** (too subtle)
- ❌ You're building **B2B SaaS** where users need clear pathways
- ❌ Your project is **time-sensitive** — eastern minimalism requires refinement time

### Design Tokens (Direction C)
```css
:root {
  /* Font: IBM Plex Sans, system-ui; high x-height for readability */
  --font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-semibold: 500;
  --font-size-base: 16px;
  --font-size-lg: 17px;
  --font-size-xl: 19px;
  --font-size-2xl: 23px;
  --font-size-3xl: 31px;
  --font-size-4xl: 41px;
  
  /* Line Height: 1.7 for body (breathing room), 1.3 for headers */
  --line-height-body: 1.7;
  --line-height-heading: 1.3;
  
  /* Spacing: 8px base, but larger "white space" components */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px; /* Extra breathing room */
  
  /* Color: Grayscale with muted accent */
  --color-primary: #000000; /* Pure black */
  --color-primary-muted: #f5f5f5; /* Gray-100 */
  --color-secondary: #333333; /* Gray-700 */
  --color-accent: #7c7c7c; /* Gray-500 */
  --color-background: #ffffff;
  --color-surface: #fafafa;
  --color-text: #000000;
  --color-text-muted: #666666;
  --color-error: #8b0000;
  --color-success: #006400;
  --color-warning: #b8860b;
  
  /* Interaction: Minimalism — barely perceptible */
  --transition-duration: 100ms;
  --transition-ease: ease-in-out;
}
```

---

## Selection Protocol

### Step 1: Read Each Direction's Philosophy
Ask: "Does this align with **my project's core purpose**?"

### Step 2: Rate Each Direction (1-10)
- **Clarity score**: How well does this direction support my success metric?
- **Constraints score**: How well does this direction fit my timeline, team, and talent?
- **Brand score**: How well does this direction match my brand voice?

### Step 3: Choose One, Reject Others
**Never** say "I'll start with A and try B later." Pick one; commit; iterate in place.

---

## Selection Template

```markdown
## Selected Direction: [A/B/C]
- Name: [Minimalist Modern / Expressive Playful / Eastern Minimalism]
- Chosen because: [2-3 sentences tying to project constraints]
- Reject A: [Reason for rejecting Direction A]
- Reject B: [Reason for rejecting Direction B]
- Design tokens: [Link to tokens.md or paste CSS variables]
```

---

## Token Authority

**In HTML/JSX+Tailwind**: Use `var(--allura-blue) etc.` CSS custom properties.

**In Canvas 2D/JS**: Use `tokens.ts` imports.

**Never**: Raw hex values, generic shadcn color utilities (`bg-muted`, `text-muted-foreground`).
