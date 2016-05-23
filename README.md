CFRP
---------

Attempt to implement (a subset) of [Classic FRP](http://conal.net/papers/icfp97/) 

> Ok, actual implementation is not exactly CFRP but still w've got Behaviors and Events. And **it's still a rough POC**

Don't ask me about Side Effects and Hot reload/Time travel. I'm not on that stage yet.

So in the current actual implementation: 

> Observable (in the Ko and MobX sense) + Reducer (in the Redux sense) = Behavior

A Behavior is much like a Redux reducer in the sense it entirely depends on a Reducer for the update logic; Unlike Mobx/Ko Observables
you can not set the value of a Behavior directly but you have to declare the entire logic on the Creation

A Behavior is also much like a Mobx/Ko observable because you can react to its state changes. The advantage is that in scenarios like 
React Rendering you can get finer grained subscriptione (In Redux you can also subscribe to state change but you'll have to perform
shallow comparisons to determine which parts have changed [like implemented in react-redux], and in case of dynamic collections like arrays or maps, you need to normalize the state tree in order to avoid unnecessary reconciliations).


```js

const increment$ = event()
const decrement$ = event()

const counter = behavior(
  0, // seed value
  [ increment$  , (prev, ev) => prev + 1 ], // case 1
  [ decrement$  , (prev, ev) => prev - 1 ]  // case 2
)

// react to each change in the behaviors invoked in the reaction callback
// Like in Mobx/Ko, dependencies are automatically and dynamically tracked
reaction(() => console.log(counter())

increment$.next()
// => log 1
decrement$.next()
// => log 2
```

In case you're wondering events are just like Rx Subjects. We use them to hookup callbacks in UI (e.g. React's `onXXXX={increment$.next()}`). In fact you can replace this with Rx Subjects and it'll work the same way.

In Rx, Subjects are subject to caution; but I prefer this style of pushing events from React Components into
callbacks instead of pulling Event Streams based on some fragile CSS selector.

## (Deadly Boring) TodoList example

### Behaviors + Events
```js
import { behavior, event, observable, computed } from '../../../../src'

export const toggle$ = event('toggle')
export const toggleAll$ = event('toggleAll')
export const addTodo$ = event('addTodo')
export const removeTodo$ = event('removeTodo')

export const editingTodo = observable('') // this is a SHAME i know. Just too lazy to create beh+event

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
```

### Components
```js
import React, { Component } from 'react'
import { computed } from '../../../../src'
import observe from './observe' // Optimized React rendering

import {
  todoList, editingTodo, allDone,
  toggle$, toggleAll$, addTodo$, removeTodo$
} from '../behaviors'

let autoId = 0

const bindEv = (ev, id) => () => ev.next(id)

export default observe(() =>
  <div>
    <input type="text" value={editingTodo.value} onChange={e => editingTodo.value = e.target.value} />
    <button onClick={() => addTodo$.next(++autoId)}>Add Todo</button>
    <label>
      <input type="checkbox" checked={allDone()} onClick={e => toggleAll$.next(e.target.checked)}/>
      All done
    </label>
    <hr/>
    {todoList().map(todo => <TodoView todo={todo} key={todo.id} />)}
  </div>
)

const TodoView = observe(({todo}) =>
  <div>
  <input type="checkbox" checked={todo.done()} onClick={bindEv(toggle$, todo.id)} />
  {' '}
  {todo.title}
  {' '}
  <button onClick={bindEv(removeTodo$, todo.id)}>X</button>
  <hr/>
  </div>
)
```
