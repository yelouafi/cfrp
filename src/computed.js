
import { is, check } from './utils'
import { SubscribablePrototype } from './subscribable'
import { AutoSubscriberPrototype } from './autoSubscriber'
import { track, registerDep } from './tracker'

export const CIRCULAR_DEPENDENCY_ERROR = 'Detected circular dependency in the computable chain'

export const ComputedPrototype = Object.assign({}, SubscribablePrototype, AutoSubscriberPrototype, {

  initComputed(fn, target, name) {
    this.initSubscribable(name)
    this.initAutoSubscriber(false)

    this.fn = !target ? fn : () => fn.call(this)
  },

  onDirty() {
    this.dirty = true
    this.notifyDirty()
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
    if(this.isComputing) {
      throw new Error(CIRCULAR_DEPENDENCY_ERROR)
    }
    registerDep(this)
    this.isComputing = true
    if(!this.depsCount) {
      this.lastResult = track(this.fn, null)
    } else if(this.dirty) {
      this.dirty = false
      this.lastResult = this.track(this.fn)
    }
    this.isComputing = false
    return this.lastResult
  }
})

export default function computed(fn, target, name) {
  check(fn, is.function, 'computed: fn argument is not a function')
  const comp = Object.create(ComputedPrototype)
  comp.initComputed(fn, target, name)
  return () => comp.get()
}
