/**
 * Winning Prompts Tracking System
 *
 * Tracks successful prompts in Allura Brain (PostgreSQL episodic + RuVector semantic graph)
 * and syncs with Notion for team visibility.
 *
 * NOTE: Semantic graph operations (promotion, graph queries) are not implemented in this
 * stub. The previous Neo4j Cypher path was removed in AD-50 (2026-07-17). The RuVector
 * semantic graph is governed through the allura-brain_memory_* MCP interface with HITL
 * approval. To wire promotion, call allura-brain_memory_promote with the episodic memory ID.
 */

export interface PromptPerformance {
  promptId: string;
  tokenSet: string;
  model: string;
  direction: string;
  brandSlug: string;
  metrics: {
    generationTime: number;
    cost: number;
    qualityScore?: number; // 1-10 from QA
    clientApproval?: boolean;
    usageCount: number;
  };
  outputs: {
    imageUrl: string;
    localPath: string;
    dimensions: string;
    fileSize: number;
  }[];
  tags: string[];
  createdAt: string;
  lastUsed: string;
}

import { logToAlluraBrain } from '../utils/allura-brain';

/**
 * Log successful prompt to Allura Brain
 *
 * Logs the event to PostgreSQL (episodic). Promotion to the semantic graph
 * is not implemented — use allura-brain_memory_promote directly when needed.
 */
export async function logWinningPrompt(
  performance: PromptPerformance
): Promise<void> {
  // Log to PostgreSQL via Allura Brain
  await logToAlluraBrain({
    agentId: 'glaser',
    eventType: 'winning_prompt_logged',
    groupId: 'allura-team-durham',
    payload: {
      promptId: performance.promptId,
      tokenSet: performance.tokenSet,
      model: performance.model,
      brandSlug: performance.brandSlug,
      direction: performance.direction,
      qualityScore: performance.metrics.qualityScore,
      cost: performance.metrics.cost,
      usageCount: performance.metrics.usageCount,
      tags: performance.tags,
      createdAt: performance.createdAt,
      lastUsed: performance.lastUsed
    }
  });

  console.log(`[Allura Brain] Logged winning prompt: ${performance.promptId}`);
  console.log(
    `[Allura Brain] Semantic graph promotion not implemented — ` +
    `use allura-brain_memory_promote when this prompt should become canonical knowledge.`
  );
}

/**
 * Query winning prompts by criteria
 *
 * NOT IMPLEMENTED — the previous implementation built a Cypher query against a Neo4j
 * backend that was sunset in AD-50 (2026-07-17). To query the semantic graph, use
 * allura-brain_memory_search with the appropriate query string and group_id.
 */
export async function queryWinningPrompts(
  criteria: {
    brandSlug?: string;
    model?: string;
    minQualityScore?: number;
    tags?: string[];
    limit?: number;
  }
): Promise<PromptPerformance[]> {
  const { brandSlug, model, minQualityScore, tags, limit = 10 } = criteria;

  console.log(`[Allura Brain] queryWinningPrompts not implemented — use allura-brain_memory_search.`);
  console.log(`  Criteria: brandSlug=${brandSlug ?? 'any'}, model=${model ?? 'any'}, ` +
    `minQualityScore=${minQualityScore ?? 'any'}, tags=${tags?.join(',') ?? 'none'}, limit=${limit}`);

  // Stub return — the real implementation calls allura-brain_memory_search
  return [];
}

/**
 * Get top performing prompts for a use case
 */
export async function getTopPromptsForUseCase(
  useCase: string,
  brandSlug?: string,
  limit: number = 5
): Promise<PromptPerformance[]> {
  const tagMap: Record<string, string[]> = {
    'hero': ['hero-image', 'web', 'background'],
    'logo': ['logo', 'vector', 'brand-identity'],
    'social': ['social-media', 'instagram', 'post'],
    'infographic': ['infographic', 'data-viz', 'typography'],
    'pattern': ['pattern', 'texture', 'background']
  };

  const tags = tagMap[useCase] || [useCase];

  return queryWinningPrompts({
    brandSlug,
    tags,
    minQualityScore: 7,
    limit
  });
}

/**
 * Update prompt usage metrics
 *
 * Logs the update to PostgreSQL. The previous Cypher SET operation against Neo4j
 * is removed (AD-50). Semantic graph updates go through allura-brain_memory_update
 * with SUPERSEDES versioning.
 */
export async function updatePromptMetrics(
  promptId: string,
  updates: {
    qualityScore?: number;
    clientApproval?: boolean;
    usageIncrement?: number;
  }
): Promise<void> {
  const { qualityScore, clientApproval, usageIncrement = 1 } = updates;

  // PostgreSQL: Log update event
  const payload = {
    promptId,
    qualityScore,
    clientApproval,
    usageIncrement
  };

  await logToAlluraBrain({
    agentId: 'glaser',
    eventType: 'prompt_metrics_updated',
    groupId: 'allura-team-durham',
    payload
  });

  console.log(`[Allura Brain] Updated metrics for: ${promptId}`);
  console.log(
    `[Allura Brain] Semantic graph update not implemented — ` +
    `use allura-brain_memory_update with SUPERSEDES when promoting the change.`
  );
}

/**
 * Sync winning prompts to Notion
 */
export async function syncToNotion(
  prompts: PromptPerformance[],
  notionDatabaseId?: string
): Promise<void> {
  // Format for Notion
  const notionPages = prompts.map(p => ({
    parent: { database_id: notionDatabaseId || 'winning-prompts' },
    properties: {
      'Prompt ID': { title: [{ text: { content: p.promptId } }] },
      'Token Set': { rich_text: [{ text: { content: p.tokenSet } }] },
      'Model': { select: { name: p.model } },
      'Direction': { rich_text: [{ text: { content: p.direction } }] },
      'Brand': { relation: [{ id: p.brandSlug }] },
      'Quality Score': { number: p.metrics.qualityScore },
      'Cost': { number: p.metrics.cost },
      'Usage Count': { number: p.metrics.usageCount },
      'Tags': { multi_select: p.tags.map(t => ({ name: t })) },
      'Last Used': { date: { start: p.lastUsed } },
      'Status': { select: { name: p.metrics.clientApproval ? 'Approved' : 'Testing' } }
    }
  }));

  // Would call Notion MCP here
  console.log(`[Notion] Synced ${prompts.length} winning prompts`);
}

/**
 * Generate prompt performance report
 *
 * NOT IMPLEMENTED — the previous implementation built a Cypher aggregation query
 * against Neo4j. To aggregate from the semantic graph, use allura-brain_memory_search
 * and aggregate in application code, or query PostgreSQL directly via MCP_DOCKER_execute_sql.
 */
export async function generatePromptReport(
  brandSlug?: string,
  startDate?: string,
  endDate?: string
): Promise<{
  totalPrompts: number;
  averageQuality: number;
  totalCost: number;
  topModels: { model: string; count: number; avgQuality: number }[];
  topTags: { tag: string; count: number }[];
}> {
  console.log(`[Allura Brain] generatePromptReport not implemented — ` +
    `use allura-brain_memory_search or query PostgreSQL events directly.`);

  // Stub return — callers should not rely on this data
  return {
    totalPrompts: 0,
    averageQuality: 0,
    totalCost: 0,
    topModels: [],
    topTags: []
  };
}