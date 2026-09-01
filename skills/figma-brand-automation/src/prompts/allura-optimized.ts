/**
 * Allura Brand Prompts - Optimized for 2026 Models
 *
 * Based on research:
 * - Seedream v4.5: Best typography, posters, text-heavy
 * - Nano Banana 2: Best UI, hero images, clean compositions
 * - Flux Dev: Best backgrounds, layouts, abstract
 * - Recraft V3: Vector logos, icons
 */

export interface OptimizedPrompt {
  direction: string;
  tokenSet: string;
  model: string;
  promptVersion: string;
  prompt: string;
  negativePrompt: string;
  seed: number;
  resolution: string;
  whyThisModel: string;
  expectedStrengths: string[];
  costEstimate: number;
}

export const ALLURA_OPTIMIZED_PROMPTS: OptimizedPrompt[] = [
  // ============================================
  // HERO IMAGES - Nano Banana 2 (best UI/hero)
  // ============================================
  {
    direction: "Brand Imagery: Hero Abstract Warmth",
    tokenSet: "IMG-1-NB",
    model: "fal-ai/nano-banana-2",
    promptVersion: "4.0",
    prompt: `Premium brand hero for Allura Memory. Abstract warmth visualization with soft organic droplet forms floating in golden space. Warm Yellow (#FFC300) and Deep Blue (#0581A7) interplay with cream and soft white. Water droplets in gentle motion, connecting, nourishing. Organic soft geometry, editorial sophistication, cinematic composition. Premium warmth without elitism. Clean negative space suitable for website hero with text overlay area. 16:9 wide cinematic.`,
    negativePrompt: "text, logo, typography, people, faces, harsh edges, sharp angles, neon colors, rainbow gradient, busy composition, cluttered, chaotic, dark gloomy, cold blue, sterile, medical, tech interface, UI elements, buttons, icons, watermark, low resolution, blur, oversaturated",
    seed: 53101,
    resolution: "landscape_16_9",
    whyThisModel: "Nano Banana 2 excels at clean hero images with space for text overlay",
    expectedStrengths: ["clean-composition", "4k-output", "text-ready"],
    costEstimate: 0.015
  },

  // ============================================
  // COMMUNITY - Nano Banana Pro (better detail)
  // ============================================
  {
    direction: "Brand Imagery: Community Gathering",
    tokenSet: "IMG-2-NBP",
    model: "fal-ai/nano-banana-pro",
    promptVersion: "4.0",
    prompt: `Editorial lifestyle photography for Allura Memory brand. Warm community scene with diverse people in soft focus, genuine connection through shared storytelling. Golden hour ambient lighting with Warm Yellow (#FFC300) and cream tones dominant. Intergenerational gathering, inclusive, welcoming atmosphere. Elevated documentary feel, authentic human warmth. Not stock photo aesthetic. Premium lifestyle brand photography. 4:5 portrait composition for social media.`,
    negativePrompt: "stock photo, generic, cheesy poses, fake smiles, corporate diversity, tokenism, overexposed, harsh flash, cold lighting, blue tones, sterile hospital, tech conference, business meeting, isolated people, masks, text overlay, watermark, logo, low resolution, distorted faces, blur, AI-generated look",
    seed: 53102,
    resolution: "portrait_4_5",
    whyThisModel: "Nano Banana Pro has better detail and composition for people shots",
    expectedStrengths: ["detail", "composition", "realism"],
    costEstimate: 0.025
  },

  // ============================================
  // PATTERNS - Flux Dev (best for backgrounds)
  // ============================================
  {
    direction: "Brand Imagery: Memory Keep Pattern",
    tokenSet: "IMG-3-FLUX",
    model: "fal-ai/flux-dev",
    promptVersion: "4.0",
    prompt: `Seamless brand pattern for Allura Memory. Soft droplet motifs, organic flowing curves, connected shapes in rhythmic balance. Warm Yellow (#FFC300), Deep Blue (#0581A7), Warm Green (#BDBD0D) palette. Water ripple textures, memory trails, flowing connections. Elegant negative space, sophisticated repetition. Editorial textile quality, handcrafted feel. Not busy, not chaotic. Rounded, warm, inviting geometry. Square tileable pattern.`,
    negativePrompt: "text, logo, busy pattern, chaotic, geometric harsh, sharp corners, corporate grid, tech pattern, circuit board, medical cross, rainbow explosion, bright neon, cluttered, overwhelming, photographic, realistic objects, isolated elements on white, watermark, low resolution, pixelated",
    seed: 53103,
    resolution: "square_hd",
    whyThisModel: "Flux Dev excels at patterns, layouts, and abstract compositions",
    expectedStrengths: ["layout", "abstract", "cost-effective"],
    costEstimate: 0.012
  },

  // ============================================
  // CRAFT DETAIL - Flux Dev (good textures)
  // ============================================
  {
    direction: "Brand Imagery: Creator Craft Detail",
    tokenSet: "IMG-4-FLUX",
    model: "fal-ai/flux-dev",
    promptVersion: "4.0",
    prompt: `Intimate craft detail photography for Allura Memory brand. Close-up of hands working with warm natural materials, artisan quality. Editorial product photography aesthetic with shallow depth of field. Warm wood grain, soft paper textures, natural fibers. Warm Yellow (#FFC300) and cream tones with Deep Blue (#0581A7) accents. Feeling of care, attention, human touch. Handcrafted with love, not mass production. Intimate 4:5 composition.`,
    negativePrompt: "factory, mass production, sterile lab, cold metal, plastic, harsh lighting, blue tones, computer screen, typing, AI generated text, stock photo hands, fake pose, manicured corporate, luxury elitism, text overlay, watermark, logo, low resolution, blur, robotic",
    seed: 53104,
    resolution: "portrait_4_5",
    whyThisModel: "Flux Dev handles textures and materials well at low cost",
    expectedStrengths: ["texture", "materials", "cost-effective"],
    costEstimate: 0.012
  },

  // ============================================
  // LOGO HERO - Seedream (best typography)
  // ============================================
  {
    direction: "Brand Imagery: Logo Hero UI",
    tokenSet: "LOGO-1-SEEDREAM",
    model: "fal-ai/seedream-v4.5",
    promptVersion: "4.0",
    prompt: `Premium brand poster for Allura Memory featuring elegant typography. Modern UI card interface with soft rounded corners floating in warm gradient space. The word "allura" in sophisticated lowercase sans-serif. Warm Yellow (#FFC300) and Deep Blue (#0581A7) gradient interplay with cream. Droplet-shaped UI elements suggesting water and connection. Editorial sophistication, generous negative space. High-end brand campaign poster suitable for website hero. 16:9 cinematic composition.`,
    negativePrompt: "cluttered, busy, harsh shadows, corporate sterile, tech interface with buttons, realistic photo, people, faces, stock imagery, neon colors, rainbow gradient, sharp angles, geometric harsh, watermark, text overlay except 'allura', low resolution, blur, dark gloomy, cold blue, medical aesthetic, multiple logos",
    seed: 53201,
    resolution: "landscape_16_9",
    whyThisModel: "Seedream v4.5 has best-in-class typography and poster design",
    expectedStrengths: ["typography", "poster-design", "text-integration"],
    costEstimate: 0.02
  },

  // ============================================
  // SOCIAL CARDS - Seedream (text + layout)
  // ============================================
  {
    direction: "Brand Imagery: Logo Social Cards",
    tokenSet: "LOGO-2-SEEDREAM",
    model: "fal-ai/seedream-v4.5",
    promptVersion: "4.0",
    prompt: `Instagram-ready brand card for Allura Memory. Soft rounded square cards floating with gentle shadows and depth. The word "allura" appears elegantly in minimal lowercase typography. Warm Yellow (#FFC300) highlights with cream background and Deep Blue (#0581A7) accents. Organic droplet motifs integrated into composition. Premium lifestyle brand aesthetic, warm inviting community feel. No people, focus on brand identity and elegant UI elements. Square composition optimized for social feed.`,
    negativePrompt: "text except 'allura', cluttered, busy background, harsh lighting, stock photo, realistic people, faces, corporate sterile, tech buttons and icons, neon colors, watermark, low resolution, dark gloomy, cold aesthetic, medical, geometric sharp, multiple text elements",
    seed: 53202,
    resolution: "square_hd",
    whyThisModel: "Seedream excels at social media layouts with text",
    expectedStrengths: ["typography", "social-layout", "brand-identity"],
    costEstimate: 0.02
  },

  // ============================================
  // LOGO PATTERN - Recraft (vector output)
  // ============================================
  {
    direction: "Brand Imagery: Logo Pattern Texture",
    tokenSet: "LOGO-3-RECRAFT",
    model: "fal-ai/recraft-v3",
    promptVersion: "4.0",
    prompt: `Elegant vector brand pattern for Allura Memory with subtle integration of the wordmark "allura" in flowing organic layout. Seamless texture with soft droplet forms, rounded geometric shapes, flowing curves. Warm Yellow (#FFC300), Deep Blue (#0581A7), cream tones in sophisticated rhythm. Minimal repetition, editorial textile quality. The logo appears integrated like premium fashion brand pattern. Clean vector style, scalable design. Square tileable composition.`,
    negativePrompt: "busy pattern, chaotic repetition, harsh geometric, corporate grid, tech circuit, medical cross, text other than 'allura', watermark, logo placement awkward, rainbow colors, neon, bright saturated, cluttered, overwhelming, low resolution, photographic, raster",
    seed: 53203,
    resolution: "square_hd",
    whyThisModel: "Recraft V3 outputs vector-style clean shapes perfect for patterns",
    expectedStrengths: ["vector-style", "clean-shapes", "scalable"],
    costEstimate: 0.02
  },

  // ============================================
  // PRESENTATION COVER - Seedream (poster design)
  // ============================================
  {
    direction: "Brand Imagery: Logo Presentation Cover",
    tokenSet: "LOGO-4-SEEDREAM",
    model: "fal-ai/seedream-v4.5",
    promptVersion: "4.0",
    prompt: `Premium presentation cover slide for Allura Memory brand. The wordmark "allura" positioned elegantly with ample breathing room and sophisticated typography. Abstract warm gradient background transitioning from Warm Yellow (#FFC300) through cream to soft Deep Blue (#0581A7). Floating rounded UI card elements suggesting modern technology and community connection. Editorial design, generous negative space, high-end brand identity feel. Suitable for keynote presentations, pitch decks, brand guidelines cover. 16:9 wide cinematic quality.`,
    negativePrompt: "text except 'allura', cluttered, busy, harsh shadows, realistic photo, people, stock imagery, corporate cold, tech interface with buttons and icons, neon colors, rainbow gradient, sharp angles, watermark, low resolution, blur, dark gloomy background, medical aesthetic, competing text elements",
    seed: 53204,
    resolution: "landscape_16_9",
    whyThisModel: "Seedream is best for presentation covers with text integration",
    expectedStrengths: ["typography", "poster-design", "presentation-layout"],
    costEstimate: 0.02
  }
];

