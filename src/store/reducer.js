import { cleanNilsRecurs } from '../lib/utils'
import {
  __,
  assocPath,
  compose as c,
  curry,
  defaultTo,
  identity,
  lensPath,
  map,
  over,
  propOr,
  reduce,
  uncurryN,
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

//** Returns state with paths (recursively) clean of nils
//:: Object state -> Array paths -> Object state
const cleanNilsReduce =
  reduce(
    (state, path) =>
      over(lensPath(path), cleanNilsRecurs, state)
  )

//--
//   Reducers
//--

//** Reducers keyed by action type
//:: Object String actionType Function reducer
const reducers = {
  initState: (state) => console.log(state.initialState[0].layers[0]) || ({
    ...state,
    index: null,
    state: state.initialState,
  }),
  reduceState: (state, { values: [grid, ...timelines] }) => {
    const index = propOr({}, 'index')(grid)
    const events = c(unnest, map(propOr([], 'events')))(timelines || [])

    return {
      ...state,
      index,
      state: reduce(
        (state, { path, value }) => assocPath(path, value, state),
        state.state,
        events
      )
    }
  },
  //** Applies actions and clean arrays
  //:: Object state -> Array actions -> Object state
  next: curry(uncurryN(2,
    state =>
      c(
        cleanNilsReduce(__, [['tuning'], ['layers']]),
        assocPathReduce(state)
      )
  )),
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
