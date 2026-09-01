/**
 * Allura Brand Prompts — Brand-Guided Generation v5.0
 *
 * Every prompt now uses the Brand Context Injector to pull
 * ACTUAL brand data from deliverables (not random descriptions).
 *
 * Key improvements over v4:
 * - Droplet philosophy from logo pack injected into every prompt
 * - Color composition ratios from brand truth (7% yellow, 15% blue, etc.)
 * - Typography specs from brand kit (Outfit + Inter)
 * - Photography style from brand truth (documentary, golden hour)
 * - Shadow system from brand kit (3-layer editorial)
 * - Voice rules enforced in negative prompts
 * - Reference images from actual assets
 * - Brand validation after generation
 */

import {
  injectBrandContext,
  ALLURA_BRAND_CONTEXT,
  getBrandReferenceImages,
  validateAgainstBrandKit,
  BrandContext
} from './brand-context-injector';
import { selectOptimalModel, ModelUseCase } from './model-selection';

export interface BrandGuidedPrompt {
  direction: string;
  tokenSet: string;
  model: string;
  promptVersion: string;
  prompt: string;           // Full brand-injected prompt
  basePrompt: string;       // Original prompt before injection
  negativePrompt: string;   // Brand-aware negative prompt
  seed: number;
  resolution: string;
  whyThisModel: string;
  costEstimate: number;
  brandContextUsed: string[];
  referenceImages: string[];
  validationRules: string[];
}

// ============================================================
// BASE PROMPTS (before brand injection)
// These are the creative direction — the injector adds brand data
// ============================================================

