/**
 * Model Selection Engine
 *
 * Selects optimal fal.ai model based on use case
 * Based on 2026 research: Seedream (typography), Nano Banana (UI), Flux (layout)
 */

export type ModelUseCase =
  | 'typography'
  | 'logo-concept'
  | 'hero-image'
  | 'ui-mockup'
  | 'infographic'
  | 'background'
  | 'quick-draft'
  | 'vector-logo'
  | 'brand-poster'
  | 'social-media';

export interface ModelConfig {
  model: string;
  costPerImage: number;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  'fal-ai/nano-banana-2': {
    model: 'fal-ai/nano-banana-2',
    costPerImage: 0.015,
    strengths: ['text-rendering', 'complex-prompts', '4k-output', 'reference-images'],
    weaknesses: ['typography-not-perfect', 'ai-polish-look'],
    bestFor: ['logos-concept', 'ui', 'product-visuals', 'hero-images']
  },
  'fal-ai/nano-banana-pro': {
    model: 'fal-ai/nano-banana-pro',
    costPerImage: 0.025,
    strengths: ['composition', 'detail', 'prompt-understanding'],
    weaknesses: ['slower', 'expensive'],
    bestFor: ['hero-images', 'branding-visuals', 'high-end']
  },
  'fal-ai/flux-dev': {
    model: 'fal-ai/flux-dev',
    costPerImage: 0.012,
    strengths: ['cost-quality-ratio', 'lora-ecosystem', 'layouts', 'composition'],
    weaknesses: ['weak-typography', 'needs-tuning'],
    bestFor: ['infographics', 'layout-systems', 'backgrounds', 'abstract']
  },
  'fal-ai/flux-schnell': {
    model: 'fal-ai/flux-schnell',
    costPerImage: 0.003,
    strengths: ['fastest', 'ultra-cheap', 'sub-second'],
    weaknesses: ['lower-quality', 'weak-detail', 'weak-text'],
    bestFor: ['rapid-ideation', 'drafts', 'quick-tests']
  },
  'fal-ai/flux-2-pro': {
    model: 'fal-ai/flux-2-pro',
    costPerImage: 0.018,
    strengths: ['high-quality', 'editing-workflows', 'refined'],
    weaknesses: ['costs-more', 'weak-text'],
    bestFor: ['refined-visuals', 'design-passes', 'final-output']
  },
  'fal-ai/seedream-v4.5': {
    model: 'fal-ai/seedream-v4.5',
    costPerImage: 0.02,
    strengths: ['best-typography', 'poster-design', 'prompt-adherence', 'batch-generation'],
    weaknesses: ['less-flexible-styles', 'template-like'],
    bestFor: ['infographics', 'posters', 'text-heavy', 'brand-messaging']
  },
  'fal-ai/seedream-v5': {
    model: 'fal-ai/seedream-v5',
    costPerImage: 0.025,
    strengths: ['unified-gen-edit', 'typography', 'structure'],
    weaknesses: ['expensive', 'newer'],
    bestFor: ['infographics', 'posters', 'text-layouts']
  },
  'fal-ai/recraft-v3': {
    model: 'fal-ai/recraft-v3',
    costPerImage: 0.02,
    strengths: ['vector-style', 'clean-shapes', 'icons', 'scalable'],
    weaknesses: ['less-realistic', 'limited-creative-range'],
    bestFor: ['logos', 'icons', 'brand-systems', 'vector-output']
  },
  'fal-ai/imagen-4': {
    model: 'fal-ai/imagen-4',
    costPerImage: 0.03,
    strengths: ['best-realism', 'lighting', 'materials', 'detail'],
    weaknesses: ['not-design-focused', 'mid-typography'],
    bestFor: ['product-shots', 'marketing-visuals', 'photorealism']
  }
};