/**
 * Get prompts by model
 */
export function getPromptsByModel(model: string): OptimizedPrompt[] {
  return ALLURA_OPTIMIZED_PROMPTS.filter(p => p.model === model);
}

/**
 * Get prompts by use case
 */
export function getPromptsByUseCase(useCase: string): OptimizedPrompt[] {
  const useCaseMap: Record<string, string[]> = {
    'hero': ['IMG-1-NB'],
    'community': ['IMG-2-NBP'],
    'pattern': ['IMG-3-FLUX', 'LOGO-3-RECRAFT'],
    'craft': ['IMG-4-FLUX'],
    'logo-hero': ['LOGO-1-SEEDREAM'],
    'social': ['LOGO-2-SEEDREAM'],
    'presentation': ['LOGO-4-SEEDREAM']
  };

  const tokenSets = useCaseMap[useCase] || [];
  return ALLURA_OPTIMIZED_PROMPTS.filter(p => tokenSets.includes(p.tokenSet));
}

/**
 * Calculate total cost for Allura campaign
 */
export function calculateAlluraCampaignCost(): {
  total: number;
  byModel: Record<string, { count: number; cost: number }>;
} {
  const byModel: Record<string, { count: number; cost: number }> = {};
  let total = 0;

  for (const prompt of ALLURA_OPTIMIZED_PROMPTS) {
    if (!byModel[prompt.model]) {
      byModel[prompt.model] = { count: 0, cost: 0 };
    }
    byModel[prompt.model].count++;
    byModel[prompt.model].cost += prompt.costEstimate;
    total += prompt.costEstimate;
  }

  return {
    total: Math.round(total * 1000) / 1000,
    byModel
  };
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
}[] {
  return ALLURA_OPTIMIZED_PROMPTS.map(p => ({
    model: p.model,
    prompt: p.prompt,
    negative_prompt: p.negativePrompt,
    seed: p.seed,
    resolution: p.resolution,
    tokenSet: p.tokenSet
  }));
}
