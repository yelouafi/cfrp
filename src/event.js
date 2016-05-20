import { autoId } from './utils'
import subscribable from './subscribable'

export default function event(name) {
  const sub = subscribable(name)

  sub.subscribe = function(observer) {
    sub.addDep({
      id: autoId(),
      onDirty: () => observer.dirty = true,
      onReady(e) {
        if(observer.dirty) {
          observer.dirty = false
          observer.next(e)
        }
      }
    }, true)
  }

  sub.next = function(e) {
    sub.notify(e)
  }

  sub.filter = pred => {
    const fsub = event()
    fsub.onDirty = e => pred(e) && fsub.notifyDirty(e),
    fsub.onReady = e => pred(e) && fsub.notifyReady(e)
    sub.addDep(fsub, true)
    return fsub
  }

  sub.map = fn => {
    const msub = event()
    msub.onDirty = e => msub.notifyDirty(fn(e)),
    msub.onReady = e => msub.notifyReady(fn(e))
    sub.addDep(msub, true)
    return msub
  }

  return sub
}
