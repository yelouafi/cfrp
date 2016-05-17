
import { autoSubscriberPrototype } from './autoSubscriberPrototype'

const reactionPrototype = Object.assign({}, autoSubscriberPrototype, {

  initReaction(action, target, name) {
    this.name = name
    this.initAutoSubscriber(true)
    this.action = !target ? action : () => action.call(this)
  },

  onReady() {
    if(this.connected) {
      this.track(this.action)
    }
  },

  connect() {
    this.connected = true
    this.track(this.action)
  },

  disconnect() {
    if(this.connected) {
      this.connected = false
      this.disconnect()
    }
  }

})

export function autorun(action, target, name) {
  const reaction = Object.create(reactionPrototype)
  reaction.initReaction(action, target, name)
  reaction.connect()

  return () => reaction.disconnect()
}
