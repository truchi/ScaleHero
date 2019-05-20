import {
  __,
  converge,
  juxt,
  when,
  merge,
  unnest,
  times,
  nth,
  map,
  add,
  slice,
  adjust,
  append,
  assocPath,
  last,
  tail,
  compose,
  length as len,
  reduce,
  init,
  concat,
} from 'ramda'

//--
//   Timeline
//
//   Functions to expand timelines
//   into temporal sequences of state
//   provided the initial state
//
//   Timeline example:
//     [
//       [2],                                     // Nothing happening for some duration
//       [1, [{ path: [...], value: ... }, ...]], // Changes for some duration
//       [0, { ... }],                            // Ignored
//       [1],                                     // Continues last changes for some duration
//       ...
//     ]
//
//   Expansion example:
//     [
//       [0, { ... }]  // Initial state
//       [2, { ... }], // State for some duration
//       ...
//     ]
//--

//** Reduces state with changes
//:: Object state, Array changes -> Object newState
export const stateReducer=
  (state, changes) =>
    reduce(
      (state, { path, value }) => assocPath(path, value, state),
      state,
      changes,
    )

const repeatStart =
  ({ timeline, length, repeats }) =>
    ({
      repeats: append(
        {
          from: len(timeline),
          length,
        },
        repeats
      )
    })

//** Repeats from tip of repeats to tip of timeline, repeat times
//:: Object Array timeline Number length Array repeats, Object Number repeat
//::   -> Object Array repeat
const repeatEnd =
  ({ timeline, length, repeats }, { repeat }) => {
    const { from, length: fromLength } = last(repeats)

    const size     = length - fromLength                  // duration of slice
    const sliced   = slice(from, len(timeline), timeline) // slice to repeat
    const repeated = compose(
      unnest,
      tail,                          // Ignore first repeat (already in timeline)
      times(
        n =>
          map(                       // for each moment
            adjust(0, add(size * n)) // add size * repeatition to its time
          )(sliced)                  // of the slice
      )
    )(+repeat)                       // repeat times

    return {
      timeline: concat(timeline, repeated),
      length  : length + size * --repeat,
      repeats : init(repeats),
    }
  }

//** Pushes changes to timeline
//:: Object Array timeline Number length, Array Number duration Array changes, Function stateTransformer
//::   -> Object Array timeline Number length
const handleEvent =
  ({ timeline, length }, [duration, changes], stateTransformer) =>
    ({
      length  : length + duration,       // Add event's duration to length
      timeline: when(                    // If
        _ => len(changes),               // event has changes
        converge(append, [               // append
          juxt([                         // [
            _ => length,                 //   length,
            compose(                     //
              stateTransformer,          //   transformed
              stateReducer(__, changes), //   reduced
              nth(1),                    //   state
              last,                      //   from previous timeline moment
            )
          ]),                            // ]
          _ => _                         // to timeline
        ]),
        timeline
      )
    })

//** Reduces timed state with timeline event
//:: Function stateTransformer -> Object acc, Array timelineEvent -> Object acc
export const timelineReducer =
  (stateTransformer = _ => _) =>
    (acc, event) =>
      merge(
        acc,
        Array.isArray(event)
          ? handleEvent(acc, event, stateTransformer) // event = [duration, changes]
          : event.repeat === true
            ? repeatStart(acc)
            : repeatEnd(acc, event)                   // event = (int)repeat
      )

//** Expands (scans) timeline to timed state
//:: Object initialState, Array timeline -> Array timedState
export const expand =
  (state, timeline, stateTransformer = _ => _) => {
    return reduce(
      timelineReducer(stateTransformer),
      {
        timeline: [[0, state]],
        length: 0,
        repeats: []
      },
      timeline,
    )
  }

export default {
  stateReducer,
  timelineReducer,
  expand,
}
