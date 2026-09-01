/**
 * Brand Context Injector
 *
 * Reads actual brand assets (brand kit, logo pack, brand truth)
 * and injects them into every fal.ai prompt BEFORE generation.
 *
 * This ensures generated images are "from" the brand, not just "about" it.
 *
 * Source files:
 * - brand-kit-v3.2-final.md (colors, typography, visual language, shadows)
 * - 03_visual-director_logo-pack.md (droplet philosophy, allura gesture)
 * - 06_allura-memory_brand-truth.json (archetype, positioning, voice)
 * - assets/mood/ (reference mood image)
 * - assets/logos/alllura logo final/ (actual logo files)
 */

// ============================================================
// EXTRACTED BRAND CONTEXT (from actual deliverables)
// ============================================================

export interface BrandColor {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
  ratio: string; // % of composition
}

export interface BrandTypography {
  heading: string;
  headingWeights: string[];
  body: string;
  bodyWeights: string[];
  scale: Record<string, string>;
}

export interface BrandShape {
  borderRadius: string;
  philosophy: string;
  avoid: string;
}

export interface BrandPhotography {
  style: string;
  lighting: string;
  subjects: string;
  avoid: string;
}

export interface BrandLogo {
  concept: string;
  philosophy: string;
  gesture: string;
  dropletPhilosophy: string;
  variants: { name: string; file: string; usage: string }[];
  clearSpace: string;
  misuseRules: string[];
}

export interface BrandContext {
  brandName: string;
  archetype: {
    primary: string;
    secondary: string;
    tertiary: string;
    character: string;
  };
  essence: string;
  promise: string;
  positioning: string;
  colors: {
    primary: BrandColor;
    secondary: BrandColor[];
    neutrals: { dark: BrandColor; light: BrandColor };
    ratios: Record<string, string>;
    wcagSafe: { fg: string; bg: string; ratio: string; pass: boolean }[];
    forbidden: string[];
  };
  typography: BrandTypography;
  shapes: BrandShape;
  photography: BrandPhotography;
  logo: BrandLogo;
  visualLanguage: {
    shadowSystem: string;
    elevationLevels: string[];
    patternUsage: string;
    iconography: string;
  };
  voice: {
    character: string;
    wordsToUse: string[];
    wordsToAvoid: string[];
  };
  assets: {
    logosDir: string;
    moodImage: string;
    faviconsDir: string;
    generatedImagesDir: string;
  };
}

// ============================================================
// ALLURA BRAND CONTEXT (extracted from deliverables)
// ============================================================

