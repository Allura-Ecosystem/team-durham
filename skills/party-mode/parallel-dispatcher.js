// Party Mode — Parallel Task Dispatcher
// Dispatches sub-agents in parallel with dependency tracking

const { TaskCreate, TaskGet, TaskList, TaskUpdate } = require('./task-utils');

class ParallelDispatcher {
  constructor(orchestratorAgent = 'kotler') {
    this.orchestrator = orchestratorAgent;
    this.tasks = new Map();
    this.results = new Map();
    this.group_id = 'allura-team-durham';
  }

  // Decompose a request into parallel subtasks
  decompose(request, clientSlug) {
    const tasks = [];

    // Scout always runs first (discovery)
    tasks.push({
      id: `scout-${Date.now()}`,
      agent: 'scout',
      description: `Discovery for ${clientSlug}`,
      prompt: `Search codebase for client "${clientSlug}". Find: deliverables directory, existing files, current phase, blockers. Report file paths and status.`,
      subagent_type: 'Explore',
      blockedBy: [],
      priority: 1
    });

    // Analyze request to determine which agents needed
    const request_lower = request.toLowerCase();

    // Strategy validation needed?
    if (request_lower.includes('strategy') ||
        request_lower.includes('position') ||
        request_lower.includes('archetype')) {
      tasks.push({
        id: `aaker-${Date.now()}`,
        agent: 'aaker',
        description: 'Validate strategy alignment',
        prompt: `Validate brand strategy for ${clientSlug}. Check archetype, positioning, personality alignment.`,
        subagent_type: 'brand-strategist',
        blockedBy: [`scout-${Date.now()}`],
        priority: 2
      });
    }

    // Visual work needed?
    if (request_lower.includes('visual') ||
        request_lower.includes('color') ||
        request_lower.includes('logo') ||
        request_lower.includes('design')) {
      tasks.push({
        id: `glaser-${Date.now()}`,
        agent: 'glaser',
        description: 'Create visual system',
        prompt: `Create visual direction for ${clientSlug}. Use asset-first-design skill if logos needed. Generate color system, typography.`,
        subagent_type: 'visual-director',
        blockedBy: [`scout-${Date.now()}`],
        priority: 2
      });
    }

    // Copy work needed?
    if (request_lower.includes('copy') ||
        request_lower.includes('messaging') ||
        request_lower.includes('voice') ||
        request_lower.includes('naming')) {
      tasks.push({
        id: `ogilvy-${Date.now()}`,
        agent: 'ogilvy',
        description: 'Write copy guidelines',
        prompt: `Create messaging framework for ${clientSlug}. Voice/tone, sample copy, naming if needed.`,
        subagent_type: 'copywriter',
        blockedBy: [`scout-${Date.now()}`],
        priority: 2
      });
    }

    // Brand kit assembly needed?
    if (request_lower.includes('brand kit') ||
        request_lower.includes('kit') ||
        request_lower.includes('assembly') ||
        request_lower.includes('guidelines')) {
      // Get all non-scout task IDs for dependencies
      const nonScoutTasks = tasks.filter(t => t.agent !== 'scout').map(t => t.id);

      tasks.push({
        id: `rand-${Date.now()}`,
        agent: 'rand',
        description: 'Assemble brand kit',
        prompt: `Compile 10-section brand kit for ${clientSlug}. Coordinate with other agents for outputs.`,
        subagent_type: 'brand-kit-builder',
        blockedBy: nonScoutTasks.length > 0 ? nonScoutTasks : [`scout-${Date.now()}`],
        priority: 3
      });
    }

    // QA needed?
    if (request_lower.includes('audit') ||
        request_lower.includes('qa') ||
        request_lower.includes('review') ||
        request_lower.includes('validate')) {
      const allOtherTasks = tasks.filter(t => !t.id.startsWith('munari')).map(t => t.id);

      tasks.push({
        id: `munari-${Date.now()}`,
        agent: 'munari',
        description: 'QA validation',
        prompt: `Review all deliverables for ${clientSlug} against QA checklist. Report score and issues.`,
        subagent_type: 'qa-reviewer',
        blockedBy: allOtherTasks.length > 0 ? allOtherTasks : [],
        priority: 4
      });
    }

    // Data/research needed?
    if (request_lower.includes('research') ||
        request_lower.includes('competitor') ||
        request_lower.includes('market') ||
        request_lower.includes('data')) {
      tasks.push({
        id: `tufte-${Date.now()}`,
        agent: 'tufte',
        description: 'Competitive research',
        prompt: `Research competitive landscape for ${clientSlug}. Find market data, competitor positioning, insights.`,
        subagent_type: 'data-analyst',
        blockedBy: [`scout-${Date.now()}`],
        priority: 2
      });
    }

    return tasks;
  }

  // Dispatch all tasks that have no unmet dependencies
  async dispatch(tasks) {
    const readyTasks = tasks.filter(t => {
      // Task is ready if all its blockedBy dependencies are completed
      if (!t.blockedBy || t.blockedBy.length === 0) return true;
      return t.blockedBy.every(depId => {
        const depTask = this.tasks.get(depId);
        return depTask && depTask.status === 'completed';
      });
    });

    const createdTasks = [];

    for (const task of readyTasks) {
      const created = await TaskCreate({
        subject: task.description,
        description: task.prompt,
        activeForm: `Executing: ${task.description}`
      });

      this.tasks.set(task.id, { ...task, taskId: created.id, status: 'in_progress' });
      createdTasks.push(created);
    }

    return createdTasks;
  }

  // Collect results from completed tasks
  async collect(timeout = 300000) { // 5 minute default timeout
    const startTime = Date.now();
    const results = [];

    while (Date.now() - startTime < timeout) {
      const pendingTasks = Array.from(this.tasks.values())
        .filter(t => t.status !== 'completed' && t.status !== 'failed');

      if (pendingTasks.length === 0) break;

      for (const task of pendingTasks) {
        const status = await TaskGet({ taskId: task.taskId });

        if (status.status === 'completed') {
          this.tasks.get(task.id).status = 'completed';
          this.results.set(task.agent, status.result);
          results.push({ agent: task.agent, result: status.result });
        } else if (status.status === 'failed') {
          this.tasks.get(task.id).status = 'failed';
          this.tasks.get(task.id).error = status.error;
        }
      }

      // Check for newly unblocked tasks
      await this.dispatch(Array.from(this.tasks.values()));

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  // Synthesize results from all agents
  synthesize(results) {
    const synthesis = {
      completed: [],
      failed: [],
      deliverables: [],
      summary: ''
    };

    for (const [agent, result] of this.results) {
      if (result) {
        synthesis.completed.push(agent);
        synthesis.deliverables.push({ agent, output: result });
      } else {
        synthesis.failed.push(agent);
      }
    }

    synthesis.summary = `Parallel execution complete: ${synthesis.completed.length} agents succeeded, ${synthesis.failed.length} failed.`;

    return synthesis;
  }
}

module.exports = { ParallelDispatcher };
