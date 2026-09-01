# Xiente Website Redesign Proposal

**Prepared by Team Durham**
**Date:** August 2026

---

## The Opportunity

Your site works. People can find you. People can donate. People can read your story.

But right now, the site is doing the job of a brochure. It could be doing the job of a community platform.

We audited staging.xiente.org. We found 10 things that are holding the site back. We have a plan to fix all 10. And we have a way of working that gets it done in half the time of a traditional agency, with better quality control.

Here is what we found and what we propose.

---

## What We Found

**Your brand is strong.** "Breaking the Cycle of Poverty. Creating Pathways to Prosperity." That is a powerful positioning statement. Your color palette (navy, magenta, gold, cyan) is bold and confident. Your typography (Montserrat for headlines, DM Sans for body) creates real visual impact. Your navigation is well-organized. Your donation infrastructure (Stripe) is in place.

We are not proposing a rebrand. We are proposing a rebuild of how the site works, how it feels, and how it serves your community.

### 10 Problems on the Live Site Today

| # | Problem | What It Means for You |
|---|---------|----------------------|
| 1 | Every color and font size is hardcoded in the code | Your staff cannot change brand colors without hiring a developer |
| 2 | The Spanish language toggle exists but has no Spanish content | The Latino community you serve cannot read the site in their language |
| 3 | Homepage content is locked into code, not editable through your CMS | Every content change requires a developer ticket |
| 4 | Donation flow is preset buttons with no emotional payoff | Giving feels like a transaction, not a moment |
| 5 | Images are not optimized for mobile | Slow load times on phones, which is how most of your community visits |
| 6 | Cyan text on navy background fails accessibility standards | You are one ADA complaint away from a problem |
| 7 | Campaigns show a progress bar and a button, nothing more | No story. No faces. No reason to care beyond the number. |
| 8 | Programs are listed as cards with "Learn more" links | Community members cannot register or apply online. Every inquiry becomes a phone call. |
| 9 | A font (Lora serif) loads on every page but is never used | Wasted download time on every visit |
| 10 | Footer links are hardcoded, not managed through your CMS | Staff cannot update links without a developer |

---

## What We Propose

Six phases. Each one fixes real problems and adds something your community can feel.

### Phase 1: Your Brand, Editable by Your Team

Right now, changing the navy blue on your site means a developer opens 100+ files and finds every instance of `#07074e`. That is not sustainable.

We will create a single source of truth for your entire visual system. Colors, fonts, spacing, button styles. All of it lives in one place in your CMS. Change the navy from one shade to another in Payload, hit save, and the entire site updates.

Your communications director manages the brand. Not your developer.

**What you get:**
- A design tokens system that feeds both your website and your CMS
- A "Theme Settings" panel in Payload where staff can adjust colors and fonts
- A component library showing every button, card, and section in every state
- Brand rules locked so staff can edit content without accidentally breaking the visual system

### Phase 2: Pages Your Staff Can Build and Edit

Your homepage is React code. To change a headline, someone has to edit a file, commit code, and deploy. That should not be the process for a nonprofit that publishes new stories, events, and campaigns every week.

We will build a block-based page editor in Payload. Your staff drags blocks to build pages. Hero block. Stats block. Program grid. Campaign section. Testimonial. Image gallery. Each block has its own settings for background color, layout, and content.

**What you get:**
- 10+ reusable block types that cover every section on your current site
- A drag-and-drop page builder in Payload that your staff can use without training
- Every homepage section migrated into editable blocks
- The ability to launch new campaign pages without a developer

### Phase 3: A Real Bilingual Site

Your community is Latino. Your site is in English. The Spanish toggle in your navigation goes nowhere. This is the biggest gap on the site.

We will build a full English/Spanish experience. Not Google Translate. Real content, written by humans, managed through Payload's localization system. Every page, every program description, every donation prompt, every form label.

**What you get:**
- Full Spanish language site with URL structure (`/es/`) for SEO
- Language preference that persists across visits
- A Spanish content workflow in Payload: staff writes in English, translator gets a draft notification, publishes when ready
- Voice standards for Spanish copy that reflect cultural nuance, not literal translation

### Phase 4: Donations That Feel Like Something

Your donation flow is four preset buttons and a URL parameter. It works. But it does not move anyone.

We will redesign the donation experience from the moment someone clicks "Donate" to the moment they see the confirmation page.

**What you get:**
- An impact calculator: donor picks an amount, site shows what it funds ("$50 = heating assistance for one family this winter")
- A recurring giving option: one-time or monthly, with different impact messaging for each
- A confirmation page that is a moment, not a receipt: community photo, a quote from a real family, social share buttons
- A donor dashboard for recurring donors to manage their giving

