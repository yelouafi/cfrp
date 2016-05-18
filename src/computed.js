
import { SubscribablePrototype } from './subscribable'
import { AutoSubscriberPrototype } from './autoSubscriber'
import { track, registerDep } from './tracker'

export const ComputedPrototype = Object.assign({}, SubscribablePrototype, AutoSubscriberPrototype, {

  initComputed(fn, target, name) {
    this.initSubscribable(name)
    this.initAutoSubscriber(false)

    this.fn = !target ? fn : () => fn.call(this)
  },

  onAddDep() {
    if(this.depsCount === 1) {
      this.lastResult = this.track(this.fn)
    }
  },

  onRemoveDep() {
    if(!this.depsCount) {
      this.disconnect()
    }
  },

  get() {
    registerDep(this)
    if(!this.depsCount) {
      this.lastResult = track(this.fn, null)
    } else if(this.dirty) {
      this.dirty = false
      this.lastResult = this.track(this.fn)
    }
    return this.lastResult
  }
})

export default function computed(fn, target, name) {
  const comp = Object.create(ComputedPrototype)
  comp.initComputed(fn, target, name)
  return () => comp.get()
}
