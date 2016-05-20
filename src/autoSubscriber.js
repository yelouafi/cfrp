import { autoId } from './utils'
import { track } from './tracker'

const addSource = self => src => {
  //console.log('addSource', self.id, self.trackVersion)
  const sources = self.sources
  const srcId = src.id
  src[self.id] = self.trackVersion
  if(!sources[srcId]) {
    sources[srcId] = src
    src.addDep(self, self.isReaction)
  }
}

export const AutoSubscriberPrototype = {
  isAutoSubscriber() { return true },

  initAutoSubscriber(isReaction) {
    this.id = this.id || autoId()
    this.isReaction = isReaction
    this.sources = {}
    this.trackVersion = 0
    this.addSource = addSource(this)
  },

  updateSources() {
    const sources = this.sources
    const thisId = this.id
    for(var key in sources) {
      const src = sources[key]
      if(src === undefined) continue
      if(src[thisId] !== this.trackVersion) {
        src.removeDep(this, this.isReaction)
        src[thisId] = undefined
        sources[src.id] = undefined
      }
    }
  },

  track(fn) {
    this.trackVersion++
    const result = track(fn, this.addSource)
    this.updateSources()
    return result
  },

  disconnect() {
    const sources = this.sources
    this.sources = {}
    for(var key in sources) {
      const src = sources[key]
      src.removeDep(this, this.isReaction)
      src[this.id] = undefined
    }
  }
}
