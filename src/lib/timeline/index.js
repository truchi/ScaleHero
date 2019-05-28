import {
  T,
  __,
  adjust,
  append,
  apply,
  assocPath,
  compose as c,
  concat,
  cond,
  converge,
  equals,
  filter,
  flip,
  head,
  identity,
  ifElse,
  init,
  is,
  isNil,
  juxt,
  last,
  length,
  map,
  min,
  multiply,
  not,
  nth,
  nthArg,
  prepend,
  prop,
  reduce,
  repeat,
  slice,
  tail,
  unnest,
  until,
  zip,
} from 'ramda'

//--
//   Timeline
//
//   Deals with timeline in 3 stages:
//   Repeat expansion
//   Absolute time conversion
//   Merging
//   Reducing
//
//   Timeline:
//   [
//     ...
//     { repeat: true }, // indicates start of repeating section
//     [duration, data], // event: data with duration
//     ...
//     { repeat: 4 },    // indicates end of repeating section
//     ...
//   ]
//   Expanded:
//   [
//     [duration, data], // event in repeating section are duplicated
//     [duration, data],
//     ...
//   ]
//   Absolute time: (from expanded)
//   [                   // from starts at 0
//     [from, to, data], // begin time, end time, data
//     ...               // next from is prev to
//   ]
//   Merge: (from absolute expanded)
//   Takes multiples timelines and merges into a single timeline
//   Reduce: (from merged)
//   Reduces with initial state and time multiplier
//--

//--------------------//
//-- Expand repeats --//
//--------------------//

//** Checks wheter arg 2 has prop repeat equals to true
//:: , Object Any repeat -> Boolean isRepeat
const isRepeatStart =
 c(equals(true), prop('repeat'), nthArg(1))

//** Checks wheter arg 2 has prop repeat which is a Number
//:: , Object Any repeat -> Boolean isRepeat
const isRepeatEnd =
 c(is(Number), prop('repeat'), nthArg(1))

//** Appends timeline length to starts
//:: Object Array starts Array timeline -> Object Array starts Array timeline
const startRepeat =
  ({ starts, timeline }) => ({ starts: append(length(timeline), starts), timeline })

//** Appends repeated section to timeline
//:: Object Array starts Array timeline, Object Number repeat -> Object Array starts Array timeline
const endRepeat =
  ({ starts, timeline }, { repeat: count }) =>
    ((from, to) =>
      ({
        starts  : init(starts),            // remove last starting index
        timeline: from === to - 1          // repeating only 1 event?
          ? adjust(                        // change
            to - 1,                        // last event
            adjust(0, multiply(count)),    // by multiplying its duration by count
            timeline
          )
          : concat(                        // append
            timeline,
            unnest(
              repeat(
                slice(from, to, timeline), // slice to repeat
                count - 1                  // count - 1 times
              )
            )
          )
      })
    )(last(starts), length(timeline))

//** Appends event to timeline
//:: Object Array starts Array timeline, Array event -> Object Array starts Array timeline
const noRepeat =
  ({ starts, timeline }, event) => ({ starts, timeline: append(event, timeline) })

//** Expands repeated sections
//:: Array timeline -> Array timeline
export const expand =
  c(
    prop('timeline'),
    reduce(
      cond([                          // switch
        [isRepeatStart, startRepeat], // { repeat: true   } remember start
        [isRepeatEnd  ,   endRepeat], // { repeat: Number } repeat section
        [T            ,    noRepeat], // default            append event
      ]),
      { starts: [], timeline: [] }
    )
  )

//-------------------//
//-- Absolute time --//
//-------------------//

//** Squishes timeline in time
//:: Array timeline -> Array timeline
export const toAbsolute =
  c(
    prop('timeline'),
    reduce(
      ({ time, timeline }, [duration, data]) =>
        ({
          time    : time + duration, // increment time by current duration
          timeline: append(          // absolute time event:
            [
              time,                  // begin time
              time + duration,       // end time
              data || []             // data
            ],
            timeline
          ),
        }),
      { time: 0, timeline: [] }
    )
  )

//---------------------//
//-- Merge timelines --//
//---------------------//

//** Splits an event at time at
//** Returns 2 events if from < at < to, 1 otherwise
//:: Number at, Array Number from Number to Array data
//::   -> Array split
const splitEvent =
  at =>
    ([from, to, data]) =>
      (from < at && at < to)
        ? [[from, at, data], [at, to, data]]
        : [[from, to, data]]

//** Returns minimun of 2nd elements of array
//:: Array array -> Number minimum
const minEnd = c(reduce(min, Infinity), map(nth(1)))

//** Concats toghether last heads of array
//:: Array array -> Array array
const concatData = c(reduce(concat, []), map(c(last, head)))

//** Concats pairs when 2nd is not nil
//:: Array pairs -> Array array
const prependNotNil = ifElse(
  c(isNil, nth(1)),
  nth(0),
  apply(flip(prepend)),
)

//** Returns a pair of:
//**   the merged head data from from to to
//**   the tails from to
//:: Array Array heads Array tails, Array Number from Number to
//::   -> Array Array mergedHead, Array newTails
const _mergeHeads =
  ([heads, tails], [from, to]) =>
    c(
      juxt([
        _ => [from, to, concatData(_)], // merged head
        c(
          filter(length),               // remove empty new tails
          map(prependNotNil),           // [[end, tail], ...] or [[tail], ...]
          zip(tails),                   // append with resp. tail
          map(nth(1))                   // take 2nd elem (from to to end)
        )
      ]),
      map(splitEvent(to))               // split each head at to
    )(heads)

//** Merges head events into a single event
//:: Array timelines -> Array Array mergedHead, Array newTails
const mergeHeads =
  c(
    converge(
      _mergeHeads,                       // call _mergeHeads with
      [
        identity,                        // [heads, tails]
        c(                               // [from, to]:
          juxt([c(head, head), minEnd]), // [begin of first in, min of ends in]
          head                           // heads
        )
      ]
    ),
    juxt([map(head), map(tail)])         // [heads, tails]
  )

//** Merges timelines
//:: Array timelines -> Array timeline
export const merge =
  c(
    head,
    until(                            // repeat until
      c(not, length, last),           // tails are empty
      ([heads, tails]) =>
        juxt([
          c(append(__, heads), head), // merge head goes in heads
          nth(1)                      // new tails
        ])(mergeHeads(tails))         // tails -> merged head, new tails
    ),
    _ => [[], _]                      // [heads, tails]
  )

//--------------//
//-- Reducing --//
//--------------//

//** Reduces timeline with event
//:: Number multiplier
//::   -> Array timeline, Array Number from Number to Array changes
//::     -> Array timeline
const reducer =
  multiplier =>
    (timeline, [from, to, changes]) =>
      append(
        [
          from * (multiplier || 1),
          to   * (multiplier || 1),
          reduce(
            (state, { path, value }) => assocPath(path, value, state),
            c(nth(2), last)(timeline),
            changes
          )
        ]
      )(timeline)

//** Reduces timeline given from/to multiplier and initial state
//:: Number multiplier
//::   -> Array timeline, Object state, Number multiplier
//::     -> Array timeline
const _reduce =
  multiplier =>
    (timeline, state) =>
      tail(
        reduce(
          reducer(multiplier),
          [[0, 0, state]],
          timeline
        )
      )
export { _reduce as reduce }

export default {
  expand,
  toAbsolute,
  merge,
  reduce: _reduce,
}
