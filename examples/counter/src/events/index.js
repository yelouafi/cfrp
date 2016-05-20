
import { event } from '../../../../src'

export const inc$ = event()
export const dec$ = event()
export const incIfOdd$ = event()
export const incAsync$ = event()

incAsync$.subscribe({
  next: (eid) => setTimeout(() => inc$.next(eid), 1000)
})


export const addCounter$ = event()
