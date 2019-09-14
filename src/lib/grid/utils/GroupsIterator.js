import GroupIterator from './GroupIterator'
import {
  addIndex,
  all,
  append,
  call,
  clone,
  compose as c,
  equals,
  map,
  prop,
  reduce,
  when,
} from 'ramda'

export default
  (slice, accumulator) =>
  (groups) => {
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

    reset()

    return (it = {
      reset,
      next: () => {
        const isDone = c(all(equals(true)), map(prop('done')))(nexts)

        return isDone ? { done: true }
                      : c(update, slice)(nexts, accumulator)
      }
    })
  }
