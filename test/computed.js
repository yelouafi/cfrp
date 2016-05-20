import test from 'tape'
import { track, registerDep } from '../src/tracker'
import subscribable from '../src/subscribable'
import computed, { ComputedPrototype, CIRCULAR_DEPENDENCY_ERROR } from '../src/computed'

test('ComputedPrototype', assert => {

  const trackable = name => {
    const sub = subscribable(name)
    sub.invoke = () => registerDep(sub)
    return sub
  }

  const dep1 = trackable('dep1')
  const dep2 = trackable('dep2')

  const target = { prop: {} }
  let invokeDep2 = false
  function fnComp() {
    if(!invokeDep2)
      dep1.invoke()
    else
      dep2.invoke()
    return target.prop
  }

  const compObj = Object.create(ComputedPrototype)
  compObj.initComputed(fnComp, target, 'compObj')

  assert.ok(compObj.isSubscribable(), 'should be Subscribable')
  assert.ok(compObj.isAutoSubscriber(), 'should be an AutoSubscriber')
  assert.notOk(compObj.connected, 'should initialize connected to false')

  compObj.depsCount++
  compObj.onAddDep()
  assert.deepEqual(compObj.sources, {[dep1.id]: dep1}, '#onAddDep should register source subscribables')
  assert.equal(compObj.lastResult, target.prop, '#onAddDep should update lastResult with the return value of this.fn')

  dep1.notify()
  assert.ok(compObj.dirty, 'notifying a source should set dirty to true')

  compObj.depsCount = 0
  compObj.onRemoveDep()
  assert.deepEqual(compObj.sources, {}, '#onRemoveDep should disconnect if depsCount is 0')

  compObj.dirty = false
  dep1.notify()
  assert.notOk(compObj.dirty, 'disconnected computed should not get dirty notifications')

  let spyResults = []
  track(() => compObj.get(), dep => spyResults.push(dep))

  assert.deepEqual(spyResults, [compObj], '#get should register itself as a dependency (1)')
  assert.deepEqual(compObj.sources, {}, '#get should not auto detect its own dependencies when disconnected')

  invokeDep2 = true
  compObj.depsCount++
  compObj.dirty = true
  track(() => compObj.get(), dep => spyResults.push(dep))
  assert.deepEqual(spyResults, [compObj, compObj], '#get should register itself as a dependency (2)')
  assert.deepEqual(compObj.sources,  {[dep2.id]: dep2}, '#get should update its own dependencies when connected')

  assert.end()
})


test('ComputedPrototype - circular references', assert => {

  const A = computed(() => B())
  const B = computed(() => C())
  const C = computed(() => A())

  let errMessage
  try {
    track(A)
  } catch(err) {
    errMessage = err.message
  }
  assert.equal(errMessage, CIRCULAR_DEPENDENCY_ERROR, 'should detect circular dependencies')
  assert.end()

})
