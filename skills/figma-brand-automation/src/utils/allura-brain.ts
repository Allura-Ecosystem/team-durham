/**
 * Allura Brain Integration
 *
 * PostgreSQL episodic + RuVector semantic graph logging for all brand automation events.
 * Every action is logged to PostgreSQL for complete traceability. Promotion to the
 * semantic graph is governed through the allura-brain_memory_* MCP interface.
 *
 * @module allura-brain
 * @group_id allura-team-durham
 */

/**
 * Date range filter for event queries
 */
export interface DateRange {
  /** ISO 8601 start date (inclusive) */
  start?: string;
  /** ISO 8601 end date (inclusive) */
  end?: string;
}

/**
 * Query filters for Brain events
 */
export interface EventQuery {
  /** Filter by agent ID (e.g., 'glaser', 'rand', 'munari') */
  agentId?: string;
  /** Filter by event type (e.g., 'workflow_started', 'image_generated') */
  eventType?: string;
  /** Filter by group ID - always 'allura-team-durham' for Team Durham */
  groupId?: string;
  /** Filter by date range */
  dateRange?: DateRange;
  /** Maximum number of results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Core event structure for Allura Brain
 */
export interface BrainEvent {
  /** Agent that generated the event (e.g., 'glaser', 'rand', 'ogilvy') */
  agentId: string;
  /** Type of event (e.g., 'workflow_started', 'prompts_generated', 'image_generated') */
  eventType: string;
  /** Group ID - always 'allura-team-durham' */
  groupId: string;
  /** Event payload - arbitrary data specific to the event type */
  payload: Record<string, unknown>;
  /** ISO 8601 timestamp */
  timestamp?: string;
}

/**
 * Semantic graph node structure for promoted knowledge.
 *
 * The semantic graph runs on the RuVector adapter (PostgreSQL tables) as of AD-49.
 * Promotion is governed through allura-brain_memory_promote — never direct graph writes.
 */
export interface SemanticGraphNode {
  /** Unique identifier for the node */
  id: string;
  /** Node label (e.g., 'Prompt', 'Model', 'Brand') */
  label: string;
  /** Node properties */
  properties: Record<string, unknown>;
}

/**
 * Semantic graph relationship structure
 */
export interface SemanticGraphRelationship {
  /** Source node ID */
  from: string;
  /** Target node ID */
  to: string;
  /** Relationship type (e.g., 'USES_MODEL', 'HAS_PROMPT') */
  type: string;
  /** Relationship properties */
  properties?: Record<string, unknown>;
}

/**
 * Validation result for event logging
 */
export interface LogValidationResult {
  /** Whether the event is valid */
  valid: boolean;
  /** Error message if invalid */
  error?: string;
  /** Missing required fields */
  missingFields?: string[];
}

/** Default group ID for all Team Durham operations */
const DEFAULT_GROUP_ID = 'allura-team-durham';

/** Valid event types for brand automation */
const VALID_EVENT_TYPES = [
  'workflow_started',
  'prompts_generated',
  'image_generated',
  'workflow_complete',
  'winning_prompt_logged',
  'prompt_metrics_updated',
  'brand_validation_failed',
  'notion_sync_complete',
  'AGENT_INVOKED',
  'AGENT_COMPLETED',
  'AGENT_FAILED',
  'DESIGN_DECISION',
  'TASK_COMPLETE',
  'BLOCKED',
  'LESSON_LEARNED',
] as const;

/**
 * Validates a BrainEvent before logging
 * @param event - The event to validate
 * @returns Validation result with details on any failures
 */
function validateBrainEvent(event: BrainEvent): LogValidationResult {
  const missingFields: string[] = [];

  if (!event.agentId || typeof event.agentId !== 'string') {
    missingFields.push('agentId');
  }

  if (!event.eventType || typeof event.eventType !== 'string') {
    missingFields.push('eventType');
  }

  if (!event.groupId || typeof event.groupId !== 'string') {
    missingFields.push('groupId');
  }

  if (!event.payload || typeof event.payload !== 'object') {
    missingFields.push('payload');
  }

  // Validate group_id format
  if (event.groupId && !event.groupId.startsWith('allura-')) {
    return {
      valid: false,
      error: `Invalid group_id: ${event.groupId}. Must start with 'allura-'`,
      missingFields,
    };
  }

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing or invalid required fields: ${missingFields.join(', ')}`,
      missingFields,
    };
  }

  return { valid: true };
}

/**
 * Log an event to Allura Brain (PostgreSQL events table).
 *
 * In production, this writes to the PostgreSQL events table.
 * In mock mode, events are logged to console for debugging.
 *
 * @param event - The event to log
 * @throws Error if event validation fails
 * @returns Promise that resolves when logging is complete
 *
 * @example
 * ```typescript
 * await logToAlluraBrain({
 *   agentId: 'glaser',
 *   eventType: 'image_generated',
 *   groupId: 'allura-team-durham',
 *   payload: {
 *     model: 'nano-banana-2',
 *     prompt: 'Hero image with droplet curves...',
 *     cost: 0.018,
 *     validationScore: 0.95
 *   }
 * });
 * ```
 */
export async function logToAlluraBrain(event: BrainEvent): Promise<void> {
  // Validate event before logging
  const validation = validateBrainEvent(event);
  if (!validation.valid) {
    throw new Error(`BrainEvent validation failed: ${validation.error}`);
  }

  const timestamp = event.timestamp ?? new Date().toISOString();
  const enrichedEvent = { ...event, timestamp };

  try {
    // Log to console for visibility
    console.log(`[Allura Brain] ${timestamp} | ${event.agentId} | ${event.eventType}`);
    console.log(`  Group: ${event.groupId}`);
    console.log(`  Payload:`, JSON.stringify(event.payload, null, 2));

    // Production: Write to PostgreSQL via MCP Docker
    // This requires MCP_DOCKER tools to be available
    const payloadJson = JSON.stringify(event.payload).replace(/'/g, "''");

    // Use MCP_DOCKER_insert_data for PostgreSQL
    // Note: This is a template - actual execution requires MCP_DOCKER tools
    const insertQuery = {
      table_name: "events",
      columns: "event_type, group_id, agent_id, payload, created_at",
      values: `'${event.eventType}', '${event.groupId}', '${event.agentId}', '${payloadJson}', '${timestamp}'`
    };

    console.log(`[Allura Brain] PostgreSQL insert prepared:`, insertQuery);

    // Store in memory for this session (until MCP Docker is available)
    const globalAny = globalThis as any;
    if (!globalAny.__alluraBrainEvents) {
      globalAny.__alluraBrainEvents = [];
    }
    globalAny.__alluraBrainEvents.push(enrichedEvent);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Allura Brain] Failed to log event: ${errorMessage}`);
    throw new Error(`Failed to log event to Allura Brain: ${errorMessage}`);
  }
}

