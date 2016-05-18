
import { AutoSubscriberPrototype } from './autoSubscriber'

export const ReactionPrototype = Object.assign({}, AutoSubscriberPrototype, {

  initReaction(action, target, name) {
    this.name = name
    this.initAutoSubscriber(true)
    this.action = !target ? action : () => action.call(this)
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

export function autorun(action, target, name) {
  const reaction = Object.create(ReactionPrototype)
  reaction.initReaction(action, target, name)
  reaction.subscribe()

  return () => reaction.unsubscribe()
}
