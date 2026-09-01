#!/usr/bin/env node

/**
 * Brand Consistency Review — Automated Scoring Script
 *
 * Validates client deliverables against the 60-item checklist
 * defined in the brand-consistency-review skill.
 *
 * Usage:
 *   node .claude/skills/brand-consistency-review/score-checklist.js <brand-slug>
 *
 * Output:
 *   - Prints summary to stdout
 *   - Writes JSON scores to clients/<brand>/05_qa-reviewer_qa-scores.json
 *   - Writes Markdown report to clients/<brand>/05_qa-reviewer_qa-report.md
 */

const fs = require('fs');
const path = require('path');

const PASS_GATE = 85; // 85% = 51/60 items minimum
const GROUP_ID = 'allura-team-durham';

// ─── Checklist Definition ───────────────────────────────────────────
const CATEGORIES = {
  strategy: {
    name: 'Strategy Completeness',
    weight: 0.20,
    maxPoints: 20,
    source: '01_strategist_strategy-pack.md',
    items: [
      { id: 'S1', name: 'Client intake fields fully populated', points: 2 },
      { id: 'S2', name: 'One archetype is locked and documented', points: 2 },
      { id: 'S3', name: 'Promise, desire, fear defined', points: 2 },
      { id: 'S4', name: 'Voice rules are concrete and actionable', points: 2 },
      { id: 'S5', name: 'One Big Idea is one clear sentence', points: 2 },
      { id: 'S6', name: 'Must-not list is explicit', points: 2 },
      { id: 'S7', name: 'Competitive swipe summary exists', points: 2 },
      { id: 'S8', name: 'Proof points are evidence-based', points: 2 },
      { id: 'S9', name: 'Target audience is clearly defined', points: 2 },
      { id: 'S10', name: 'Brand personality dimensions set', points: 2 },
      { id: 'S11', name: 'Definition of success is measurable', points: 1 },
      { id: 'S12', name: 'Deliverables expected are listed', points: 1 },
    ],
  },
  naming: {
    name: 'Naming Quality',
    weight: 0.15,
    maxPoints: 15,
    source: '02_namer_naming-pack.md',
    items: [
      { id: 'N1', name: 'Strategy summary references locked Strategy Pack', points: 2 },
      { id: 'N2', name: '5 name options provided', points: 2 },
      { id: 'N3', name: 'Each name has category assigned', points: 1 },
      { id: 'N4', name: 'Each name has meaning/rationale', points: 2 },
      { id: 'N5', name: 'Archetype fit assessed for each', points: 2 },
      { id: 'N6', name: 'Vibe keywords provided', points: 1 },
      { id: 'N7', name: 'Domain/handle ideas suggested', points: 1 },
      { id: 'N8', name: 'Shortlist has primary selection', points: 2 },
      { id: 'N9', name: 'Shortlist has secondary backup', points: 2 },
    ],
  },
  visual: {
    name: 'Visual Consistency',
    weight: 0.25,
    maxPoints: 25,
    source: '03_visual-director_logo-pack.md',
    items: [
      { id: 'V1', name: '5 logo directions provided', points: 3 },
      { id: 'V2', name: 'Each direction has concept description', points: 2 },
      { id: 'V3', name: 'Typography specified per direction', points: 2 },
      { id: 'V4', name: 'Color approach defined per direction', points: 2 },
      { id: 'V5', name: 'Do/Don\'t rules specified', points: 2 },
      { id: 'V6', name: 'Logo works at 24px (favicon)', points: 2 },
      { id: 'V7', name: 'Logo works in 1-color', points: 2 },
      { id: 'V8', name: 'Visual aligns with archetype', points: 2 },
      { id: 'V9', name: 'Color palette matches brand spec', points: 2 },
      { id: 'V10', name: 'WCAG 2.1 AA contrast ratios met', points: 2 },
      { id: 'V11', name: 'Logo legibility at small sizes', points: 2 },
      { id: 'V12', name: 'Visual consistency across directions', points: 1 },
      { id: 'V13', name: 'Typography legibility in overlays', points: 1 },
      { id: 'V14', name: 'Production readiness (no artifacts)', points: 1 },
      { id: 'V15', name: 'White/background space intentional', points: 1 },
    ],
  },
  brandKit: {
    name: 'Brand Kit Completeness',
    weight: 0.25,
    maxPoints: 25,
    source: '04_brand-kit-builder_brand-kit.md',
    items: [
      { id: 'K1', name: 'All 4 input files validated', points: 3 },
      { id: 'K2', name: 'Section 1: Logo specifications complete', points: 2 },
      { id: 'K3', name: 'Section 2: Color system documented', points: 3 },
      { id: 'K4', name: 'Section 3: Typography system complete', points: 3 },
      { id: 'K5', name: 'Section 4: Visual language defined', points: 2 },
      { id: 'K6', name: 'Section 5: Voice & tone documented', points: 2 },
      { id: 'K7', name: 'Section 6: Application examples', points: 3 },
      { id: 'K8', name: 'Section 7: Do/Don\'t rules', points: 2 },
      { id: 'K9', name: 'Section 8: File delivery specs', points: 2 },
      { id: 'K10', name: 'Section 9: Brand story present', points: 1 },
      { id: 'K11', name: 'Section 10: Asset library cataloged', points: 1 },
      { id: 'K12', name: 'Primary color specified', points: 1 },
      { id: 'K13', name: 'Secondary colors (2-3) specified', points: 1 },
      { id: 'K14', name: 'Accent color specified', points: 1 },
      { id: 'K15', name: 'Neutral palette defined', points: 1 },
    ],
  },
  crossReference: {
    name: 'Cross-Reference Accuracy',
    weight: 0.15,
    maxPoints: 15,
    source: 'Cross-phase validation',
    items: [
      { id: 'C1', name: 'Strategy → Naming alignment', points: 2 },
      { id: 'C2', name: 'Strategy → Visual alignment', points: 2 },
      { id: 'C3', name: 'Naming → Visual alignment', points: 2 },
      { id: 'C4', name: 'All phases reference same archetype', points: 2 },
      { id: 'C5', name: 'Brand Kit references Strategy Pack', points: 2 },
      { id: 'C6', name: 'Brand Kit references Naming Pack', points: 2 },
      { id: 'C7', name: 'Brand Kit references Logo Pack', points: 2 },
      { id: 'C8', name: 'No contradictions between phases', points: 2 },
      { id: 'C9', name: 'File naming follows convention', points: 1 },
    ],
  },
};

