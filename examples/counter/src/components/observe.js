
/*eslint-disable no-unused-vars */

import React, { Component, PropTypes } from 'react'
import { ComputedPrototype } from '../../../../src'

export default function connect(Comp) {

  if(typeof Comp === 'function')
    Comp = wrapFuncComp(Comp)

  Comp.prototype.shouldComponentUpdate = function (){
    return false
  }

  Comp.prototype.componentWillMount = function() {
    const self = this
    const baseRender = this.render.bind(this)
    this.render = () => {
      this.computed = Object.create(ComputedPrototype)
      this.computed.initComputed(baseRender)
      this.render = () => this.computed.get()
      this.computed.addDep({
        id: 10000000,
        onReady() {
          React.Component.prototype.forceUpdate.call(self)
        }
      }, true)
      return this.render()
    }
  }

  Comp.prototype.componentWillUnmount = function() {
    this.computed.disconnect()
    this.computed.end()
  }

  return Comp

}

function wrapFuncComp(renderFn) {
  return class extends Component {
    render() {
      return renderFn(this.props)
    }
  }
}
