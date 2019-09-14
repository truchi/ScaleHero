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
import group    from './utils/group'
import iterator from './utils/GroupsIterator'

const getItem = (item, index) => item[['sections', 'lines', 'bars', 'items'][index.length]]
const isItem  = (item, index) => index.length === 4

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
  (nexts, { time }) =>
    ((values, duration = minDuration(nexts)) =>
      [map(slice(duration))(nexts), { time: time + duration }])()

export default
  (grid, timelines) =>
    c(
      iterator(sliceNexts, { time: 0 }),
      map(group(getItem, isItem))
    )([grid, ...timelines])