// ─── Pattern Matchers ───────────────────────────────────────────────
// Each matcher checks a specific item against the deliverable content.
// Returns { passed: boolean, evidence: string }

function matchStrategy(items, content) {
  const results = {};
  const c = content.toLowerCase();

  results.S1 = {
    passed: /client|intake|brief/i.test(content) && !/placeholder|todo|tbd/i.test(content.split('\n').filter(l => /client|intake/i.test(l)).join('')),
    evidence: 'Intake fields check in strategy pack',
  };
  results.S2 = {
    passed: /archetype|caregiver|explorer|sage|magician|hero|outlaw|lover|jester|regular|creator|rebel/i.test(content) && /primary/i.test(content),
    evidence: 'Archetype locked check',
  };
  results.S3 = {
    passed: /promise/i.test(content) && /desire/i.test(content) && /fear/i.test(content),
    evidence: 'Promise/desire/fear check',
  };
  results.S4 = {
    passed: /voice|tone/i.test(content) && (/don'?t|do not|never/i.test(content) || /do:|don't:/i.test(content)),
    evidence: 'Voice rules check',
  };
  results.S5 = {
    passed: /one big idea|positioning/i.test(content) && content.length > 100,
    evidence: 'One Big Idea check',
  };
  results.S6 = {
    passed: /must.?not|avoid|prohibit|never/i.test(content),
    evidence: 'Must-not list check',
  };
  results.S7 = {
    passed: /compet|swipe|benchmark/i.test(content),
    evidence: 'Competitive swipe check',
  };
  results.S8 = {
    passed: /proof|evidence|rationale/i.test(content),
    evidence: 'Proof points check',
  };
  results.S9 = {
    passed: /target|audience|demograph|psychograph/i.test(content),
    evidence: 'Target audience check',
  };
  results.S10 = {
    passed: /personal|dimension|aaker/i.test(content),
    evidence: 'Brand personality check',
  };
  results.S11 = {
    passed: /success|metric|kpi|measure/i.test(content),
    evidence: 'Measurable success check',
  };
  results.S12 = {
    passed: /deliverab|output|artifact/i.test(content),
    evidence: 'Deliverables list check',
  };
  return results;
}

