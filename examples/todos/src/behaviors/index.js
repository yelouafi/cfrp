
import { behavior, event, observable, computed } from '../../../../src'

export const toggle$ = event('toggle')
export const toggleAll$ = event('toggleAll')
export const addTodo$ = event('addTodo')
export const removeTodo$ = event('removeTodo')

export const editingTodo = observable('')

const eqF = id => eid => id === eid

function newTodo(id, title) {
  return {
    id, title,
    done: behavior(false,
      [ toggle$.filter(eqF(id))   , done => !done ],
      [ toggleAll$                , (_, done) => done  ]
    )
  }
}

export const todoList = behavior([],
  [
    addTodo$,
    (todos, id) => todos.concat(newTodo(id, editingTodo.value))
  ],
  [
    removeTodo$,
    (todos, id) => todos.filter(t => t.id !== id)
  ]
)

export const allDone = computed(() => todoList().length && todoList().every(t => t.done()))
