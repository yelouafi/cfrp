import { eachObj, autoId  } from './utils'

/*
  Dep  : Derivation | Reaction
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

  addDep(d, isReaction) {
    if(this.completed) return
    const deps = isReaction ? this.reactions : this.derivations
    if(!deps[d.id]) {
      deps[d.id] = d
      this.depsCount++
      this.onAddDep && this.onAddDep(d)
    }
  },

  removeDep(d, isReaction) {
    if(this.completed) return
    const deps = isReaction ? this.reactions : this.derivations
    if(deps[d.id]) {
      deps[d.id] = undefined
      this.depsCount--
      this.onRemoveDep && this.onRemoveDep(d)
    }
  },

  end() {
    this.completed = true
    this.derivations = null
    this.reactions = null
    this.depsCount = 0
    this.onRemoveDep && this.onRemoveDep()
  },

  notifyDirty(e) {
    if(this.completed) return
    eachObj(this.reactions, r => r.onDirty && r.onDirty(e))
    eachObj(this.derivations, d => d.onDirty && d.onDirty(e))
  },

  notifyReady(e) {
    if(this.completed) return
    eachObj(this.reactions, r => r.onReady(e))
    eachObj(this.derivations, d => d.notifyReady(e))
  },

  notify(e) {
    if(this.completed) return
    this.notifyDirty(e)
    this.notifyReady(e)
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
