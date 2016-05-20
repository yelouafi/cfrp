/*eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { computed } from '../../../../src'
import observe from './observe'
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
