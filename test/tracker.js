import test from 'tape';
import { track, registerDep } from '../src/tracker'

test('tracker', assert => {

  const trackerResults = []

  track(() => {
    registerDep(1)
    track(() => {
      registerDep(2)
      track(() => {
        registerDep(3)
      }, s => trackerResults.push(s))
    }, /* null spy */)
  }, s => trackerResults.push(s))

  assert.deepEqual(trackerResults, [1,3], 'track must invoke currentSpy with registerDep`s argument')

  assert.end()
})
