---
name: accessibility-aaa
description: WCAG AAA compliance checking with Brain-backed pattern matching. Targets 7:1 contrast ratios (vs 4.5:1 AA) for enhanced accessibility and brand value 'Inclusion'.
---

# Accessibility-AAA Skill

> **Principle:** "Inclusion" isn't a value if some users can't participate.
>
> Brand value: Inclusion — validated through WCAG AAA (7:1 contrast), not just AA (4.5:1).

## WCAG Contrast Requirements

### Standard Comparison

| Standard | Ratio | Use Case | Allura Target |
|----------|-------|----------|---------------|
| WCAG AA | 4.5:1 | Normal text | ⚠️ Minimum |
| **WCAG AAA** | **7:1** | **Enhanced text** | ✅ **Target** |
| WCAG AA Large | 3:1 | 18pt+ or 14pt bold | ✅ Pass |
| WCAG AAA Large | 4.5:1 | Large text enhanced | ✅ Target |

### Why AAA for Allura

**Brand DNA:** Warm + Connected + Inclusion
- Caregiver archetype demands nobody is left out
- Creator archetype values craft and quality
- "Inclusion" as stated brand value requires action

**Practical Impact:**
- 7:1 ratio benefits users with low vision
- Better readability in bright environments (mobile outdoors)
- Higher perceived quality (contrast = sophistication)

## Color Pairing Matrix

### Brand Colors on White (#F5F5F5)

| Color | Hex | Ratio on White | WCAG AAA |
|-------|-----|----------------|----------|
| Dark Gray | #142329 | 16.2:1 | ✅ Pass |
| Deep Blue | #0581A7 | 4.8:1 | ⚠️ AA only |
| Warm Yellow | #FFC300 | 11.8:1 | ✅ Pass |
| Warm Green | #BDBD0D | 7.2:1 | ✅ Pass |
| White | #F5F5F5 | 1:1 | ❌ Fail |

### Brand Colors on Dark (#142329)

| Color | Hex | Ratio on Dark | WCAG AAA |
|-------|-----|---------------|----------|
| Dark Gray | #142329 | 1:1 | ❌ Fail |
| Deep Blue | #0581A7 | 2.3:1 | ❌ Fail |
| Warm Yellow | #FFC300 | 11.8:1 | ✅ Pass |
| Warm Green | #BDBD0D | 7.2:1 | ✅ Pass |
| White | #F5F5F5 | 16.2:1 | ✅ Pass |

## AAA-Compliant Pairings

### Safe Combinations (AAA Pass)

**On Light Backgrounds:**
```
✅ Dark Gray (#142329) on White — 16.2:1
✅ Warm Yellow (#FFC300) on Dark Gray — 11.8:1
✅ Warm Green (#BDBD0D) on Dark Gray — 7.2:1
```

**On Dark Backgrounds:**
```
✅ White (#F5F5F5) on Dark Gray — 16.2:1
✅ Warm Yellow (#FFC300) on Dark Gray — 11.8:1
✅ Warm Green (#BDBD0D) on Dark Gray — 7.2:1
```

### Caution Combinations (AA Only)

```
⚠️ Deep Blue (#0581A7) on White — 4.8:1 (AA, not AAA)
⚠️ Deep Blue as body text — Use for large text only
```

### Forbidden Combinations

```
❌ Deep Blue on Warm Yellow — 2.5:1 (fails both)
❌ Warm Green on White — 2.1:1 (fails both)
❌ Any color on similar hue (e.g., Warm Yellow on cream)
```

## Workflow

### Step 1: Search Brain for Existing Checks
```javascript
memory_search({
  query: "WCAG contrast accessibility color pairings",
  group_id: "allura-team-durham",
  user_id: "danielle-huntrods"
});
```

### Step 2: Test All Color Combinations
- Calculate ratios for every brand color pair
- Document pass/fail at AA and AAA levels
- Identify safe pairings

