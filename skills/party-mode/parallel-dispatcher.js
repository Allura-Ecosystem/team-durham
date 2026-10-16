// Public routing identity is distinct from the runtime's registered target.
const CANONICAL_AGENT_NAMES = Object.freeze({
  kotler: 'brand-orchestrator', aaker: 'brand-strategist', ogilvy: 'copywriter',
  glaser: 'visual-director', rand: 'brand-kit-builder', munari: 'qa-reviewer',
  tufte: 'data-analyst'
});

function resolveAgentTarget(publicName, availableNames) {
  if (!Object.hasOwn(CANONICAL_AGENT_NAMES, publicName))
    throw new Error(`Unknown public Durham agent: ${publicName}`);
  const registered = new Set(availableNames);
  if (registered.has(publicName)) return publicName;
  const canonical = CANONICAL_AGENT_NAMES[publicName];
  if (registered.has(canonical)) return canonical;
  throw new Error(`Agent invocation unavailable for ${publicName}: neither public nor canonical target is registered.`);
}

// Task planning and dependency tracking. Creating a task record is not agent execution.
class ParallelDispatcher {
  constructor(orchestratorAgent = 'kotler', taskAdapter = null) {
    this.orchestrator = orchestratorAgent;
    this.adapter = taskAdapter;
    this.tasks = new Map();
    this.results = new Map();
    this.group_id = 'allura-team-durham';
    this.sequence = 0;
  }

  // Kotler supplies fresh scoped context; no mandatory discovery-agent hop.
  // This plan does not waive STP, approved-input, authority, or independence gates.
  decompose(request, clientSlug) {
    const text = request.toLowerCase();
    const plan = [];
    const run = ++this.sequence;
    const add = (agent, description, prompt, blockedBy = []) => plan.push({
      id: `${run}-${agent}`, agent, subagent_type: agent, description,
      prompt: `${prompt} Client: ${clientSlug}. Use only authenticated team scope.`,
      blockedBy, priority: plan.length + 1
    });
    if (/research|competitor|market|data|discovery|recon|screenshot|evidence/.test(text))
      add('tufte', 'Research and evidence', 'Inspect accessible scoped sources and evidence; define proof requirements and provenance. No browser/screenshot tool is granted. Request an authorized capable executor for live capture, otherwise report missing capability. Do not certify readiness.');
    if (/strategy|position|archetype/.test(text))
      add('aaker', 'Validate strategy', 'Check STP, personality and positioning.', plan.map(t => t.id));
    const foundation = plan.map(t => t.id);
    if (/visual|color|logo|design/.test(text))
      add('glaser', 'Create visual system', 'Require locked strategy and approved inputs before visual production.', foundation);
    if (/copy|messaging|voice|naming/.test(text))
      add('ogilvy', 'Write messaging', 'Use approved strategy and voice; respect naming dependencies.', foundation);
    if (/brand kit|kit|assembly|guidelines/.test(text))
      add('rand', 'Assemble brand kit', 'Assemble approved source artifacts and UX evidence.', plan.map(t => t.id));
    if (/audit|qa|review|validate|readiness/.test(text))
      add('munari', 'Independent QA', 'Read-only review of completed producer artifacts, evidence, and trust boundaries. Route fixes to producers.', plan.map(t => t.id));
    if (!plan.length)
      add('kotler', 'Scope request', 'Determine the accountable retained owner and required authority; report missing capability explicitly.');
    return plan;
  }

  async dispatch(tasks) {
    if (!this.adapter || typeof this.adapter.TaskCreate !== 'function')
      throw new Error('Task adapter unavailable: plan only; no task or agent was invoked.');
    for (const task of tasks) {
      if (!this.tasks.has(task.id)) this.tasks.set(task.id, { ...task, status: 'queued' });
    }
    const createdTasks = [];
    for (const task of this.tasks.values()) {
      if (task.status !== 'queued') continue;
      if (!task.blockedBy.every(id => this.tasks.get(id)?.status === 'completed')) continue;
      // Records work for an external authorized executor; does not invoke a runtime.
      const created = await this.adapter.TaskCreate({ subject: task.description,
        description: task.prompt, activeForm: `Awaiting executor: ${task.description}`,
        agent: task.agent, subagent_type: task.subagent_type });
      task.taskId = created.id;
      task.status = 'in_progress';
      createdTasks.push(created);
    }
    return createdTasks;
  }

  async collect(timeout = 300000) {
    if (!this.adapter || typeof this.adapter.TaskGet !== 'function')
      throw new Error('Task adapter unavailable: completion is unconfirmed.');
    const start = Date.now();
    const results = [];
    while (Date.now() - start < timeout) {
      const active = [...this.tasks.values()].filter(t => t.status === 'in_progress');
      if (!active.length) break;
      for (const task of active) {
        const status = await this.adapter.TaskGet({ taskId: task.taskId });
        if (status.status === 'completed') {
          task.status = 'completed'; this.results.set(task.agent, status.result);
          results.push({ agent: task.agent, result: status.result });
        } else if (status.status === 'failed') {
          task.status = 'failed'; task.error = status.error;
        }
      }
      for (const task of this.tasks.values()) {
        if (task.status === 'queued' && task.blockedBy.some(id =>
          ['failed', 'blocked'].includes(this.tasks.get(id)?.status))) task.status = 'blocked';
      }
      await this.dispatch([]);
      if ([...this.tasks.values()].some(t => t.status === 'in_progress'))
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return results;
  }

  synthesize() {
    const synthesis = { completed: [], failed: [], pending: [], deliverables: [], summary: '' };
    for (const task of this.tasks.values()) {
      if (task.status === 'completed') {
        synthesis.completed.push(task.agent);
        synthesis.deliverables.push({ agent: task.agent, output: this.results.get(task.agent) });
      } else if (['failed', 'blocked'].includes(task.status)) synthesis.failed.push(task.agent);
      else synthesis.pending.push(task.agent);
    }
    synthesis.summary = `Task receipts: ${synthesis.completed.length} completed, ${synthesis.failed.length} failed/blocked, ${synthesis.pending.length} pending. Task records alone do not prove agent invocation or readiness.`;
    return synthesis;
  }
}
module.exports = { ParallelDispatcher, resolveAgentTarget, CANONICAL_AGENT_NAMES };