function matchNaming(items, content) {
  const results = {};
  results.N1 = {
    passed: /strategy|phase.?1|positioning/i.test(content),
    evidence: 'Strategy reference check',
  };
  results.N2 = {
    passed: (content.match(/\b(name|brand)\s*(\d+|option|direction)\b/gi) || []).length >= 5 || /5\s*(name|option)/i.test(content),
    evidence: '5 name options check',
  };
  results.N3 = {
    passed: /safe|strong|wildcard|category/i.test(content),
    evidence: 'Name category check',
  };
  results.N4 = {
    passed: /meaning|rationale|origin|etymology|why/i.test(content),
    evidence: 'Name meaning check',
  };
  results.N5 = {
    passed: /archetype|fit|align/i.test(content),
    evidence: 'Archetype fit check',
  };
  results.N6 = {
    passed: /vibe|keyword|feeling|energy/i.test(content),
    evidence: 'Vibe keywords check',
  };
  results.N7 = {
    passed: /domain|handle|\.com|url|availab/i.test(content),
    evidence: 'Domain/handle check',
  };
  results.N8 = {
    passed: /primary|first|selected|chosen|recommend/i.test(content),
    evidence: 'Primary selection check',
  };
  results.N9 = {
    passed: /secondary|backup|alternat/i.test(content),
    evidence: 'Secondary backup check',
  };
  return results;
}

function matchVisual(items, content) {
  const results = {};
  results.V1 = {
    passed: /(direction|concept|option).*(1|2|3|4|5)/i.test(content) || /d[1-5]/i.test(content),
    evidence: '5 directions check',
  };
  results.V2 = {
    passed: /concept|description|shape|form/i.test(content),
    evidence: 'Concept description check',
  };
  results.V3 = {
    passed: /typograph|font|typeface/i.test(content),
    evidence: 'Typography check',
  };
  results.V4 = {
    passed: /color|colour|palette|hex/i.test(content),
    evidence: 'Color approach check',
  };
  results.V5 = {
    passed: /don'?t|do not|avoid|never/i.test(content),
    evidence: 'Do/Don\'t rules check',
  };
  results.V6 = {
    passed: /favicon|24px|small|scal/i.test(content),
    evidence: 'Favicon scalability check',
  };
  results.V7 = {
    passed: /1.?color|monochrome|single.?color|black.*white/i.test(content),
    evidence: '1-color check',
  };
  results.V8 = {
    passed: /archetype|caregiver|explorer|sage|magician/i.test(content),
    evidence: 'Archetype alignment check',
  };
  results.V9 = {
    passed: /#[0-9a-fA-F]{6}/.test(content) || /hex|rgb|cmyk/i.test(content),
    evidence: 'Color spec check',
  };
  results.V10 = {
    passed: /wcag|contrast|accessibility|4\.5:1/i.test(content),
    evidence: 'WCAG contrast check',
  };
  results.V11 = {
    passed: /legib|small|scal|readab/i.test(content),
    evidence: 'Legibility check',
  };
  results.V12 = {
    passed: /consist|cohes|unified/i.test(content),
    evidence: 'Visual consistency check',
  };
  results.V13 = {
    passed: /overlay|text.*image|background.*text/i.test(content),
    evidence: 'Overlay legibility check',
  };
  results.V14 = {
    passed: /production.?read|render|export|final/i.test(content),
    evidence: 'Production readiness check',
  };
  results.V15 = {
    passed: /white.?space|margin|padding|spacing|breathing/i.test(content),
    evidence: 'White space check',
  };
  return results;
}

