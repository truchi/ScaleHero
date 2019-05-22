import {
  multiply,
  update,
  isNil,
  repeat,
  T,
  nthArg,
  equals,
  prop,
  cond,
  __,
  curry,
  add,
  adjust,
  append,
  assocPath,
  concat,
  converge,
  init,
  juxt,
  last,
  length,
  map,
  merge,
  compose as c,
  nth,
  reduce,
  slice,
  tail,
  times,
  unnest,
  when,
  findLast,
  tap,
  is,
  allPass,
  not,
  complement
} from 'ramda'

//-------------------//
//-- Apply changes --//
//-------------------//

// // TODO inline?
// const hasChanges =
//   allPass([is(Array), c(is(Array), nth(1))])

// const hasState =
//   allPass([is(Array), nth(1)]) // TODO array???

// const getLastState =
//   c(nth(1), findLast(hasState))

// //** Reduces state with changes
// //:: Object state -> Array changes -> Object newState
// export const stateReducer = curry(
//   (state, changes) =>
//     reduce(
//       (state, { path, value }) => assocPath(path, value, state),
//       state,
//       changes,
//     )
// )

// //** Appends next moment in timeline given current event
// //:: Array timeline -> Object|Array event -> Array timeline
// export const changesReducer = curry(
//   (timeline, event) =>
//     append(
//       when( // TODO adjust when is better ?
//         hasChanges,
//         adjust(1, stateReducer(getLastState(timeline))),
//         event
//       ),
//       timeline
//     )
// )

// //** Applies changes in timeline when events have changes, given initial state
// //:: Object state, Array timeline -> Array timeline
// export const applyChanges = curry(
//   (state, timeline) =>
//     reduce(
//       changesReducer,
//       [[0, state]],
//       timeline
//     )
// )

//--------------------//
//-- Expand repeats --//
//--------------------//

const isRepeatStart =
 c(equals(true), prop('repeat'), nthArg(1))

const isRepeatEnd =
 c(is(Number), prop('repeat'), nthArg(1))

//** Appends timeline length and last state to repeats
//:: Object Array repeats Array timeline -> Object Array repeats Array timeline
const startRepeat =
  ({ repeats, timeline }) => ({ repeats: append(length(timeline), repeats), timeline })

//** Appends repeated section to timeline
//:: Object Array repeats Array timeline, Object Number repeat -> Object Array repeats Array timeline
const endRepeat =
  ({ repeats, timeline }, { repeat: count }) =>
    ((from, to) =>
      ({
        repeats : init(repeats),
        timeline: from === to - 1
          ? adjust(
            to - 1,
            adjust(0, multiply(count)),
            timeline
          )
          : concat(
            timeline,
            unnest(
              repeat(
                slice(from, to, timeline),
                count - 1
              )
            )
          )
      })
    )(last(repeats), length(timeline))

//** Appends moment to timeline
//:: Object Array repeats Array timeline, Array moment -> Object Array repeats Array timeline
const noRepeat =
  ({ repeats, timeline }, moment) => ({ repeats, timeline: append(moment, timeline) })

//** Expands repeated sections
//:: Array timeline -> Array timeline
export const expandRepeats =
  c(
    prop('timeline'),
    reduce(
      cond([
        [isRepeatStart, startRepeat],
        [isRepeatEnd  , endRepeat  ],
        [T            , noRepeat   ],
      ]),
      { repeats: [], timeline: [] }
    )
  )

//-----------------//
//-- Squish time --//
//-----------------//

//** Squishes timeline in time
//:: Array timeline -> Array timeline
export const squishTime =
  c(
    when(
      c(equals(0), nth(0), nth(1)),
      tail
    ),
    prop('timeline'),
    reduce(
      ({ timeline, offset }, [duration, state]) =>
        ({
          offset  : offset + duration,
          timeline: when(
            _ => !isNil(state),
            append([offset, state]),
            timeline
          )
        }),
      { offset: 0, timeline: [] }
    )
  )

//---------------------//
//-- Merge timelines --//
//---------------------//

// export const mergeTimelines =

export default {
  // stateReducer,
  // changesReducer,
  // applyChanges,
  expandRepeats,
  squishTime,
}
