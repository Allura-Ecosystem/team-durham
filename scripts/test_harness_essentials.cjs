const assert = require('node:assert/strict');
const { ParallelDispatcher, resolveAgentTarget, CANONICAL_AGENT_NAMES } = require('../skills/party-mode/parallel-dispatcher');
const roster = require('../skills/party-mode/team-durham-roster.json');
const names = ['kotler','aaker','ogilvy','glaser','rand','munari','tufte'];
for (const name of names) {
  assert.equal(resolveAgentTarget(name, names), name);
  assert.equal(resolveAgentTarget(name, Object.values(CANONICAL_AGENT_NAMES)), CANONICAL_AGENT_NAMES[name]);
  assert.equal(resolveAgentTarget(name, [name, CANONICAL_AGENT_NAMES[name]]), name);
  assert.throws(() => resolveAgentTarget(name, []), /invocation unavailable/);
}
assert.throws(() => resolveAgentTarget('openagent', names), /Unknown public/);
assert.deepEqual(roster.agents.map(a => a.code).sort(), [...names].sort());
for (const owners of Object.values(roster.expertise_to_agent_map))
  assert(owners.every(name => names.includes(name)));
(async () => {
  const planner = new ParallelDispatcher();
  assert.deepEqual(planner.decompose('copy correction','test').map(t => t.agent), ['ogilvy']);
  const plan = planner.decompose('research strategy visual copy brand kit review','test');
  for (const t of plan) {
    assert(names.includes(t.subagent_type));
    assert(t.blockedBy.every(id => plan.some(candidate => candidate.id === id)));
  }
  const qa = plan.find(t => t.agent === 'munari');
  assert.deepEqual(qa.blockedBy, plan.filter(t => t !== qa).map(t => t.id));
  await assert.rejects(() => planner.dispatch(plan), /no task or agent was invoked/);
  let created = 0;
  const tracker = new ParallelDispatcher('kotler', {
    TaskCreate: async () => ({ id: String(++created) }),
    TaskGet: async () => ({ status: 'completed', result: 'external executor receipt' })
  });
  await tracker.dispatch(plan);
  assert.equal(created, 1); // research foundation only
  await tracker.dispatch(plan);
  assert.equal(created, 1); // no duplicate running task
  assert.equal(tracker.tasks.size, plan.length); // queued dependencies retained
  // Complete deterministic receipt stages without waiting/polling.
  while ([...tracker.tasks.values()].some(t => t.status !== 'completed')) {
    for (const t of tracker.tasks.values()) if (t.status === 'in_progress') t.status = 'completed';
    await tracker.dispatch([]);
  }
  assert.equal(created, plan.length);
  await tracker.dispatch(plan);
  assert.equal(created, plan.length);
  assert(tracker.synthesize().summary.includes('do not prove agent invocation'));
  console.log('Harness contracts passed: seven routes, stable dependency IDs, research-before-QA, optional recon, no duplicate records, explicit invocation limits.');
})().catch(error => { console.error(error); process.exitCode = 1; });
