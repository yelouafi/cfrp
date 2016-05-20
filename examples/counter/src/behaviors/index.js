
import { behavior } from '../../../../src'
import { inc$, dec$, incIfOdd$, addCounter$ } from '../events'

const isEq = id => eid => id === eid

const newCounter = (id) => ({
  id,
  count: behavior(0,
    [inc$.filter(isEq(id))       , c => c + 1],
    [dec$.filter(isEq(id))       , c => c - 1],
    [incIfOdd$.filter(isEq(id))  , c => c % 2 ? c + 1 : c]
  )
})

export default behavior([],
  [addCounter$    , prev => {
    prev.push(newCounter(prev.length))
    return true
  }]
)
