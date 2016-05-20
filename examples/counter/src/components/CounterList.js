/*eslint-disable no-unused-vars */

import React, { Component, PropTypes } from 'react'
import observe from './observe'
import { addCounter$ } from '../events'
import counterList from '../behaviors'
import Counter from './Counter'


const CounterListView = observe(() =>
  <div>{
    counterList().map(counter => <Counter counter={counter} key={counter.id}/>)
  }</div>
)

export default observe(() =>
  <div>
    <button onClick={addCounter$.next}>Add Counter</button>
    <CounterListView />
  </div>
)