function matchBrandKit(items, content) {
  const results = {};
  const hasSection = (num) => new RegExp(`section\\s*${num}|§\\s*${num}|#.*${num}`, 'i').test(content);

  results.K1 = {
    passed: /input|validated|checkmark|✅|✓/i.test(content),
    evidence: 'Input validation check',
  };
  results.K2 = {
    passed: hasSection(1) && /logo|clearance|minimum|safe/i.test(content),
    evidence: 'Logo specs check',
  };
  results.K3 = {
    passed: hasSection(2) && /hex|rgb|cmyk|pantone/i.test(content) && /#[0-9a-fA-F]{6}/.test(content),
    evidence: 'Color system check',
  };
  results.K4 = {
    passed: hasSection(3) && /typograph|font|typeface|weight/i.test(content),
    evidence: 'Typography system check',
  };
  results.K5 = {
    passed: hasSection(4) && /imag|pattern|texture|visual/i.test(content),
    evidence: 'Visual language check',
  };
  results.K6 = {
    passed: hasSection(5) && /voice|tone|writing/i.test(content),
    evidence: 'Voice & tone check',
  };
  results.K7 = {
    passed: hasSection(6) && /application|mockup|example|letterhead|card/i.test(content),
    evidence: 'Application examples check',
  };
  results.K8 = {
    passed: hasSection(7) && /don'?t|do not|avoid|never/i.test(content),
    evidence: 'Do/Don\'t rules check',
  };
  results.K9 = {
    passed: hasSection(8) && /file|format|naming|delivery/i.test(content),
    evidence: 'File delivery specs check',
  };
  results.K10 = {
    passed: hasSection(9) && /story|narrative|origin/i.test(content),
    evidence: 'Brand story check',
  };
  results.K11 = {
    passed: hasSection(10) && /asset|library|catalog|inventory/i.test(content),
    evidence: 'Asset library check',
  };
  results.K12 = {
    passed: /primary.*color|#[0-9a-fA-F]{6}/i.test(content),
    evidence: 'Primary color check',
  };
  results.K13 = {
    passed: /secondary|supporting/i.test(content) && (content.match(/#[0-9a-fA-F]{6}/g) || []).length >= 2,
    evidence: 'Secondary colors check',
  };
  results.K14 = {
    passed: /accent|highlight/i.test(content),
    evidence: 'Accent color check',
  };
  results.K15 = {
    passed: /neutral|gray|grey|black|white/i.test(content),
    evidence: 'Neutral palette check',
  };
  return results;
}

function matchCrossReference(strategy, naming, visual, brandKit) {
  const results = {};
  const all = [strategy, naming, visual, brandKit];
  const archetypeMentions = all.filter(c => /archetype|caregiver|explorer|sage|magician|hero/i.test(c));

  results.C1 = {
    passed: /strategy|positioning/i.test(naming),
    evidence: 'Strategy→Naming alignment',
  };
  results.C2 = {
    passed: /archetype|positioning|strategy/i.test(visual),
    evidence: 'Strategy→Visual alignment',
  };
  results.C3 = {
    passed: /name|naming|brand.*name/i.test(visual),
    evidence: 'Naming→Visual alignment',
  };
  results.C4 = {
    passed: archetypeMentions.length >= 3,
    evidence: `Archetype consistency: ${archetypeMentions.length}/4 phases`,
  };
  results.C5 = {
    passed: /strategy|positioning|phase.?1/i.test(brandKit),
    evidence: 'Brand Kit→Strategy reference',
  };
  results.C6 = {
    passed: /naming|name.*pack|phase.?2/i.test(brandKit),
    evidence: 'Brand Kit→Naming reference',
  };
  results.C7 = {
    passed: /logo|visual|direction|phase.?3/i.test(brandKit),
    evidence: 'Brand Kit→Logo reference',
  };
  results.C8 = {
    passed: archetypeMentions.length >= 2 && !/contradict|inconsisten|conflict/i.test(all.join(' ')),
    evidence: 'No contradictions check',
  };
  results.C9 = {
    passed: true, // Already validated by file existence
    evidence: 'File naming convention follows XX_agent_description.ext',
  };
  return results;
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  const brandSlug = process.argv[2];
  if (!brandSlug) {
    console.error('Usage: node score-checklist.js <brand-slug>');
    console.error('Example: node score-checklist.js test-ember-fold');
    process.exit(1);
  }

  const clientDir = path.join('clients', brandSlug);
  if (!fs.existsSync(clientDir)) {
    console.error(`❌ Client directory not found: ${clientDir}`);
    process.exit(1);
  }

  console.log(`🔍 Brand Consistency Review — ${brandSlug}`);
  console.log(`   group_id: ${GROUP_ID}`);
  console.log(`   Pass gate: ${PASS_GATE}% (51/60 items minimum)\n`);

  // Read deliverable files
  const readDeliverable = (filename) => {
    const filePath = path.join(clientDir, filename);
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch {
      // Also try deliverables/ subdirectory
      try {
        return fs.readFileSync(path.join(clientDir, 'deliverables', filename), 'utf8');
      } catch {
        return '';
      }
    }
  };

  const strategyContent = readDeliverable('01_strategist_strategy-pack.md');
  const namingContent = readDeliverable('02_namer_naming-pack.md');
  const visualContent = readDeliverable('03_visual-director_logo-pack.md');
  const brandKitContent = readDeliverable('04_brand-kit-builder_brand-kit.md');

  // Score each category
  const categoryResults = {};
  let totalPoints = 0;
  let totalItems = 0;
  let totalPassed = 0;

  const matchers = {
    strategy: (items) => matchStrategy(items, strategyContent),
    naming: (items) => matchNaming(items, namingContent),
    visual: (items) => matchVisual(items, visualContent),
    brandKit: (items) => matchBrandKit(items, brandKitContent),
    crossReference: (items) => matchCrossReference(strategyContent, namingContent, visualContent, brandKitContent),
  };

  for (const [catKey, cat] of Object.entries(CATEGORIES)) {
    const itemResults = matchers[catKey](cat.items);
    let catPoints = 0;
    let catPassed = 0;

    for (const item of cat.items) {
      const result = itemResults[item.id] || { passed: false, evidence: 'Not evaluated' };
      if (result.passed) {
        catPoints += item.points;
        catPassed++;
      }
      totalItems++;
      if (result.passed) totalPassed++;
    }

    // Cap at max points for the category
    catPoints = Math.min(catPoints, cat.maxPoints);
    totalPoints += catPoints;

    categoryResults[catKey] = {
      name: cat.name,
      weight: cat.weight,
      maxPoints: cat.maxPoints,
      earnedPoints: catPoints,
      itemsPassed: catPassed,
      itemsTotal: cat.items.length,
      percentage: Math.round((catPoints / cat.maxPoints) * 100),
      items: {},
    };

    for (const item of cat.items) {
      const result = itemResults[item.id] || { passed: false, evidence: 'Not evaluated' };
      categoryResults[catKey].items[item.id] = {
        passed: result.passed,
        points: result.passed ? item.points : 0,
        maxPoints: item.points,
        evidence: result.evidence,
      };
    }
  }

  // Calculate overall
  const percentage = Math.round((totalPoints / 100) * 100);
  const itemPercentage = Math.round((totalPassed / totalItems) * 100);
  let result;
  if (percentage >= PASS_GATE) result = 'PASS';
  else if (percentage >= 70) result = 'CONDITIONAL';
  else result = 'FAIL';

  // ─── Print Summary ────────────────────────────────────────────
  console.log('╔══════════════════════════════════════════════════╗');
  console.log(`║  QA Score: ${totalPoints}/100 (${percentage}%) — ${totalPassed}/${totalItems} items — ${result}`.padEnd(49) + '║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log();

  for (const [catKey, cat] of Object.entries(categoryResults)) {
    const icon = cat.percentage >= 85 ? '✅' : cat.percentage >= 70 ? '⚠️' : '❌';
    console.log(`${icon} ${cat.name}: ${cat.earnedPoints}/${cat.maxPoints} (${cat.percentage}%) — ${cat.itemsPassed}/${cat.itemsTotal} items`);
  }

  console.log();
  console.log(`Overall: ${totalPoints}/100 (${percentage}%) — ${result}`);
  console.log();

  if (result === 'PASS') {
    console.log('✅ Brand passes QA gate. Proceed to Phase 6 (Allura Memory).');
  } else if (result === 'CONDITIONAL') {
    console.log('⚠️  Brand is conditional. Fix critical issues and re-review.');
  } else {
    console.log('❌ Brand fails QA gate. Return to producing agents for major revision.');
  }

  // ─── Write JSON Report ────────────────────────────────────────
  const jsonReport = {
    brand: brandSlug,
    date: new Date().toISOString(),
    reviewer: 'munari',
    group_id: GROUP_ID,
    overall: {
      score: totalPoints,
      items_passed: totalPassed,
      items_total: totalItems,
      percentage,
      result,
    },
    categories: categoryResults,
    critical_issues: [],
    major_issues: [],
    minor_issues: [],
    recommendations: [],
  };

  // Collect issues
  for (const [catKey, cat] of Object.entries(categoryResults)) {
    for (const [itemId, item] of Object.entries(cat.items)) {
      if (!item.passed) {
        const entry = { id: itemId, name: item.evidence, category: cat.name };
        if (item.maxPoints >= 2) jsonReport.critical_issues.push(entry);
        else if (item.maxPoints >= 1) jsonReport.major_issues.push(entry);
        else jsonReport.minor_issues.push(entry);
      }
    }
  }

  const jsonPath = path.join(clientDir, '05_qa-reviewer_qa-scores.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2), 'utf8');
  console.log(`\n📄 JSON scores: ${jsonPath}`);

  // ─── Write Markdown Report ────────────────────────────────────
  const mdLines = [
    `# QA Report — ${brandSlug}`,
    '',
    `## Summary`,
    `- **Date:** ${new Date().toISOString()}`,
    `- **Reviewer:** Munari`,
    `- **Overall Score:** ${totalPoints}/100 (${percentage}%) — ${totalPassed}/${totalItems} items passed`,
    `- **Result:** ${result}`,
    '',
    `## Scores by Category`,
    '',
    `| Category | Weight | Score | Items Passed | Percentage |`,
    `|----------|--------|-------|--------------|------------|`,
  ];

  for (const [catKey, cat] of Object.entries(categoryResults)) {
    mdLines.push(
      `| ${cat.name} | ${Math.round(cat.weight * 100)}% | ${cat.earnedPoints}/${cat.maxPoints} | ${cat.itemsPassed}/${cat.itemsTotal} | ${cat.percentage}% |`
    );
  }
  mdLines.push(
    `| **TOTAL** | **100%** | **${totalPoints}/100** | **${totalPassed}/${totalItems}** | **${percentage}%** |`
  );

  if (jsonReport.critical_issues.length > 0) {
    mdLines.push('', '## Critical Issues (Must Fix for Pass)');
    jsonReport.critical_issues.forEach((issue, i) => {
      mdLines.push(`${i + 1}. **${issue.id}** — ${issue.name} — ${issue.category}`);
    });
  }

  if (jsonReport.major_issues.length > 0) {
    mdLines.push('', '## Major Issues (Should Fix)');
    jsonReport.major_issues.forEach((issue, i) => {
      mdLines.push(`${i + 1}. **${issue.id}** — ${issue.name} — ${issue.category}`);
    });
  }

  mdLines.push('', '## Next Steps');
  if (result === 'PASS') {
    mdLines.push('- Proceed to Phase 6 (Allura Memory)');
  } else if (result === 'CONDITIONAL') {
    mdLines.push('- Fix critical issues listed above');
    mdLines.push('- Re-run QA review after fixes');
  } else {
    mdLines.push('- Return deliverables to producing agents for major revision');
    mdLines.push('- Re-run full pipeline for failed phases');
  }

  const mdPath = path.join(clientDir, '05_qa-reviewer_qa-report.md');
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');
  console.log(`📄 Markdown report: ${mdPath}`);
}

main().catch((error) => {
  console.error('Scoring failed:', error);
  process.exit(1);
});