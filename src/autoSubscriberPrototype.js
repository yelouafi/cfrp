import { autoId } from './utils'
import { track } from './tracker'

const addSource = self => src => {
  //console.log('addSource', self.id, self.trackVersion)
  const sources = self.sources
  const srcId = src.id
  src[self.id] = self.trackVersion
  if(!sources[srcId]) {
    sources[srcId] = src
    src.addDep(self)
  }
}

const autoSubscriberPrototype = {

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
      if(src[thisId] !== this.trackVersion) {
        src.removeDep(this)
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
    for(var key in sources) {
      const src = sources[key]
      src.removeDep(this)
      src[this.id] = undefined
    }
  }
}

export default autoSubscriberPrototype
