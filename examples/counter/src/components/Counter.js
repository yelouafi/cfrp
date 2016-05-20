/*eslint-disable no-unused-vars */

import React, { Component, PropTypes } from 'react'
import observe from './observe'
import { inc$, dec$, incIfOdd$, incAsync$ } from '../events'


const CounterView = observe(({count}) => <span>Clicked: {count()} times</span>)

export default observe(({counter}) =>
  <p>
    <CounterView count={counter.count} />
    {' '}
    <button onClick={inc$.next.bind(null, counter.id)}>
      +
    </button>
    {' '}
    <button onClick={dec$.next.bind(null, counter.id)}>
      -
    </button>
    {' '}
    <button onClick={incIfOdd$.next.bind(null, counter.id)}>
      Increment if odd
    </button>
    {' '}
    <button onClick={incAsync$.next.bind(null, counter.id)}>
      Increment async
    </button>
  </p>
)