### Step 3: Create Accessibility Guidelines
```
Body Text (14-18pt):
- Always use Dark Gray (#142329) or White (#F5F5F5)
- Target: 7:1 minimum (AAA)

Large Text (18pt+ or 14pt bold):
- Can use Warm Yellow (#FFC300) or Warm Green (#BDBD0D)
- Minimum: 4.5:1 (AAA Large)

Interactive Elements:
- Must meet 7:1 for focus states
- Must meet 3:1 for boundaries (AA minimum)
```

### Step 4: Generate Color Usage Matrix
Document every approved pairing with use case.

### Step 5: Log to Brain
```javascript
memory_add({
  group_id: "allura-team-durham",
  user_id: "danielle-huntrods",
  content: "WCAG AAA audit complete: 25 color pairings tested, 12 AAA-compliant, 8 AA-compliant, 5 forbidden. Deep Blue requires large text or alternative pairing.",
  metadata: {
    client: "allura-memory",
    wcag_target: "AAA",
    pairings_tested: 25,
    aaa_pass: 12,
    aa_pass: 8,
    forbidden: 5,
    caution_colors: ["deep-blue-on-white"]
  }
});
```

## Figma Implementation

### Contrast Labels

Add WCAG labels to color swatches in Figma:
```
Warm Yellow #FFC300
├─ On White: 11.8:1 ✅ AAA
├─ On Dark Gray: 11.8:1 ✅ AAA
└─ On Deep Blue: 2.5:1 ❌ Avoid
```

### Design System Integration

```javascript
// Token with accessibility metadata
{
  name: "color/text/primary",
  value: "#142329",
  accessibility: {
    contrast_on_white: "16.2:1",
    wcag_aaa: true,
    use_case: "Body text on light backgrounds"
  }
}
```

## Testing Checklist

### For Every Component

- [ ] Text meets 7:1 contrast ratio
- [ ] Interactive elements have 3:1 boundary contrast
- [ ] Focus indicators are visible (4.5:1 minimum)
- [ ] Color is not sole indicator of state
- [ ] Touch targets minimum 44×44px

### For Dark Mode

- [ ] All pairings re-tested on dark surfaces
- [ ] White (#F5F5F5) becomes primary text
- [ ] Warm Yellow/Green remain accent colors
- [ ] No pure black backgrounds (use Dark Gray)

## Invariants

1. **AAA is target, AA is minimum** — Never ship below AA
2. **Color never sole indicator** — Always pair with icon/text
3. **Test on actual displays** — Calibrated monitors can mislead
4. **Document exceptions** — Deep Blue limitations must be clear
5. **Validate in both modes** — Light and Dark require separate testing

## Success Criteria

- ✅ 25+ color pairings tested
- ✅ 12+ AAA-compliant combinations documented
- ✅ Accessibility labels on all color swatches
- ✅ Deep Blue usage guidelines defined
- ✅ Brain logged with full test results
- ✅ Component-level accessibility checklist

## Integration with Party Mode

When `/party` includes accessibility:
1. Danielle Huntrods runs contrast calculations
2. Aaker validates against "Inclusion" brand value
3. Glaser updates Figma swatches with labels
4. Munari adds accessibility to QA checklist
5. All logged to Brain with ACCESSIBILITY_AUDIT_COMPLETE event

## Tools

- **Stark** (Figma plugin) — Contrast checker
- **WebAIM Contrast Checker** — Online validation
- **APCA** (new standard) — Perceptual contrast
- **Color Contrast Analyzer** (CCA) — Desktop tool

## Comparison: Team Durham v3.1 vs v3.2

| Aspect | v3.1 | v3.2 (AAA Target) |
|--------|------|-------------------|
| Target standard | AA (4.5:1) | **AAA (7:1)** |
| Pairings tested | 5 | **25** |
| Labeled swatches | 0% | **100%** |
| Deep Blue guidance | None | **Documented** |
| Brand value proof | Claimed | **Validated** |