export const ALLURA_BRAND_CONTEXT: BrandContext = {
  brandName: "allura",

  archetype: {
    primary: "Caregiver (50%)",
    secondary: "Creator (30%)",
    tertiary: "Explorer (20%)",
    character: "Warm + Connected"
  },

  essence: "Warm technology that brings communities together",
  promise: "We create spaces where connection thrives, community grows, and everyone belongs",
  positioning: "For communities seeking connection and empowerment through thoughtful technology, allura is the community-centered platform that creates warm digital spaces where people truly belong — unlike cold, transactional tech platforms",

  colors: {
    primary: {
      name: "Warm Yellow",
      hex: "#FFC300",
      rgb: "255, 195, 0",
      usage: "CTAs, highlights, primary accents",
      ratio: "7%"
    },
    secondary: [
      {
        name: "Deep Blue",
        hex: "#0581A7",
        rgb: "5, 129, 167",
        usage: "Trust elements, secondary surfaces",
        ratio: "15%"
      },
      {
        name: "Warm Green",
        hex: "#BDBD0D",
        rgb: "189, 189, 13",
        usage: "Supporting accents, success states",
        ratio: "3%"
      }
    ],
    neutrals: {
      dark: {
        name: "Dark Gray",
        hex: "#142329",
        rgb: "20, 35, 41",
        usage: "Primary text, strong backgrounds",
        ratio: "25%"
      },
      light: {
        name: "White/Cream",
        hex: "#F5F5F5",
        rgb: "245, 245, 245",
        usage: "Backgrounds, negative space",
        ratio: "50%"
      }
    },
    ratios: {
      white: "50%",
      dark_gray: "25%",
      deep_blue: "15%",
      warm_yellow: "7%",
      warm_green: "3%"
    },
    wcagSafe: [
      { fg: "#142329", bg: "#F5F5F5", ratio: "16.2:1", pass: true },
      { fg: "#F5F5F5", bg: "#142329", ratio: "16.2:1", pass: true },
      { fg: "#FFC300", bg: "#142329", ratio: "11.8:1", pass: true },
      { fg: "#BDBD0D", bg: "#142329", ratio: "7.2:1", pass: true }
    ],
    forbidden: [
      "Deep Blue on Warm Yellow (2.5:1 — fails both)",
      "Warm Green on White (2.1:1 — fails both)",
      "Any color on similar hue"
    ]
  },

  typography: {
    heading: "Outfit",
    headingWeights: ["SemiBold 600", "Bold 700"],
    body: "Inter",
    bodyWeights: ["Regular 400", "Medium 500"],
    scale: {
      hero: "48-64px",
      h1: "36-48px",
      h2: "28-32px",
      h3: "22-24px",
      body: "16-18px",
      small: "14px",
      caption: "12px"
    }
  },

  shapes: {
    borderRadius: "12-16px for cards and containers",
    philosophy: "Droplet curves — fluid, organic shapes that suggest connection and flow",
    avoid: "Sharp corners, rigid geometric forms"
  },

  photography: {
    style: "Authentic, documentary-style photography of diverse communities",
    lighting: "Natural light preferred, warm tones, golden hour",
    subjects: "Real community members, genuine moments of connection",
    avoid: "Stock photos, overly staged imagery, isolated individuals"
  },

  logo: {
    concept: "The allura gesture — fluid, organic curves that suggest droplets, connection, and flow",
    philosophy: "Golden ratio proportions with droplet curves creating visual harmony",
    gesture: "The gentle upward curve of the final 'a' that creates a subtle smile — creates subconscious positive association and provides distinctive brand recognition",
    dropletPhilosophy: "Every 'a' in allura carries a subtle droplet curve — water represents connection (droplets merge), nourishment (essential for growth), and adaptability (taking shape of container)",
    variants: [
      { name: "Primary Wordmark", file: "logo main.png", usage: "Default for most applications" },
      { name: "Full Mark", file: "hvcF9HluKY91Vorks0W21_image.png", usage: "Full logo presence" },
      { name: "Icon Only", file: "uiHnBryBrrk7fvaflAO6f_image.png", usage: "Favicon, app icon" },
      { name: "Alternate Mark", file: "QRpz-Yk1B0314EyKzoin__image.png", usage: "Variation needed" }
    ],
    clearSpace: "Equal to the x-height of lowercase 'l'",
    misuseRules: [
      "Never stretch or distort",
      "Never change colors outside approved palette",
      "Never add effects (shadows, outlines, gradients)",
      "Never rotate or tilt",
      "Never place on busy backgrounds without clearance"
    ]
  },

  visualLanguage: {
    shadowSystem: "3-layer editorial shadows: ambient (0 4px 20px -4px rgba(20,35,41,0.08)) + directional (0 8px 16px -4px rgba(20,35,41,0.12)) + contact (0 2px 4px 0 rgba(20,35,41,0.16))",
    elevationLevels: ["Flat (none)", "Card (ambient+directional)", "Hover (enhanced+contact)", "Modal (full 3-layer)"],
    patternUsage: "Memory Keep Pattern — organic droplet motifs, soft curves suggesting water ripples, Warm Yellow + Deep Blue + Warm Green rhythm",
    iconography: "Rounded, soft, 2px stroke weight, inherits text color tokens, 24px default"
  },

  voice: {
    character: "Warmth of a trusted neighbor, thoughtfulness of a close friend. Welcoming without being overly familiar, knowledgeable without being condescending.",
    wordsToUse: ["community", "connection", "belonging", "together", "warmth", "inviting", "craft", "care", "celebrate", "amplify", "support"],
    wordsToAvoid: ["users", "consumers", "targets", "leverage", "utilize", "disruption", "hacking", "AI-powered", "seamless", "frictionless"]
  },

  assets: {
    logosDir: "clients/allura-memory/assets/logos/alllura logo final/",
    moodImage: "clients/allura-memory/assets/mood/CMv0S4e4J8qmN70lpLEjD_image (1).png",
    faviconsDir: "clients/allura-memory/assets/favicons/",
    generatedImagesDir: "clients/allura-memory/generated-images/"
  }
};

// ============================================================
// PROMPT INJECTION ENGINE
// ============================================================

/**
 * Build brand context prefix for prompts
 * This is prepended to every generation prompt
 */