export const USE_CASE_MODEL_MAP: Record<ModelUseCase, string[]> = {
  'typography': ['fal-ai/seedream-v4.5', 'fal-ai/seedream-v5', 'fal-ai/nano-banana-2'],
  'logo-concept': ['fal-ai/recraft-v3', 'fal-ai/nano-banana-2', 'fal-ai/flux-dev'],
  'hero-image': ['fal-ai/nano-banana-2', 'fal-ai/nano-banana-pro', 'fal-ai/flux-2-pro'],
  'ui-mockup': ['fal-ai/nano-banana-2', 'fal-ai/flux-dev', 'fal-ai/seedream-v4.5'],
  'infographic': ['fal-ai/seedream-v4.5', 'fal-ai/flux-dev', 'fal-ai/nano-banana-2'],
  'background': ['fal-ai/flux-dev', 'fal-ai/flux-schnell', 'fal-ai/nano-banana-2'],
  'quick-draft': ['fal-ai/flux-schnell', 'fal-ai/flux-dev'],
  'vector-logo': ['fal-ai/recraft-v3', 'fal-ai/seedream-v4.5'],
  'brand-poster': ['fal-ai/seedream-v4.5', 'fal-ai/nano-banana-pro', 'fal-ai/flux-2-pro'],
  'social-media': ['fal-ai/seedream-v4.5', 'fal-ai/nano-banana-2', 'fal-ai/flux-dev']
};

/**
 * Select optimal model for use case
 */
export function selectOptimalModel(useCase: ModelUseCase, priority: 'quality' | 'speed' | 'cost' = 'quality'): string {
  const candidates = USE_CASE_MODEL_MAP[useCase];

  if (!candidates || candidates.length === 0) {
    return 'fal-ai/flux-dev'; // Default fallback
  }

  if (priority === 'cost') {
    // Return cheapest option
    return candidates.sort((a, b) =>
      MODEL_REGISTRY[a].costPerImage - MODEL_REGISTRY[b].costPerImage
    )[0];
  }

  if (priority === 'speed') {
    // Return fastest (schnell for flux, or nano banana)
    return candidates.find(m => m.includes('schnell')) ||
           candidates.find(m => m.includes('nano-banana')) ||
           candidates[0];
  }

  // Quality: return first (already ordered by quality)
  return candidates[0];
}

/**
 * Calculate cost for generation plan
 */
export function calculateGenerationCost(
  useCases: { useCase: ModelUseCase; count: number; priority?: 'quality' | 'speed' | 'cost' }[]
): {
  totalCost: number;
  breakdown: { useCase: string; model: string; count: number; cost: number }[];
} {
  const breakdown: { useCase: string; model: string; count: number; cost: number }[] = [];
  let totalCost = 0;

  for (const { useCase, count, priority = 'quality' } of useCases) {
    const model = selectOptimalModel(useCase, priority);
    const modelConfig = MODEL_REGISTRY[model];
    const cost = modelConfig.costPerImage * count;

    breakdown.push({
      useCase,
      model,
      count,
      cost: Math.round(cost * 1000) / 1000
    });

    totalCost += cost;
  }

  return {
    totalCost: Math.round(totalCost * 1000) / 1000,
    breakdown
  };
}

/**
 * Get model stack for complex workflows
 */
export function getModelStack(workflow: 'logo-design' | 'brand-kit' | 'social-campaign' | 'web-hero'): string[] {
  const stacks: Record<string, string[]> = {
    'logo-design': [
      'fal-ai/flux-dev',        // Layout & composition
      'fal-ai/seedream-v4.5',   // Typography
      'fal-ai/recraft-v3'       // Vector output
    ],
    'brand-kit': [
      'fal-ai/flux-dev',        // Backgrounds & patterns
      'fal-ai/seedream-v4.5',   // Posters & messaging
      'fal-ai/nano-banana-2'    // Hero images
    ],
    'social-campaign': [
      'fal-ai/seedream-v4.5',   // Text-heavy posts
      'fal-ai/nano-banana-2',   // Clean visuals
      'fal-ai/flux-schnell'     // Quick variations
    ],
    'web-hero': [
      'fal-ai/flux-dev',        // Layout
      'fal-ai/nano-banana-2',   // Polish
      'fal-ai/seedream-v4.5'    // Text integration
    ]
  };

  return stacks[workflow] || ['fal-ai/flux-dev'];
}
