import GroupIterator from './GroupIterator'
import {
  addIndex,
  all,
  append,
  assocPath,
  call,
  compose as c,
  cond,
  equals,
  evolve,
  identity,
  juxt,
  lt,
  map,
  min,
  omit,
  pathOr,
  prop,
  reduce,
  unapply,
  when,
} from 'ramda'

const minAll  = reduce(min, Infinity)
const list    = unapply(identity)
const reduceI = addIndex(reduce)
const minus   = a => b => b - a

const isDone      = c(equals(true), prop('done'))
const getDuration = pathOr(Infinity, ['value', 'duration'])
const minDuration = c(minAll, map(getDuration))
const longerThan  = at => c(lt(at), getDuration)

const _slice =
  at =>
    juxt([
      assocPath(['value', 'duration'], at),
      evolve({
        value: {
          duration: minus(at)
        }
      })
    ])

const slice =
  at =>
    cond([
      [isDone        , _ => []   ],
      [longerThan(at), _slice(at)],
      [_ => true     , list      ],
    ])

export default
  (groups) => {
    let it, iterators, nexts, elapsed

    const getValue = when(_ => !!_, c(omit(['duration']), prop('value')))
    const getNext  = i => when(_ => !_, iterators[i].next)

    const reduceSliced =
      ([values, nexts], [value, next], i) => [
        append(getValue  (value), values),
        append(getNext(i)(next ), nexts ),
      ]

    const reset = () => ((
      iterators = map(GroupIterator)(groups),
      nexts     = map(c(call, prop('next')))(iterators),
      elapsed   = 0,
      it
    ))

    const next = () =>
      ((values, duration = minDuration(nexts), time = elapsed) =>
        ((
          [values, nexts] = c(
            reduceI(reduceSliced, [[], []]),
            map(slice(duration))
          )(nexts),
          elapsed += duration,
          { value: { values, time, duration } }
        ))
      )()

    reset()

    return (it = {
      reset,
      next: () => {
        const isDone = c(all(equals(true)), map(prop('done')))(nexts)

        return isDone ? { done: true }
                      : next()
      }
    })
  }