export function buildBrandContextPrefix(context: BrandContext): string {
  return `Brand: ${context.brandName} — ${context.essence}.
Archetype: ${context.archetype.primary}, ${context.archetype.secondary}, ${context.archetype.tertiary}. Character: ${context.archetype.character}.
Visual DNA: ${context.logo.dropletPhilosophy}. ${context.logo.gesture}.
Shapes: ${context.shapes.philosophy}. Avoid: ${context.shapes.avoid}.
Colors: Primary Warm Yellow ${context.colors.primary.hex} (${context.colors.primary.ratio} of composition), Deep Blue ${context.colors.secondary[0].hex} (${context.colors.secondary[0].ratio}), Warm Green ${context.colors.secondary[1].hex} (${context.colors.secondary[1].ratio}), Dark Gray ${context.colors.neutrals.dark.hex} (${context.colors.neutrals.dark.ratio}), White ${context.colors.neutrals.light.hex} (${context.colors.neutrals.light.ratio}).
Typography: ${context.typography.heading} for headings, ${context.typography.body} for body text.
Photography: ${context.photography.style}. ${context.photography.lighting}. ${context.photography.subjects}.
Shadows: ${context.visualLanguage.shadowSystem}.
Voice: ${context.voice.character}.`;
}

/**
 * Build brand context suffix (negative prompt additions from brand rules)
 */
export function buildBrandContextNegatives(context: BrandContext): string {
  const forbidden = context.colors.forbidden.join(', ');
  const photoAvoid = context.photography.avoid;
  const shapeAvoid = context.shapes.avoid;
  const logoMisuse = context.logo.misuseRules.slice(0, 3).join(', ');
  const voiceAvoid = context.voice.wordsToAvoid.slice(0, 5).join(', ');

  return `FORBIDDEN COLOR COMBOS: ${forbidden}. AVOID: ${photoAvoid}, ${shapeAvoid}, ${logoMisuse}, ${voiceAvoid}, cold clinical aesthetic, corporate sterile, tech jargon, harsh edges, sharp corners, stock photo look, isolated individuals, staged poses, blue-tinted lighting, neon colors, rainbow gradients, busy cluttered compositions, dark gloomy backgrounds, medical aesthetic, circuit board patterns, corporate grids`;
}

/**
 * Inject brand context into a prompt
 * Takes a base prompt and enriches it with actual brand data
 */
export function injectBrandContext(
  basePrompt: string,
  context: BrandContext,
  options?: {
    includeLogo?: boolean;
    includeTypography?: boolean;
    includePhotography?: boolean;
    includeColors?: boolean;
    includeShapes?: boolean;
    includeVoice?: boolean;
  }
): {
  enrichedPrompt: string;
  enrichedNegative: string;
  brandContextUsed: string[];
} {
  const defaults = {
    includeLogo: true,
    includeTypography: true,
    includePhotography: true,
    includeColors: true,
    includeShapes: true,
    includeVoice: false // Usually not needed for image generation
  };

  const opts = { ...defaults, ...options };
  const brandContextUsed: string[] = [];

  let prefix = `Brand: ${context.brandName} — ${context.essence}. `;

  // Archetype always included
  prefix += `Archetype: ${context.archetype.character}. `;
  brandContextUsed.push('archetype');

  // Logo philosophy
  if (opts.includeLogo) {
    prefix += `${context.logo.dropletPhilosophy} ${context.logo.gesture} `;
    brandContextUsed.push('logo-philosophy');
  }

  // Shapes
  if (opts.includeShapes) {
    prefix += `Shapes: ${context.shapes.philosophy}. Avoid ${context.shapes.avoid}. `;
    brandContextUsed.push('shapes');
  }

  // Colors with exact ratios
  if (opts.includeColors) {
    prefix += `Color palette with composition ratios: Warm Yellow ${context.colors.primary.hex} (${context.colors.primary.ratio}), Deep Blue ${context.colors.secondary[0].hex} (${context.colors.secondary[0].ratio}), Warm Green ${context.colors.secondary[1].hex} (${context.colors.secondary[1].ratio}), Dark Gray ${context.colors.neutrals.dark.hex} (${context.colors.neutrals.dark.ratio}), White ${context.colors.neutrals.light.hex} (${context.colors.neutrals.light.ratio}). `;
    brandContextUsed.push('colors');
  }

  // Typography
  if (opts.includeTypography) {
    prefix += `Typography: ${context.typography.heading} for headings (${context.typography.headingWeights.join(', ')}), ${context.typography.body} for body (${context.typography.bodyWeights.join(', ')}). `;
    brandContextUsed.push('typography');
  }

  // Photography style
  if (opts.includePhotography) {
    prefix += `Photography: ${context.photography.style}. ${context.photography.lighting}. `;
    brandContextUsed.push('photography');
  }

  // Shadow system
  prefix += `Shadows: ${context.visualLanguage.shadowSystem}. `;
  brandContextUsed.push('shadows');

  // Voice (optional)
  if (opts.includeVoice) {
    prefix += `Voice: ${context.voice.character} `;
    brandContextUsed.push('voice');
  }

  const enrichedPrompt = prefix + basePrompt;
  const enrichedNegative = buildBrandContextNegatives(context);

  return {
    enrichedPrompt,
    enrichedNegative,
    brandContextUsed
  };
}

