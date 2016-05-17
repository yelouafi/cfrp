
import { subscribablePrototype } from './subscribable'
import { autoSubscriberPrototype } from './autoSubscriberPrototype'
import { track, registerDep } from './tracker'

const computedPrototype = Object.assign({}, subscribablePrototype, autoSubscriberPrototype, {

  initComputed(fn, target, name) {
    this.initSubscribable(name)
    this.initAutoSubscriber(false)
    this.fn = !target ? fn : () => fn.call(this)
    this.connected = false
  },

  onAddDep() {
    if(!this.connected) {
      this.connected = true
      this.lastResult = this.track(this.fn)
    }
  },

  onRemoveDep() {
    if(!this.depsCount) {
      this.connected = false
      this.disconnect()
    }
  },

  get() {
    registerDep(this)
    if(!this.connected) {
      this.lastResult = track(this.fn, /* null spy */)
    } else if(this.dirty) {
      this.dirty = false
      this.lastResult = this.track(this.fn)
    }
    return this.lastResult
  }
})

export function computed(fn, target, name) {
  const comp = Object.create(computedPrototype)
  comp.initComputed(fn, target, name)
  return () => comp.get()
}
