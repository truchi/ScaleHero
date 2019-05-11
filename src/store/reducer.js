import { cleanNilsRecurs } from '../lib/utils'
import {
  __,
  defaultTo,
  identity,
  assocPath,
  compose,
  curry,
  lensPath,
  over,
  reduce,
  uncurryN,
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
  //** Applies actions and clean arrays
  //:: Object state -> Array actions -> Object state
  next: curry(uncurryN(2,
    state =>
      compose(
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
    compose(
      // window.__D('-> state'),
      defaultTo(identity, reducers[type])
    )(state, payload)
