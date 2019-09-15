// import { cleanNilsRecurs } from '../lib/utils'
import { getIndex } from '../lib/grid'
import {
  assocPath,
  compose as c,
  defaultTo,
  filter,
  identity,
  map,
  prop,
  reduce,
  tail,
  unnest,
} from 'ramda'

//--
//   Utils
//--

//** Returns state with actions applied
//:: Object state -> Array actions -> Object state
const assocPathReduce =
  reduce(
    (state, { path, value }) =>
      assocPath(path, value, state)
  )

const getEvents = c(
  unnest,
  filter(_ => _),
  map(prop('events')),
  tail,
  prop('values'),
)

//--
//   Reducers
//--

//** Reducers keyed by action type
//:: Object String actionType Function reducer
const reducers = {
  next: (state) => ((
    { grid, gridGroup, iterator, next: { value, done }, instruments: instrs } = state,
    cursor      = iterator.cursor()[0],
    index       = getIndex(grid, gridGroup)(cursor),
    next        = iterator.next(),
    instruments = assocPathReduce(instrs, getEvents(value)),
  ) =>
    done ? state : ({ ...state, index, next, instruments }))(),
  init: (state) => ((
    { grid, gridGroup, iterator, initialInstruments } = state,
    cursor      = iterator.reset().cursor()[0],
    index       = getIndex(grid, gridGroup)(cursor),
    next        = iterator.next(),
    instruments = initialInstruments,
  ) =>
    ({ ...state, next, index, instruments }))(),
  reset: (state) =>
    (({ next, init } = reducers) =>
      c(next, init)(state))(),
}

//** Reduces state with action
//:: (Object state, Object action) -> Object state
export default
  (state, { type, payload }) =>
    // defaultTo(identity, reducers[type])(state, payload)
    // console.log('reducing', type, payload, state) ||
    c(
      // window.__D('-> state'),
      // _ => console.log('reduced', JSON.stringify(_)) || _,
      defaultTo(identity, reducers[type]),
    )(state, payload)
