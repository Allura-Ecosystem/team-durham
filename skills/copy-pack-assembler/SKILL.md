---
name: copy-pack-assembler
description: Copy standards and voice definition workflow for Team Durham. Use when agent_id=ogilvy runs TL (Taglines), BV (Brand Voice), CP (Copy Pack), or MN (Must-Not List) commands. Produces tagline directions, voice guides, copy standards, and must-not lists grounded in the locked Strategy Pack.
---

# Copy Pack Assembler Skill

> **Executor:** @Ogilvy (Copywriter)
> **Type:** Content production
> **Prerequisite:** Locked Brand Strategy Pack with archetype + positioning + personality dimensions
> **group_id:** `allura-team-durham`

---

## Purpose

Produce clear, selling copy that earns its place on the page. No jargon. No vagueness. Every word must serve the brand promise. The consumer isn't a moron — she's your wife.

---

## Prerequisites

Before writing a single word, the following MUST be approved and loaded:

1. **Brand Strategy Pack** — positioning statement, archetype, personality dimensions
2. **Brand Voice Rules** — if not yet defined, this skill creates them first
3. **Target Audience** — who we're speaking to, from STP

If prerequisites are missing, STOP and delegate to @Aaker (Brand Strategist).

---

## Workflow

### Command: BV — Brand Voice Definition

