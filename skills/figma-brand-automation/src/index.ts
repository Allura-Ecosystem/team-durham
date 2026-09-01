/**
 * Figma Brand Automation Skill - Main Entry Point
 *
 * Integrates with Team Durham's 8-phase pipeline and Allura Brain
 * to automate brand kit creation from Figma Community templates.
 *
 * v5.0: Brand-Guided Generation
 * - Brand Context Injector reads ACTUAL deliverables (not random descriptions)
 * - Every prompt is enriched with real brand data before generation
 * - Multi-model stack: Seedream (typography), Nano Banana (UI), Flux (layout), Recraft (vector)
 * - Post-generation validation against brand kit rules
 * - Winning prompt tracking in Allura Brain + Notion
 *
 * Key Principle: Images must be FROM the brand, not just ABOUT it.
 */

import { duplicateCommunityTemplate } from './tools/duplicate-template';
import { analyzeTemplateStructure } from './tools/analyze-template';
import { customizeWithBrand } from './tools/customize-brand';
import { exportDeliverable } from './tools/export-deliverable';
import { runQAValidation } from './tools/qa-validation';
import { logToAlluraBrain } from './utils/allura-brain';
import {
  selectOptimalModel,
  calculateGenerationCost,
  getModelStack,
  ModelUseCase
} from './prompts/model-selection';
import {
  ALLURA_OPTIMIZED_PROMPTS,
  calculateAlluraCampaignCost,
  exportForExecution
} from './prompts/allura-optimized';

// v5.0: Brand-Guided Generation
import {
  BrandContext,
  ALLURA_BRAND_CONTEXT,
  injectBrandContext,
  getBrandReferenceImages,
  validateAgainstBrandKit,
  loadBrandContext
} from './prompts/brand-context-injector';
import {
  BrandGuidedPrompt,
  generateBrandGuidedPrompts,
  calculateCampaignCost as calculateBrandGuidedCampaignCost,
  exportForExecution as exportBrandGuidedForExecution,
  validateGeneration
} from './prompts/allura-brand-guided';
import {
  executeBrandGuidedWorkflow,
  quickGenerate,
  compareApproaches,
  GenerationWorkflowConfig,
  GenerationResult,
  WorkflowResult
} from './prompts/brand-guided-workflow';
import {
  logWinningPrompt,
  queryWinningPrompts,
  getTopPromptsForUseCase,
  updatePromptMetrics,
  syncToNotion,
  generatePromptReport
} from './prompts/winning-prompts-tracking';
import {
  executeModelStack,
  compareApproaches as compareModelStackApproaches
} from './prompts/model-stack';

export interface SkillConfig {
  groupId: string;
  alluraBrainEndpoint: string;
  figmaToken?: string;
  falApiKey?: string;
}

export interface BrandSpecs {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  typography: {
    primaryFont: string;
    fallback: string;
  };
  logos: {
    primary: string;
    secondary?: string;
    icon?: string;
  };
  content: {
    brandName: string;
    tagline?: string;
    archetype?: string;
  };
}

export interface TemplateDuplicateParams {
  communityUrl: string;
  fileName: string;
  planKey: string;
  brandSlug: string;
  agentId: string;
}

export interface TemplateAnalysisParams {
  fileKey: string;
  analysisType: 'full' | 'colors' | 'typography' | 'layout';
  brandSlug: string;
  agentId: string;
}

export interface CustomizationParams {
  fileKey: string;
  brandSlug: string;
  agentId: string;
  customizations: BrandSpecs;
}

export interface ExportParams {
  fileKey: string;
  brandSlug: string;
  agentId: string;
  exportFormat: 'pdf' | 'png' | 'svg';
  pages: string[] | 'all';
  deliverablePath: string;
}

export interface QAParams {
  fileKey: string;
  brandSlug: string;
  agentId: string;
  checks: string[];
}

export interface ImageGenerationParams {
  useCase: ModelUseCase;
  brandSlug: string;
  agentId: string;
  basePrompt: string;
  priority?: 'quality' | 'speed' | 'cost';
  useStack?: boolean;
}

/**
 * Main skill class that exposes all automation tools
 */
export class FigmaBrandAutomationSkill {
  private config: SkillConfig;

  constructor(config: SkillConfig) {
    this.config = {
      groupId: 'allura-team-durham',
      alluraBrainEndpoint: process.env.ALLURA_BRAIN_URL || 'http://localhost:7474',
      ...config
    };
  }