/**
 * Get reference image paths for fal.ai
 * These are actual brand assets that can be used as style references
 */
export function getBrandReferenceImages(context: BrandContext): {
  moodImage: string;
  logoFiles: string[];
  faviconFiles: string[];
} {
  return {
    moodImage: context.assets.moodImage,
    logoFiles: context.logo.variants.map(v => `${context.assets.logosDir}${v.file}`),
    faviconFiles: [
      `${context.assets.faviconsDir}favicon-32x32.png`,
      `${context.assets.faviconsDir}apple-touch-icon-180x180.png`,
      `${context.assets.faviconsDir}android-chrome-192x192.png`
    ]
  };
}

/**
 * Validate a generated image against brand rules
 * Returns issues that need fixing
 */
export function validateAgainstBrandKit(
  imageAnalysis: {
    dominantColors: string[];
    hasSharpCorners: boolean;
    hasText: boolean;
    textContent: string;
    hasLogo: boolean;
    mood: string;
  },
  context: BrandContext
): {
  passed: boolean;
  issues: { type: string; severity: 'low' | 'medium' | 'high'; description: string }[];
} {
  const issues: { type: string; severity: 'low' | 'medium' | 'high'; description: string }[] = [];

  // Check colors against brand palette
  const brandHexes = [
    context.colors.primary.hex,
    ...context.colors.secondary.map(c => c.hex),
    context.colors.neutrals.dark.hex,
    context.colors.neutrals.light.hex
  ];

  for (const color of imageAnalysis.dominantColors) {
    const isBrandColor = brandHexes.some(bc =>
      bc.toLowerCase() === color.toLowerCase()
    );
    if (!isBrandColor) {
      issues.push({
        type: 'off_brand_color',
        severity: 'medium',
        description: `Color ${color} is not in the brand palette`
      });
    }
  }

  // Check for forbidden color combinations
  if (imageAnalysis.dominantColors.includes('#0581A7') &&
      imageAnalysis.dominantColors.includes('#FFC300')) {
    issues.push({
      type: 'forbidden_combo',
      severity: 'high',
      description: 'Deep Blue on Warm Yellow is forbidden (2.5:1 contrast fails WCAG)'
    });
  }

  // Check for sharp corners (brand avoids them)
  if (imageAnalysis.hasSharpCorners) {
    issues.push({
      type: 'sharp_corners',
      severity: 'medium',
      description: 'Brand philosophy avoids sharp corners — use droplet curves instead'
    });
  }

  // Check text content against voice rules
  if (imageAnalysis.hasText) {
    const forbiddenWords = context.voice.wordsToAvoid;
    for (const word of forbiddenWords) {
      if (imageAnalysis.textContent.toLowerCase().includes(word)) {
        issues.push({
          type: 'forbidden_word',
          severity: 'high',
          description: `Text contains forbidden word: "${word}"`
        });
      }
    }
  }

  // Check mood
  if (imageAnalysis.mood === 'cold' || imageAnalysis.mood === 'clinical') {
    issues.push({
      type: 'wrong_mood',
      severity: 'high',
      description: 'Image mood is cold/clinical — brand requires warm + connected'
    });
  }

  return {
    passed: issues.filter(i => i.severity === 'high').length === 0,
    issues
  };
}

/**
 * Load brand context from file system
 * In production, this reads the actual deliverable files
 */
export async function loadBrandContext(brandSlug: string): Promise<BrandContext> {
  // For Allura, return the pre-extracted context
  if (brandSlug === 'allura-memory' || brandSlug === 'allura') {
    return ALLURA_BRAND_CONTEXT;
  }

  // For other brands, would read from file system:
  // const brandKit = await readFile(`clients/${brandSlug}/deliverables/04_brand-kit-builder_brand-kit.md`);
  // const logoPack = await readFile(`clients/${brandSlug}/deliverables/03_visual-director_logo-pack.md`);
  // const brandTruth = await readFile(`clients/${brandSlug}/deliverables/06_allura-memory_brand-truth.json`);
  // return parseBrandContext(brandKit, logoPack, brandTruth);

  throw new Error(`Brand context not found for: ${brandSlug}`);
}
