import subscribable from './subscribable'
import { registerDep } from './tracker'


export default function behavior(state, ...cases) {
  const sub = subscribable(name)
  let error, isError

  function updateState(reducer, e) {
    const newState = reducer(state, e)
    if(newState !== state) {
      state = newState
      sub.notify()
    }
  }

  function getValue() {
    if(isError) {
      throw error
    }
    if(!sub.completed) {
      registerDep(sub)
    }
    return state
  }

  getValue.pick = () => {
    if(isError) throw error
    return state
  }

  cases.forEach(([stream, reducer]) => {
    stream.subscribe({
      next: e => updateState(reducer, e),
      complete: sub.end,
      error(err) {
        error = err
        isError = true
        sub.notify()
        sub.end()
      }
    })
  })

  return getValue
}