**Input:** Locked Strategy Pack with:
- Brand archetype (1 primary + 1 secondary)
- Personality dimensions (Aaker's 5)
- Positioning statement
- Brand promise

**Process:**

1. **Map archetype to voice attributes:**

   | Archetype | Primary Voice | Secondary Voice | Avoid |
   |-----------|--------------|-----------------|-------|
   | Caregiver | Warm, reassuring | Practical, grounded | Cold logic, clinical |
   | Creator | Expressive, visionary | Confident, bold | Generic, safe |
   | Explorer | Adventurous, free | Curious, open | Restrictive, prescriptive |
   | Hero | Determined, bold | Inspiring, direct | Passive, tentative |
   | Outlaw | Provocative, bold | Honest, raw | Corporate, sanitized |
   | Sage | Knowledgeable, clear | Thoughtful, measured | Simplistic, patronizing |
   | Lover | Passionate, sensory | Intimate, devoted | Transactional, cold |
   | Jester | Witty, irreverent | Playful, light | Preachy, earnest |
   | Magician | Transformative, visionary | Mystical, elegant | Mundane, ordinary |
   | Ruler | Authoritative, commanding | Refined, assured | Casual, uncertain |
   | Regular Guy | Friendly, relatable | Honest, unpretentious | Elitist, exclusive |
   | Innocent | Pure, hopeful | Simple, clear | Cynical, complex |

2. **Define the voice in 4 dimensions:**

   ```markdown
   # Brand Voice Guide

   ## Voice Definition

   ### Tone
   [1-2 sentences describing the emotional register]
   - DO: [specific examples]
   - DON'T: [specific examples]

   ### Language
   [1-2 sentences describing word choice level]
   - DO: [specific examples]
   - DON'T: [specific examples]

   ### Perspective
   [1-2 sentences describing point of view]
   - DO: [specific examples]
   - DON'T: [specific examples]

   ### Personality
   [1-2 sentences describing the brand character shining through]
   - DO: [specific examples]
   - DON'T: [specific examples]

   ## Voice Spectrum
   | Dimension | Left Pole ←————————→ Right Pole |
   |-----------|----------------------------------|
   | Formality | [ Casual ←—•———→ Formal ] |
   | Enthusiasm| [ Reserved ←——•——→ Enthusiastic ] |
   | Complexity| [ Simple ←———•—→ Complex ] |
   | Humor     | [ Serious ←———•—→ Playful ] |

   ## Example Sentences
   - **Headline voice:** "[example]"
   - **Body copy voice:** "[example]"
   - **Social media voice:** "[example]"
   - **Error message voice:** "[example]"
   - **CTA voice:** "[example]"
   ```

3. **Log to events:**
   ```sql
   INSERT INTO events (event_type, group_id, agent_id, status, metadata)
   VALUES ('DESIGN_DECISION', 'allura-team-durham', 'ogilvy', 'completed',
     '{"decision": "voice_rules_defined", "archetype": "...", "primary_voice": "..."}');
   ```

4. **Write file:** `clients/{client-slug}/04-copy/brand-voice-guide.md`

---

### Command: TL — Tagline Generation

**Input:** Strategy Pack + Voice Guide (both approved)

**Process:**

1. **Generate 10 tagline candidates** organized by approach:

   | # | Approach | Description |
   |---|----------|-------------|
   | 1-2 | **Benefit-led** | What the brand does for you |
   | 3-4 | **Aspiration-led** | What you become with the brand |
   | 5-6 | **Personality-led** | The brand's character distilled |
   | 7-8 | **Disruption-led** | Challenge the category norm |
   | 9-10 | **Legacy-led** | Timelessness, heritage, trust |

2. **Evaluate each against:**
   - [ ] Aligns with brand archetype and voice
   - [ ] Clear and concrete (no abstraction)
   - [ ] Memorable (rhythm, alliteration, or contrast)
   - [ ] Differentiated (no competitor could say this)
   - [ ] Translates across media (headline, social, packaging)

3. **Select top 3** with rationale for each

4. **Output format:**

   ```markdown
   # Tagline Directions

   **Project:** [brand name]
   **Date:** YYYY-MM-DD
   **Voice:** [locked voice definition]

   ## All Candidates

   | # | Tagline | Approach | Score |
   |---|---------|----------|-------|
   | 1 | "[tagline]" | Benefit-led | X/5 |
   | ... | ... | ... | ... |

   ## Top 3 Recommendations

   ### 1. "[tagline]"
   - **Approach:** [type]
   - **Rationale:** [why this works]
   - **Works on:** [media where it shines]
   - **Risk:** [any concerns]

   [Repeat for #2 and #3]

   ## Rejected & Why
   [Brief notes on why #4-10 didn't make the cut]
   ```

5. **Write file:** `clients/{client-slug}/04-copy/taglines.md`

---

### Command: MN — Must-Not List

**Process:**

1. Derive prohibited language from:
   - Voice Guide (what the brand would NEVER say)
   - Competitor language audit (what competitors already own)
   - Category clichés (tired phrases in the industry)

2. **Output format:**

   ```markdown
   # Must-Not List

   **Project:** [brand name]
   **Date:** YYYY-MM-DD

   ## Prohibited Words
   | Word/Phrase | Reason | Alternative |
   |-------------|--------|-------------|
   | "[word]" | [why it's banned] | [what to use instead] |

   ## Prohibited Tones
   | Tone | Reason | Alternative |
   |------|--------|-------------|
   | [tone] | [why] | [what instead] |

   ## Category Clichés to Avoid
   | Cliché | Why Avoid | Original Alternative |
   |--------|-----------|---------------------|
   | "[cliché]" | [every competitor uses it] | [fresh alternative] |

   ## Enforcing Rules
   - Any copy using prohibited words is BLOCKED from publication
   - Any copy using prohibited tones must be rewritten
   - Must-not list is enforceable by @Munari (QA) during review
   ```

3. **Write file:** `clients/{client-slug}/04-copy/must-not-list.md`

---

### Command: CP — Copy Pack Assembly

**Prerequisite:** TL, BV, MN all approved

**Assembles the complete Copy Pack:**

```markdown
# Copy Pack

**Project:** [brand name]
**Date:** YYYY-MM-DD
**Status:** Approved / Draft

---

## 1. Brand Voice Guide
[From BV command — full voice definition]

## 2. Tagline Directions
[From TL command — top 3 with rationale]

## 3. Must-Not List
[From MN command — prohibited words, tones, clichés]

## 4. Copy Standards

### Headlines
- Length: [max characters/words]
- Structure: [preferred patterns]
- CTA style: [imperative / question / statement]

### Body Copy
- Paragraph length: [guideline]
- Reading level: [target]
- Evidence requirement: [every claim needs proof]

### Social Media
- Platform adaptations: [Instagram, LinkedIn, X, etc.]
- Hashtag strategy: [approach]
- Voice shift per platform: [adjustments]

### Email
- Subject line length: [guideline]
- Preview text: [approach]
- Tone: [consistent or adjusted]

### Product/Service Descriptions
- Format: [standard template]
- Feature → Benefit pattern: [always]
- Word count range: [min-max]

## 5. Voice Examples by Channel
[Concrete before/after examples for each channel]

## 6. Glossary
[Brand-specific terms and their approved usage]
```

**Write file:** `clients/{client-slug}/04-copy/copy-pack.md`

---

## Allura Brain Integration

- Read prior copy events before starting (avoid duplication)
- Write `DESIGN_DECISION` events for tagline selections
- Write `DDR_CREATED` for major voice rule decisions
- `group_id`: `allura-team-durham`
- `agent_id`: `ogilvy`