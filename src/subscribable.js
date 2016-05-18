import { eachObj, autoId } from './utils'

/*
  Subscriber  : Derivation | Reaction
  Derivation  : { id, dirty }
  Reaction    : { id, dirty, onReady }
*/

export const SubscribablePrototype = {
  isSubscribable() { return true },

  initSubscribable(name) {
    this.id = this.id || autoId()
    this.name = name
    this.derivations = {}
    this.reactions = {}
    this.depsCount = 0
  },

  addDep(d) {
    const deps = d.isReaction ? this.reactions : this.derivations
    if(!deps[d.id]) {
      deps[d.id] = d
      this.depsCount++
      this.onAddDep && this.onAddDep(d)
    }
  },

  removeDep(d) {
    const deps = d.isReaction ? this.reactions : this.derivations
    if(deps[d.id]) {
      deps[d.id] = undefined
      this.depsCount--
      this.onRemoveDep && this.onRemoveDep(d)
    }
  },

  notifyDirty() {
    eachObj(this.reactions, r => r.dirty = true)
    eachObj(this.derivations, d => {
       d.dirty = true
       d.notifyDirty()
    })
  },

  notifyReady() {
    eachObj(this.reactions, r => r.onReady())
    eachObj(this.derivations, d => d.notifyReady())
  },

  notify() {
    this.notifyDirty()
    this.notifyReady()
  },

  toString() {
    return `subscribable ${this.name}`
  }
}


export default function subscribable(name) {
  const sub = Object.create(SubscribablePrototype)
  sub.initSubscribable(name)
  return sub
}
