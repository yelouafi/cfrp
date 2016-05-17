
const spyStack = []
let currentSpy

export function track(fn, spy) {
  spyStack.push(currentSpy)
  currentSpy = spy
  const res = fn()
  currentSpy = spyStack.pop()
  return res
}

export function registerDep(dep) {
  if(currentSpy) {
    currentSpy(dep)
  }
}
