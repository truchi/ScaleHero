import groupIterator from './GroupIterator'
import mergeIterator from './MergeIterator'
import {
  assocPath,
  compose as c,
  cond,
  equals,
  evolve,
  juxt,
  lt,
  map,
  min,
  pathOr,
  prop,
  reduce,
} from 'ramda'

const isDone      = c(equals(true), prop('done'))
const getDuration = pathOr(Infinity, ['value', 'duration'])
const minDuration = c(reduce(min, Infinity), map(getDuration))
const longerThan  = at => c(lt(at), getDuration)

const _slice =
  at =>
    juxt([
      assocPath(['value', 'duration'], at),
      evolve({ value: { duration: d => d - at } })
    ])

const slice =
  at =>
    cond([
      [isDone        , _ => []   ],
      [longerThan(at), _slice(at)],
      [_ => true     , _ => [_]  ],
    ])

const sliceNexts =
  (nexts, { time, end }) =>
    ((values, duration = minDuration(nexts)) =>
      [map(slice(duration))(nexts), { time: end, end: end + duration }])()

export default c(
  mergeIterator(sliceNexts, { time: 0, end: 0 }),
  map(groupIterator)
)
