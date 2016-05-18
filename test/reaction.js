import test from 'tape'
import { track, registerDep } from '../src/tracker'
import subscribable from '../src/subscribable'
import { ReactionPrototype } from '../src/reaction'

test('ReactionPrototype', assert => {

  const trackable = name => {
    const sub = subscribable(name)
    sub.invoke = () => registerDep(sub)
    return sub
  }

  const sub = subscribable('sub')

  const dep1 = trackable('dep1')
  const dep2 = trackable('dep2')

  sub.addDep(dep1)
  sub.addDep(dep2)

  const target = { prop: 0 }
  function action() {
    dep1.invoke()
    dep2.invoke()
    target.prop++
  }

  const reactionObj = Object.create(ReactionPrototype)
  reactionObj.initReaction(action, target, 'reactionObj')

  assert.ok(reactionObj.isAutoSubscriber(), 'should be an AutoSubscriber')
  assert.notOk(reactionObj.connected, 'should initialize connected to false')

  reactionObj.subscribe()
  assert.deepEqual(reactionObj.sources, {[dep1.id]: dep1, [dep2.id]: dep2}, '#connect should register source subscribables')
  assert.equal(target.prop, 1 ,'#connect should execute this.action')

  sub.notify()
  assert.deepEqual(reactionObj.sources, {[dep1.id]: dep1, [dep2.id]: dep2}, 'notify from a dependency should update sources')
  assert.equal(target.prop, 2 , 'notifications from source should trigger action only once (no glitches)')


  reactionObj.unsubscribe()
  sub.notify()
  assert.deepEqual(reactionObj.sources, {}, 'disconnected reaction should not get notifications')
  assert.equal(target.prop, 2 , 'disconnected reaction should not execute actions on notifications')

  assert.end()
})
