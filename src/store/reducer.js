// import { cleanNilsRecurs } from '../lib/utils'
import {
  assocPath,
  compose as c,
  defaultTo,
  filter,
  identity,
  // lensPath,
  map,
  // over,
  pathOr,
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

//** Returns state with paths (recursively) clean of nils
//:: Object state -> Array paths -> Object state
// const cleanNilsReduce =
//   reduce(
//     (state, path) =>
//       over(lensPath(path), cleanNilsRecurs, state)
//   )

const getEvents = c(
  unnest,
  filter(_ => _),
  map(prop('events')),
  tail,
  prop('values'),
)

const getIndex = pathOr(null, ['values', 0, 'index'])

//--
//   Reducers
//--

//** Reducers keyed by action type
//:: Object String actionType Function reducer
const reducers = {
  next: (state) =>
    (({ iterator, next: { value, done }, instruments } = state) =>
      done
        ? state
        : ({
          ...state,
          next : iterator.next(),
          index: getIndex(value),
          instruments: assocPathReduce(instruments, getEvents(value)),
        })
    )(),
  init: (state) =>
    (({ iterator, initialInstruments } = state) =>
      ({
        ...state,
        next       : iterator.reset().next(),
        index      : null,
        instruments: initialInstruments,
      })
    )(),
  reset: (state) =>
    (({ next, init } = reducers) =>
      c(next, init)(state)
    )(),
  // //** Applies actions and clean arrays
  // //:: Object state -> Array actions -> Object state
  // next: curry(uncurryN(2,
  //   state =>
  //     c(
  //       cleanNilsReduce(__, [['tuning'], ['layers']]),
  //       assocPathReduce(state)
  //     )
  // )),
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
