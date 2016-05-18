import test from 'tape';
import { registerDep } from '../src/tracker'
import subscribable from '../src/subscribable'
import {AutoSubscriberPrototype} from '../src/autoSubscriber'

test('autoSubscriberPrototype', assert => {

  const trackable = name => {
    const sub = subscribable(name)
    sub.invoke = () => registerDep(sub)
    return sub
  }

  let activeDep = 'dep1'
  const dep1 = trackable('dep1')
  const dep2 = trackable('dep1')

  const autoSub = Object.create(AutoSubscriberPrototype)
  autoSub.initAutoSubscriber(false)

  const func = () => {
    if(activeDep === 'dep1')
      dep1.invoke()
    else if(activeDep === 'dep2')
      dep2.invoke()
  }

  autoSub.track(func)
  assert.deepEqual(autoSub.sources, { [dep1.id]: dep1 }, 'autoSubscriber.track(fn) must add new sources')

  activeDep = 'dep2'
  autoSub.track(func)
  assert.deepEqual(autoSub.sources, { [dep1.id]: undefined, [dep2.id]: dep2 }, 'autoSubscriber.track(fn) must update sources')
  //console.log(autoSub.sources)
  assert.end()
})