const BASE_PROMPTS = [
  // ============================================
  // IMG-1: HERO ABSTRACT — Nano Banana 2
  // ============================================
  {
    direction: "Brand Imagery: Hero Abstract Warmth",
    tokenSet: "IMG-1-NB",
    useCase: "hero-image" as ModelUseCase,
    basePrompt: `Website hero image. Abstract warmth visualization with soft organic droplet forms floating in golden space. Water droplets in gentle motion, connecting, nourishing — embodying the droplet philosophy. Organic soft geometry with editorial sophistication and cinematic composition. Premium warmth without elitism. Clean negative space suitable for text overlay area. The allura gesture — subtle upward curve suggesting a smile. 16:9 wide cinematic.`,
    negativeBase: "text except 'allura', logo misuse, people, faces, harsh edges, sharp corners, rigid geometric forms, neon colors, rainbow gradient, busy composition, cluttered, chaotic, dark gloomy, cold blue, sterile, medical, tech interface, UI buttons, icons, watermark, low resolution, blur, oversaturated, corporate sterile, stock photo look",
    seed: 53101,
    resolution: "landscape_16_9",
    validationRules: [
      "Must have droplet-shaped forms (from logo philosophy)",
      "Warm Yellow must be ~7% of composition",
      "White/Cream must be ~50% of composition",
      "No sharp corners allowed",
      "Mood must be warm, not cold"
    ]
  },

  // ============================================
  // IMG-2: COMMUNITY — Nano Banana Pro
  // ============================================
  {
    direction: "Brand Imagery: Community Gathering",
    tokenSet: "IMG-2-NBP",
    useCase: "hero-image" as ModelUseCase,
    basePrompt: `Community gathering scene. Diverse people in soft focus, connected through shared experience and storytelling. Genuine human connection, care, warmth. Intergenerational, inclusive, welcoming atmosphere. People sharing memories, togetherness. The feeling of a neighborhood gathering spot — technology that feels like home. 4:5 portrait composition for social media.`,
    negativeBase: "stock photo, generic, cheesy poses, fake smiles, corporate diversity, tokenism, overexposed, harsh flash, cold lighting, blue tones, sterile hospital, tech conference, business meeting, isolated individuals, social distancing, masks, text overlay, watermark, logo misuse, sharp corners, rigid forms, low resolution, distorted faces, blur, AI-generated look, cold clinical mood",
    seed: 53102,
    resolution: "portrait_4_5",
    validationRules: [
      "Must show genuine connection (not staged)",
      "Lighting must be golden hour / warm",
      "No isolated individuals (brand = connection)",
      "Diverse, intergenerational subjects",
      "Mood must be warm + welcoming"
    ]
  },

  // ============================================
  // IMG-3: PATTERN — Flux Dev
  // ============================================
  {
    direction: "Brand Imagery: Memory Keep Pattern",
    tokenSet: "IMG-3-FLUX",
    useCase: "background" as ModelUseCase,
    basePrompt: `Seamless repeating brand pattern. Soft droplet motifs, organic flowing curves, connected shapes in rhythmic balance — directly inspired by the droplet philosophy from the allura logo. Water ripple textures, memory trails, flowing connections. Elegant negative space, sophisticated repetition. Editorial textile quality, handcrafted feel. Not busy, not chaotic. Rounded, warm, inviting geometry. Square tileable pattern.`,
    negativeBase: "text, logo, busy pattern, chaotic repetition, harsh geometric, sharp corners, corporate grid, tech pattern, circuit board, medical cross, rainbow explosion, bright neon, cluttered, overwhelming, photographic, realistic objects, isolated elements on white, watermark, low resolution, pixelated, rigid forms, cold clinical",
    seed: 53103,
    resolution: "square_hd",
    validationRules: [
      "Must use droplet motifs (from logo philosophy)",
      "Must be tileable/seamless",
      "Warm Yellow 7%, Deep Blue 15%, Warm Green 3% ratios",
      "No sharp corners in pattern elements",
      "Must feel handcrafted, not corporate"
    ]
  },

  // ============================================
  // IMG-4: CRAFT DETAIL — Flux Dev
  // ============================================
  {
    direction: "Brand Imagery: Creator Craft Detail",
    tokenSet: "IMG-4-FLUX",
    useCase: "background" as ModelUseCase,
    basePrompt: `Intimate craft detail. Close-up of hands working with warm natural materials, artisan quality. The feeling of care, attention, human touch — craft with intention and thoughtfulness. Handcrafted with love, not mass production. Warm wood grain, soft paper textures, natural fibers. Shallow depth of field, editorial product photography aesthetic. 4:5 portrait composition.`,
    negativeBase: "factory, mass production, sterile lab, cold metal, plastic, harsh lighting, blue tones, computer screen, typing, AI generated text, stock photo hands, fake pose, manicured corporate, luxury elitism, text overlay, watermark, logo misuse, low resolution, blur, robotic, sharp corners, rigid forms, cold clinical",
    seed: 53104,
    resolution: "portrait_4_5",
    validationRules: [
      "Must feel handcrafted (brand value: Craft)",
      "Warm natural lighting required",
      "No cold/sterile materials",
      "Must convey care and intention",
      "Mood: warm, human, authentic"
    ]
  },

  // ============================================
  // LOGO-1: HERO UI — Seedream (typography)
  // ============================================
  {
    direction: "Brand Imagery: Logo Hero UI",
    tokenSet: "LOGO-1-SEEDREAM",
    useCase: "typography" as ModelUseCase,
    basePrompt: `Premium brand poster. Modern UI card interface with soft rounded corners (12-16px radius) floating in warm gradient space. The wordmark "allura" in elegant lowercase sans-serif with the signature upward curve on the final 'a' (the allura gesture). Droplet-shaped UI elements suggesting water and connection. Editorial sophistication, generous negative space. 3-layer editorial shadow system for depth. High-end brand campaign poster suitable for website hero. 16:9 cinematic composition.`,
    negativeBase: "cluttered, busy, harsh shadows, corporate sterile, tech interface with buttons, realistic photo, people, faces, stock imagery, neon colors, rainbow gradient, sharp angles, geometric harsh, watermark, text except 'allura', low resolution, blur, dark gloomy, cold blue, medical aesthetic, multiple logos, sharp corners, rigid forms, flat shadows",
    seed: 53201,
    resolution: "landscape_16_9",
    validationRules: [
      "Must include 'allura' wordmark with upward 'a' curve",
      "Card corners must be 12-16px radius (brand spec)",
      "Must use 3-layer shadow system",
      "Warm Yellow ~7%, Deep Blue ~15% composition ratios",
      "Typography: Outfit heading style"
    ]
  },

  // ============================================
  // LOGO-2: SOCIAL CARDS — Seedream
  // ============================================
  {
    direction: "Brand Imagery: Logo Social Cards",
    tokenSet: "LOGO-2-SEEDREAM",
    useCase: "social-media" as ModelUseCase,
    basePrompt: `Instagram-ready brand card. Soft rounded square cards (12-16px radius) floating with gentle 3-layer editorial shadows suggesting depth and warmth. The word "allura" appears elegantly in lowercase typography with the signature upward 'a' curve. Organic droplet motifs integrated into composition. Premium lifestyle brand aesthetic, warm inviting community feel. No people, focus on brand identity and elegant UI elements. Square composition optimized for social feed.`,
    negativeBase: "text except 'allura', cluttered, busy background, harsh lighting, stock photo, realistic people, faces, corporate sterile, tech buttons and icons, neon colors, watermark, low resolution, dark gloomy, cold aesthetic, medical, geometric sharp, sharp corners, rigid forms, flat shadows, multiple text elements",
    seed: 53202,
    resolution: "square_hd",
    validationRules: [
      "Must include 'allura' with upward 'a' curve",
      "Card corners must be 12-16px radius",
      "Must use 3-layer shadow system",
      "Square format for Instagram",
      "No people (brand identity focus)"
    ]
  },

  // ============================================
  // LOGO-3: PATTERN — Recraft (vector)
  // ============================================
  {
    direction: "Brand Imagery: Logo Pattern Texture",
    tokenSet: "LOGO-3-RECRAFT",
    useCase: "vector-logo" as ModelUseCase,
    basePrompt: `Elegant vector brand pattern with subtle integration of the wordmark "allura" in flowing organic layout. Seamless texture with soft droplet forms (from droplet philosophy), rounded geometric shapes (12-16px radius), flowing curves. Minimal repetition, editorial textile quality. The logo appears integrated like premium fashion brand pattern. Clean vector style, scalable design. Square tileable composition.`,
    negativeBase: "busy pattern, chaotic repetition, harsh geometric, sharp corners, corporate grid, tech circuit, medical cross, text other than 'allura', watermark, logo placement awkward, rainbow colors, neon, bright saturated, cluttered, overwhelming, low resolution, photographic, raster, rigid forms, cold clinical",
    seed: 53203,
    resolution: "square_hd",
    validationRules: [
      "Must be vector-style (Recraft specialty)",
      "Must include droplet forms",
      "Must be tileable/seamless",
      "No sharp corners",
      "'allura' wordmark integrated naturally"
    ]
  },

  // ============================================
  // LOGO-4: PRESENTATION COVER — Seedream
  // ============================================
  {
    direction: "Brand Imagery: Logo Presentation Cover",
    tokenSet: "LOGO-4-SEEDREAM",
    useCase: "brand-poster" as ModelUseCase,
    basePrompt: `Premium presentation cover slide. The wordmark "allura" positioned elegantly with ample breathing room and sophisticated typography — the signature upward 'a' curve creating a subtle smile. Abstract warm gradient background transitioning from Warm Yellow through cream to soft Deep Blue. Floating rounded UI card elements (12-16px radius) with 3-layer editorial shadows suggesting modern technology and community connection. Editorial design, generous negative space, high-end brand identity feel. 16:9 wide cinematic quality.`,
    negativeBase: "text except 'allura', cluttered, busy, harsh shadows, realistic photo, people, stock imagery, corporate cold, tech interface with buttons and icons, neon colors, rainbow gradient, sharp angles, watermark, low resolution, blur, dark gloomy background, medical aesthetic, competing text elements, sharp corners, rigid forms, flat shadows",
    seed: 53204,
    resolution: "landscape_16_9",
    validationRules: [
      "Must include 'allura' with upward 'a' curve",
      "Must use 3-layer shadow system",
      "Card corners must be 12-16px radius",
      "Color ratios: White 50%, Dark Gray 25%, Deep Blue 15%, Yellow 7%",
      "16:9 presentation format"
    ]
  }
];

