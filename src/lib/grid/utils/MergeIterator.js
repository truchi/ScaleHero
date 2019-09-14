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
    (iterators) => {
      let iterator, nexts
      accumulator = clone(accumulator)

      const update = ([sliced, acc]) =>
        ((values, cursors) => ((
          cursors = map(c(call, prop('cursor')))(iterators),
          [values, nexts] = addIndex(reduce)(
            ([values, nexts], [value, next], i) => [
              append(when(_ => !!_, prop('value')    )(value), values),
              append(when(_ =>  !_, iterators[i].next)(next ), nexts ),
            ],
            [[], []],
            sliced
          ),
          accumulator = acc,
          { value: { values, cursors, ...accumulator } }
        )))()

      const reset = () => ((
        iterators = map(c(call, prop('reset')))(iterators),
        nexts     = map(c(call, prop('next' )))(iterators),
        iterator
      ))

      reset()

      return (iterator = {
        reset,
        next: () => {
          const isDone = c(all(equals(true)), map(prop('done')))(nexts)

          return isDone ? { done: true }
                        : c(update, slice)(nexts, accumulator)
        }
      })
    }