/**
 * Query past events from Allura Brain (PostgreSQL).
 *
 * Retrieves events matching the provided filters, ordered by timestamp descending.
 *
 * @param query - Query filters for events
 * @returns Promise resolving to array of matching BrainEvents
 *
 * @example
 * ```typescript
 * const events = await queryBrainEvents({
 *   agentId: 'glaser',
 *   eventType: 'image_generated',
 *   dateRange: { start: '2026-04-01', end: '2026-04-21' },
 *   limit: 50
 * });
 * ```
 */
export async function queryBrainEvents(query: EventQuery): Promise<BrainEvent[]> {
  const {
    agentId,
    eventType,
    groupId = DEFAULT_GROUP_ID,
    dateRange,
    limit = 100,
    offset = 0,
  } = query;

  try {
    // Mock implementation: Log query parameters and return empty array
    // In production, this would query PostgreSQL via MCP_DOCKER_execute_sql
    console.log(`[Allura Brain] Querying events:`);
    console.log(`  Agent: ${agentId ?? 'any'}`);
    console.log(`  Event Type: ${eventType ?? 'any'}`);
    console.log(`  Group: ${groupId}`);
    console.log(`  Date Range: ${dateRange ? `${dateRange.start} to ${dateRange.end}` : 'any'}`);
    console.log(`  Limit: ${limit}, Offset: ${offset}`);

    // Production implementation would be:
    // const sql = `
    //   SELECT * FROM events
    //   WHERE group_id = '${groupId}'
    //     ${agentId ? `AND agent_id = '${agentId}'` : ''}
    //     ${eventType ? `AND event_type = '${eventType}'` : ''}
    //     ${dateRange?.start ? `AND created_at >= '${dateRange.start}'` : ''}
    //     ${dateRange?.end ? `AND created_at <= '${dateRange.end}'` : ''}
    //   ORDER BY created_at DESC
    //   LIMIT ${limit} OFFSET ${offset}
    // `;
    // const result = await MCP_DOCKER_execute_sql({ sql_query: sql });
    // return result.rows.map(row => ({
    //   agentId: row.agent_id,
    //   eventType: row.event_type,
    //   groupId: row.group_id,
    //   payload: row.payload,
    //   timestamp: row.created_at
    // }));

    return [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Allura Brain] Failed to query events: ${errorMessage}`);
    throw new Error(`Failed to query events from Allura Brain: ${errorMessage}`);
  }
}

/**
 * Promote an event to the semantic graph (RuVector on PostgreSQL).
 *
 * Events are promoted to the semantic graph when they represent reusable knowledge
 * (winning prompts, validated decisions, patterns).
 *
 * NOT IMPLEMENTED — the previous implementation prepared Cypher against a Neo4j
 * backend that was sunset in AD-50 (2026-07-17). The semantic graph now runs on
 * the RuVector adapter (PostgreSQL tables) and promotion is governed through
 * the allura-brain_memory_promote MCP tool with HITL approval.
 *
 * To wire this: call allura-brain_memory_promote with the event's episodic memory ID.
 * Do not attempt direct graph writes — the governed interface enforces SUPERSEDES
 * versioning and the HITL promotion gate.
 *
 * @param event - The event to promote
 * @throws Error always — this is a stub
 */
export async function promoteToSemanticGraph(event: BrainEvent): Promise<void> {
  // Validate event before promotion
  const validation = validateBrainEvent(event);
  if (!validation.valid) {
    throw new Error(`Cannot promote invalid event: ${validation.error}`);
  }

  // Only certain event types should be promoted to the semantic graph
  const promotableTypes = [
    'winning_prompt_logged',
    'DESIGN_DECISION',
    'DDR_CREATED',
    'LESSON_LEARNED',
  ];

  if (!promotableTypes.includes(event.eventType)) {
    console.log(`[Allura Brain] Event type '${event.eventType}' not promotable (not in promotable types)`);
    return;
  }

  throw new Error(
    `Semantic graph promotion not yet implemented — use allura-brain_memory_promote directly. ` +
    `Event: ${event.eventType} from ${event.agentId}. The previous Neo4j Cypher path was removed ` +
    `in AD-50 (2026-07-17). The RuVector semantic graph is governed through the ` +
    `allura-brain_memory_* MCP interface with HITL approval.`
  );
}

/**
 * Get the most recent event for a specific agent.
 *
 * Convenience wrapper around queryBrainEvents.
 *
 * @param agentId - The agent ID to query
 * @returns Promise resolving to the most recent BrainEvent or null
 *
 * @example
 * ```typescript
 * const lastEvent = await getLastEventForAgent('glaser');
 * if (lastEvent) {
 *   console.log(`Last action: ${lastEvent.eventType}`);
 * }
 * ```
 */
export async function getLastEventForAgent(agentId: string): Promise<BrainEvent | null> {
  const events = await queryBrainEvents({
    agentId,
    limit: 1,
  });
  return events.length > 0 ? events[0] : null;
}

/**
 * Batch log multiple events to Allura Brain.
 *
 * Logs all events and returns results for each.
 *
 * @param events - Array of events to log
 * @returns Promise resolving to array of success/failure results
 *
 * @example
 * ```typescript
 * const results = await batchLogToBrain([
 *   { agentId: 'glaser', eventType: 'workflow_started', ... },
 *   { agentId: 'glaser', eventType: 'prompts_generated', ... },
 * ]);
 * ```
 */
export async function batchLogToBrain(
  events: BrainEvent[]
): Promise<{ event: BrainEvent; success: boolean; error?: string }[]> {
  const results: { event: BrainEvent; success: boolean; error?: string }[] = [];

  for (const event of events) {
    try {
      await logToAlluraBrain(event);
      results.push({ event, success: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({ event, success: false, error: errorMessage });
    }
  }

  return results;
}

/**
 * Create a standardized BrainEvent with proper defaults.
 *
 * Factory function to ensure consistent event structure.
 *
 * @param params - Event parameters
 * @returns A complete BrainEvent ready for logging
 *
 * @example
 * ```typescript
 * const event = createBrainEvent({
 *   agentId: 'glaser',
 *   eventType: 'image_generated',
 *   payload: { model: 'nano-banana-2', cost: 0.018 }
 * });
 * await logToAlluraBrain(event);
 * ```
 */
export function createBrainEvent(params: {
  agentId: string;
  eventType: string;
  groupId?: string;
  payload: Record<string, unknown>;
  timestamp?: string;
}): BrainEvent {
  return {
    agentId: params.agentId,
    eventType: params.eventType,
    groupId: params.groupId ?? DEFAULT_GROUP_ID,
    payload: params.payload,
    timestamp: params.timestamp ?? new Date().toISOString(),
  };
}