// ============================================================
// GENERATE BRAND-GUIDED PROMPTS
// ============================================================

/**
 * Generate all Allura prompts with brand context injected
 */
export function generateBrandGuidedPrompts(
  context: BrandContext = ALLURA_BRAND_CONTEXT
): BrandGuidedPrompt[] {
  const references = getBrandReferenceImages(context);

  return BASE_PROMPTS.map(base => {
    // Inject brand context into prompt
    const { enrichedPrompt, enrichedNegative, brandContextUsed } = injectBrandContext(
      base.basePrompt,
      context,
      {
        includeLogo: true,
        includeTypography: true,
        includePhotography: base.useCase === 'hero-image',
        includeColors: true,
        includeShapes: true,
        includeVoice: false
      }
    );

    // Select optimal model
    const model = selectOptimalModel(base.useCase, 'quality');

    // Combine negative prompts
    const fullNegative = `${base.negativeBase}, ${enrichedNegative}`;

    return {
      direction: base.direction,
      tokenSet: base.tokenSet,
      model,
      promptVersion: "5.0",
      prompt: enrichedPrompt,
      basePrompt: base.basePrompt,
      negativePrompt: fullNegative,
      seed: base.seed,
      resolution: base.resolution,
      whyThisModel: getModelReason(base.useCase),
      costEstimate: getCostEstimate(model),
      brandContextUsed,
      referenceImages: [
        references.moodImage,
        ...references.logoFiles.slice(0, 2)
      ],
      validationRules: base.validationRules
    };
  });
}