  /**
   * Tool 1: Duplicate a Figma Community template
   */
  async duplicateCommunityTemplate(params: TemplateDuplicateParams) {
    const result = await duplicateCommunityTemplate(params);

    await logToAlluraBrain({
      agentId: params.agentId,
      eventType: 'template_duplicated',
      groupId: this.config.groupId,
      payload: {
        fileKey: result.fileKey,
        templateName: result.templateName,
        brandSlug: params.brandSlug
      }
    });

    return result;
  }

  /**
   * Tool 2: Analyze template structure with AI Vision
   */
  async analyzeTemplateStructure(params: TemplateAnalysisParams) {
    const result = await analyzeTemplateStructure(params);

    await logToAlluraBrain({
      agentId: params.agentId,
      eventType: 'template_analyzed',
      groupId: this.config.groupId,
      payload: {
        fileKey: params.fileKey,
        pagesAnalyzed: result.pagesAnalyzed,
        brandSlug: params.brandSlug
      }
    });

    return result;
  }

  /**
   * Tool 3: Customize template with brand specs
   */
  async customizeWithBrand(params: CustomizationParams) {
    const result = await customizeWithBrand(params);

    await logToAlluraBrain({
      agentId: params.agentId,
      eventType: 'brand_customized',
      groupId: this.config.groupId,
      payload: {
        fileKey: params.fileKey,
        changesApplied: result.customizationsApplied,
        brandSlug: params.brandSlug,
        duration: result.durationSeconds
      }
    });

    return result;
  }

  /**
   * Tool 4: Export deliverable
   */
  async exportDeliverable(params: ExportParams) {
    const result = await exportDeliverable(params);

    await logToAlluraBrain({
      agentId: params.agentId,
      eventType: 'deliverable_exported',
      groupId: this.config.groupId,
      payload: {
        fileKey: params.fileKey,
        exportPath: result.pdfPath || result.pngs[0],
        format: params.exportFormat,
        brandSlug: params.brandSlug
      }
    });

    return result;
  }

  /**
   * Tool 5: Run QA validation
   */
  async runQAValidation(params: QAParams) {
    const result = await runQAValidation(params);

    await logToAlluraBrain({
      agentId: params.agentId,
      eventType: 'qa_validation_complete',
      groupId: this.config.groupId,
      payload: {
        fileKey: params.fileKey,
        qaScore: result.qaScore,
        passed: result.passed,
        failed: result.failed,
        brandSlug: params.brandSlug
      }
    });

    return result;
  }

  /**
   * NEW Tool 6: Generate brand image with optimal model
   */
  async generateBrandImage(params: ImageGenerationParams) {
    const { useCase, brandSlug, agentId, basePrompt, priority = 'quality', useStack = false } = params;

    if (useStack) {
      // Use multi-model stack
      const workflowType = this.mapUseCaseToWorkflow(useCase);
      const result = await executeModelStack(workflowType, brandSlug, agentId, basePrompt);

      await logToAlluraBrain({
        agentId,
        eventType: 'image_stack_generated',
        groupId: this.config.groupId,
        payload: {
          brandSlug,
          useCase,
          workflowType,
          totalCost: result.workflow.totalCost,
          steps: result.workflow.steps.length
        }
      });

      return {
        type: 'stack',
        ...result
      };
    } else {
      // Use single optimal model
      const model = selectOptimalModel(useCase, priority);
      const cost = this.getModelCost(model);

      // Log generation
      await logToAlluraBrain({
        agentId,
        eventType: 'image_generated',
        groupId: this.config.groupId,
        payload: {
          brandSlug,
          useCase,
          model,
          cost,
          priority
        }
      });

      return {
        type: 'single',
        model,
        cost,
        prompt: basePrompt
      };
    }
  }

  /**
   * NEW Tool 7: Get cost estimate before generation
   */
  async estimateGenerationCost(
    useCases: { useCase: ModelUseCase; count: number; priority?: 'quality' | 'speed' | 'cost' }[]
  ): Promise<{
    totalCost: number;
    breakdown: { useCase: string; model: string; count: number; cost: number }[];
  }> {
    return calculateGenerationCost(useCases);
  }

