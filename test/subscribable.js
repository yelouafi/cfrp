
import test from 'tape';
import subscribable from '../src/subscribable'

test('subscribable', assert => {

  const addedDeps = []
  const sub = subscribable('sub')
  sub.onAddDep = d => addedDeps.push(d)

  assert.equal(sub.id, 1, 'must have an auto id')
  assert.equal(sub.name, 'sub', 'must have name')
  assert.equal(sub.depsCount, 0, 'must have zero dependents at start')

  const dep = subscribable('dep')
  const reaction = subscribable('reaction')
  reaction.isReaction = true

  sub.addDep(dep)
  sub.addDep(reaction)

  assert.equal(sub.depsCount, 2, 'must track dependents count')
  assert.deepEqual(addedDeps, [dep, reaction], '`addDep` must invoke `onAddDep` callback')

  const dep_dep = subscribable('dep_dep')
  const dep_reaction = subscribable('dep_reaction')
  dep_reaction.isReaction = true
  dep.addDep(dep_dep)
  dep.addDep(dep_reaction)

  sub.notifyDirty()
  assert.equal(dep.dirty, true, 'must notify dirty to direct dependents')
  assert.equal(reaction.dirty, true, 'must notify dirty to reactions')
  assert.equal(dep_dep.dirty, true, 'must notify dirty to deep dependents')
  assert.equal(dep_reaction.dirty, true, 'must notify dirty to deep reactions')

  const readyResults = []
  reaction.onReady = () => readyResults.push(reaction.id)
  dep_reaction.onReady = () => readyResults.push(dep_reaction.id)
  sub.notifyReady()
  assert.deepEqual(readyResults, [reaction.id, dep_reaction.id], 'must propagate down ready notifications to reactions')

  assert.end()
});
