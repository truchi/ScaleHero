import GroupIterator from './GroupIterator'
import {
  addIndex,
  all,
  append,
  assocPath,
  call,
  clone,
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
  when,
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

export default
  (groups, accumulator) => {
    let it, iterators, nexts
    accumulator = clone(accumulator)

    const update = ([sliced, acc]) =>
      ((values) => ((
        [values, nexts] = addIndex(reduce)(
          ([values, nexts], [value, next], i) => [
            append(when(_ => !!_, prop('value')    )(value), values),
            append(when(_ =>  !_, iterators[i].next)(next ), nexts ),
          ],
          [[], []],
          sliced
        ),
        accumulator = acc,
        { value: { values, ...accumulator } }
      )))()

    const reset = () => ((
      iterators = map(GroupIterator)(groups),
      nexts     = map(c(call, prop('next')))(iterators),
      it
    ))

    const sliceNexts = (nexts, acc) =>
      ((values, duration = minDuration(nexts)) => [map(slice(duration))(nexts), acc + 1])()

    reset()

    return (it = {
      reset,
      next: () => {
        const isDone = c(all(equals(true)), map(prop('done')))(nexts)

        return isDone ? { done: true }
                      : c(update, sliceNexts)(nexts, accumulator)
      }
    })
  }