  /**
   * NEW Tool 8: Get Allura optimized prompts
   */
  getAlluraOptimizedPrompts() {
    return {
      prompts: ALLURA_OPTIMIZED_PROMPTS,
      totalCost: calculateAlluraCampaignCost(),
      export: exportForExecution
    };
  }

  /**
   * NEW Tool 9: Track winning prompt
   */
  async trackWinningPrompt(promptData: {
    promptId: string;
    tokenSet: string;
    model: string;
    direction: string;
    brandSlug: string;
    qualityScore: number;
    cost: number;
    tags: string[];
  }) {
    const performance = {
      ...promptData,
      metrics: {
        generationTime: 0,
        cost: promptData.cost,
        qualityScore: promptData.qualityScore,
        usageCount: 1
      },
      outputs: [],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    await logWinningPrompt(performance);

    // Sync to Notion
    await syncToNotion([performance]);

    return { logged: true, syncedToNotion: true };
  }

  /**
   * NEW Tool 10: Get top prompts for use case
   */
  async getTopPrompts(useCase: string, brandSlug?: string, limit: number = 5) {
    return getTopPromptsForUseCase(useCase, brandSlug, limit);
  }

  /**
   * NEW Tool 11: Compare single vs stack approach
   */
  compareGenerationApproaches(workflowType: 'logo-design' | 'brand-kit' | 'social-campaign' | 'web-hero') {
    return compareApproaches(workflowType);
  }

  /**
   * Helper: Map use case to workflow type
   */
  private mapUseCaseToWorkflow(useCase: ModelUseCase): 'logo-design' | 'brand-kit' | 'social-campaign' | 'web-hero' {
    const map: Record<ModelUseCase, 'logo-design' | 'brand-kit' | 'social-campaign' | 'web-hero'> = {
      'typography': 'brand-kit',
      'logo-concept': 'logo-design',
      'hero-image': 'web-hero',
      'ui-mockup': 'web-hero',
      'infographic': 'brand-kit',
      'background': 'brand-kit',
      'quick-draft': 'social-campaign',
      'vector-logo': 'logo-design',
      'brand-poster': 'brand-kit',
      'social-media': 'social-campaign'
    };
    return map[useCase] || 'brand-kit';
  }

  /**
   * Helper: Get model cost
   */
  private getModelCost(model: string): number {
    const costs: Record<string, number> = {
      'fal-ai/nano-banana-2': 0.015,
      'fal-ai/nano-banana-pro': 0.025,
      'fal-ai/flux-dev': 0.012,
      'fal-ai/flux-schnell': 0.003,
      'fal-ai/flux-2-pro': 0.018,
      'fal-ai/seedream-v4.5': 0.02,
      'fal-ai/seedream-v5': 0.025,
      'fal-ai/recraft-v3': 0.02,
      'fal-ai/imagen-4': 0.03
    };
    return costs[model] || 0.012;
  }
}

// Export for use in Claude Code
export default FigmaBrandAutomationSkill;

// Export all prompt modules
export {
  selectOptimalModel,
  calculateGenerationCost,
  getModelStack,
  ALLURA_OPTIMIZED_PROMPTS,
  calculateAlluraCampaignCost,
  exportForExecution,
  executeModelStack,
  compareApproaches,
  logWinningPrompt,
  queryWinningPrompts,
  getTopPromptsForUseCase,
  updatePromptMetrics,
  syncToNotion,
  generatePromptReport
};

// v5.0: Brand-Guided Generation exports
export {
  BrandContext,
  ALLURA_BRAND_CONTEXT,
  injectBrandContext,
  getBrandReferenceImages,
  validateAgainstBrandKit,
  loadBrandContext
} from './prompts/brand-context-injector';

export {
  BrandGuidedPrompt,
  generateBrandGuidedPrompts,
  calculateCampaignCost as calculateBrandGuidedCampaignCost,
  exportForExecution as exportBrandGuidedForExecution,
  validateGeneration
} from './prompts/allura-brand-guided';

export {
  executeBrandGuidedWorkflow,
  quickGenerate,
  compareApproaches as compareBrandGuidedApproaches,
  GenerationWorkflowConfig,
  GenerationResult,
  WorkflowResult
} from './prompts/brand-guided-workflow';

// Re-export types
export type { ModelUseCase } from './prompts/model-selection';
export type { PromptPerformance } from './prompts/winning-prompts-tracking';
};
