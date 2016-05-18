
import computed from './computed'
import observable from './observable'
import subscribable from './subscribable'


function subscribe(sub, cb) {
  const react = {
    isReaction: true,
    onReady() {
      cb()
      sub.removeDep(react)
    }
  }
  sub.addDep(react)
}


export default function store() {
  let events = []

  function event(predicate) {
    const sub = subscribable(predicate.name)
    sub.predicate = predicate
    events.push(sub)
    return sub
  }

  function constB(seed) {
    return () => seed
  }

  function until(startB, ev, fn) {
    let currentB = observable(startB)
    subscribe(ev, () => currentB.value = fn(ev._event_))
    return computed(() => currentB.value())

  }

  return {
    event,
    constB,
    until,
    dispatch(event) {
      let matches = []
      events.forEach(sub => {
        if(sub.predicate(event)) {
          sub._event_ = event
          sub.notifyDirty()
          matches.push(sub)
        }
      })
      matches.forEach(sub => {
        sub.notifyReady()
        sub._event_ = undefined
      })
    }
  }

}
