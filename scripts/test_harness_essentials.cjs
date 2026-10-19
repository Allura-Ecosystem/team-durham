const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { ParallelDispatcher, resolveAgentTarget, CANONICAL_AGENT_NAMES } = require('../skills/party-mode/parallel-dispatcher');
const roster = require('../skills/party-mode/team-durham-roster.json');
const names = ['kotler','aaker','ogilvy','glaser','rand','munari','tufte'];
const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
const party = read('skills/party-mode/SKILL.md');
assert(!/mock chat|log to Brain automatically|subagent_type: .Explore|silent dispatch/.test(party));
for (const required of ['actual available delegation mechanism', 'observedAvailableNames',
  'does not\ninvoke agents', 'authenticated\nprincipal as `user_id`', 'metadata.agent_id',
  'read-back receipt', 'do not supply browser control or screenshot capture'])
  assert(party.includes(required), `party contract missing: ${required}`);
const kotlerAdapter = read('bmad-module/skills/dur-agent-kotler/SKILL.md');
assert(!kotlerAdapter.includes('operations agent'));
assert(kotlerAdapter.includes('do not require an extra hydration hop'));
const scoutLookup = read('commands/scout.md');
assert(!/Records the query as a reflection|\*\*Logging\*\*/.test(scoutLookup));
assert(scoutLookup.includes('This lookup performs no writes'));
assert(scoutLookup.includes('No downstream delegation'));
assert(fs.existsSync(path.join(__dirname, '..', 'commands', '../skills/memory-client/SKILL.md')));
// Folded capabilities must not create a retained role's self-delegation hop.
for (const [publicName, canonical] of Object.entries(CANONICAL_AGENT_NAMES)) {
  const role = read(`agents/${canonical}.md`);
  const table = role.split('**Can delegate to:**')[1]?.split('\n---')[0] || '';
  assert(!table.split('\n').some(line => line.startsWith(`| ${publicName} |`)),
    `self-delegation table found for ${publicName}`);
}
const tufte = read('agents/data-analyst.md');
const tufteTools = JSON.parse(tufte.match(/^tools: (.*)$/m)[1]);
assert(!tufteTools.some(tool => /Bash|browser|screenshot/i.test(tool)));
assert(tufte.includes('does not include browser control or screenshot capture'));
assert(tufte.includes('leave live verification unconfirmed'));
assert(read('skills/party-mode/parallel-dispatcher.js').includes('No browser/screenshot tool is granted'));

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