/**
 * Get model reason for prompt metadata
 */
function getModelReason(useCase: ModelUseCase): string {
  const reasons: Record<string, string> = {
    'typography': 'Seedream v4.5 has best-in-class typography and poster design',
    'hero-image': 'Nano Banana 2 excels at clean hero images with space for text overlay',
    'background': 'Flux Dev excels at patterns, layouts, and abstract compositions',
    'vector-logo': 'Recraft V3 outputs vector-style clean shapes perfect for patterns',
    'social-media': 'Seedream v4.5 excels at social media layouts with text',
    'brand-poster': 'Seedream v4.5 is best for presentation covers with text integration',
    'logo-concept': 'Recraft V3 produces clean vector-style logo concepts',
    'ui-mockup': 'Nano Banana 2 produces clean UI mockups',
    'infographic': 'Seedream v4.5 has best typography for data-heavy layouts',
    'quick-draft': 'Flux Schnell is fastest for rapid ideation'
  };
  return reasons[useCase] || 'Optimal model for this use case';
}

/**
 * Get cost estimate for model
 */
function getCostEstimate(model: string): number {
  const costs: Record<string, number> = {
    'fal-ai/nano-banana-2': 0.015,
    'fal-ai/nano-banana-pro': 0.025,
    'fal-ai/flux-dev': 0.012,
    'fal-ai/flux-schnell': 0.003,
    'fal-ai/flux-2-pro': 0.018,
    'fal-ai/seedream-v4.5': 0.02,
    'fal-ai/recraft-v3': 0.02,
    'fal-ai/imagen-4': 0.03
  };
  return costs[model] || 0.015;
}

/**
 * Export prompts for fal.ai execution
 */
export function exportForExecution(): {
  model: string;
  prompt: string;
  negative_prompt: string;
  seed: number;
  resolution: string;
  tokenSet: string;
  reference_images: string[];
  validation_rules: string[];
}[] {
  const prompts = generateBrandGuidedPrompts();
  return prompts.map(p => ({
    model: p.model,
    prompt: p.prompt,
    negative_prompt: p.negativePrompt,
    seed: p.seed,
    resolution: p.resolution,
    tokenSet: p.tokenSet,
    reference_images: p.referenceImages,
    validation_rules: p.validationRules
  }));
}

/**
 * Calculate total campaign cost
 */
export function calculateCampaignCost(): {
  total: number;
  byModel: Record<string, { count: number; cost: number }>;
  savingsVsSingleModel: number;
} {
  const prompts = generateBrandGuidedPrompts();
  const byModel: Record<string, { count: number; cost: number }> = {};
  let total = 0;

  for (const prompt of prompts) {
    if (!byModel[prompt.model]) {
      byModel[prompt.model] = { count: 0, cost: 0 };
    }
    byModel[prompt.model].count++;
    byModel[prompt.model].cost += prompt.costEstimate;
    total += prompt.costEstimate;
  }

  // Compare to single model (flux-lora at $0.012/image)
  const singleModelCost = 8 * 0.012;
  const savingsVsSingleModel = Math.round((total - singleModelCost) * 1000) / 1000;

  return {
    total: Math.round(total * 1000) / 1000,
    byModel,
    savingsVsSingleModel
  };
}

/**
 * Validate a generated image against brand rules
 */
export function validateGeneration(
  imageAnalysis: {
    dominantColors: string[];
    hasSharpCorners: boolean;
    hasText: boolean;
    textContent: string;
    hasLogo: boolean;
    mood: string;
  },
  tokenSet: string
): {
  passed: boolean;
  issues: { type: string; severity: 'low' | 'medium' | 'high'; description: string }[];
  tokenSet: string;
} {
  const result = validateAgainstBrandKit(imageAnalysis, ALLURA_BRAND_CONTEXT);
  return {
    ...result,
    tokenSet
  };
}
