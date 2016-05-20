import { is, check } from './utils'
import { AutoSubscriberPrototype } from './autoSubscriber'

export const ReactionPrototype = Object.assign({}, AutoSubscriberPrototype, {

  initReaction(action, target, name) {
    this.name = name
    this.initAutoSubscriber(true)
    this.action = !target ? action : () => action.call(this)
  },

  onDirty() {
    this.dirty = true
  },

  onReady() {
    if(this.connected && this.dirty) {
      this.dirty = false // prevents glitches
      this.track(this.action)
    }
  },

  subscribe() {
    this.connected = true
    this.track(this.action)
  },

  unsubscribe() {
    if(this.connected) {
      this.connected = false
      this.disconnect()
    }
  }

})

export default function reaction(action, target, name) {
  check(action, is.function, 'reaction: fn argument is not a function')
  const reaction = Object.create(ReactionPrototype)
  reaction.initReaction(action, target, name)
  reaction.subscribe()

  return () => reaction.unsubscribe()
}