### Phase 5: Let Your Community Self-Serve

Right now, if a parent in Norris Square wants to enroll their child in Early Head Start, they have to call your office during business hours. That is a barrier.

We will build self-service tools that let community members act on their own time.

**What you get:**
- Program inquiry forms on every program page ("Tell us about your family")
- Event registration with capacity tracking and waitlists
- Volunteer signup with availability and interest fields
- A program eligibility quiz: 3-5 questions that recommend the right programs for each family

### Phase 6: Fast, Accessible, Compliant

We will fix every performance and accessibility issue before launch.

**What you get:**
- All images optimized for mobile with responsive sizing
- Color contrast fixed to meet WCAG AA standards
- Full keyboard navigation and screen reader support
- Lighthouse performance score of 90 or higher on mobile
- A QA report documenting every fix

---

## How We Work

Team Durham is not a traditional agency. We use AI specialists for strategy, visual direction, copywriting, and quality assurance. Each specialist is an expert in their field. Each one focuses on one thing. And every decision they make is documented and traceable.

Here is what that means for you.

### Every Decision Has a Reason

When we choose a color, adjust a font, or write a headline, we record why. Not in a meeting note that gets lost. In a permanent record that you can search.

If you ask us six months from now, "Why did you make the donate button magenta instead of gold?" we can show you the exact reasoning. The strategy behind it. The alternatives we considered. The QA results that confirmed it.

You will never hear "because the designer felt like it."

### Your Brand Gets a Memory

When we finish your project, we store your complete brand definition. Your positioning. Your voice. Your visual system. Your design rules. Everything.

When you come back in six months for a new campaign page, a new program landing page, or a new event microsite, we start from your stored brand definition. No re-discovery. No "remind us about your organization." We already know you. The work starts faster. The quality stays consistent.

### We Learn From Every Project

We have built brands and websites for nonprofits before. Every decision we made on those projects informs your project. When we design your donation flow, we draw on what worked for other community organizations. When we write your Spanish copy standards, we use voice patterns that resonated with Latino communities in prior work.

Your project benefits from every project that came before it. And every project after yours benefits from what we learn building yours.

### Quality Gate, Every Time

Before anything ships, it passes a quality check. Accessibility. Brand consistency. Performance. Copy standards. The bar is 85%. If a page scores below 85, it goes back to the specialist who built it. No exceptions. No "we will fix it after launch."

You see the quality report. You see the score. You see what passed and what was fixed. No black box.

### Half the Time of a Traditional Agency

A traditional agency takes 14 weeks for a project like this. Discovery. Strategy. Design. Copy. QA. Each phase is a handoff between people, each handoff takes time.

We take 6-7 weeks. Our specialists work in parallel. Our AI tools handle the repetitive work (accessibility scanning, performance testing, copy consistency checks) so our people focus on the creative decisions that matter.

| Traditional Agency | Team Durham |
|---|---|
| 2 weeks discovery | 1 day |
| 3 weeks strategy | 3 days |
| 4 weeks design | 1 week |
| 2 weeks copy | 2 days |
| 3 weeks QA | 3 days |
| **14 weeks total** | **6-7 weeks total** |

---

## Timeline

| Phase | What We Build | Time |
|-------|--------------|------|
| 1 | Brand system + editable theme settings in CMS | 1 week |
| 2 | Block-based page builder + content migration | 2 weeks |
| 3 | Full English/Spanish bilingual site | 1 week |
| 4 | Donation experience redesign | 1 week |
| 5 | Community self-service forms and tools | 1 week |
| 6 | Performance, accessibility, and QA | 3 days |

**Total: 6-7 weeks from start to review-ready staging site.**

---

## What We Will Not Do

- We will not redesign your logo or brand identity. Your brand is locked. We respect it.
- We will not change your positioning statement. It works.
- We will not migrate you away from Payload. We will make Payload work harder for you.
- We will not deploy to production without your sign-off. Everything runs on staging until you say go.

---

## What This Costs

Team Durham offers nonprofit pricing. We bill by phase. If a phase does not pass our quality gate, we fix it at no additional cost.

We will provide a detailed quote after you confirm the scope. No surprises. No hidden fees.

---

## Next Step

Can we talk this week? We will walk you through the audit findings on a call, show you the specific pages and components we would change, and answer any questions about the approach.

Send us a time that works. We will be ready.

**Team Durham**
info@teamdurham.co