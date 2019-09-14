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

// Ideas:
// goto(cursor, fn): with fn cleaning the nexts buffer
// (would allow state serialization)
// (remove accumulator)

export default
  (slice, accumulator) =>
    (iterators) => {
      let iterator, nexts
      accumulator = clone(accumulator)

      const update = addIndex(map)((next, i) => when(_ =>  !_, iterators[i].next)(next))

      const set = ([sliced, acc]) =>
        ((values, cursors) => ((
          [values, nexts] = reduce(
            ([values, nexts], [value, next]) => [
              append(when(_ => !!_, prop('value'))(value), values),
              append(next, nexts),
            ],
            [[], []],
            sliced
          ),
          accumulator = acc,
          { value: { values, ...accumulator } }
        )))()

      const reset = () => ((
        iterators = map(c(call, prop('reset')))(iterators),
        nexts     = map(c(call, prop('next' )))(iterators),
        iterator
      ))

      reset()

      return (iterator = {
        reset,
        cursor: () => map(c(call, prop('cursor')))(iterators),
        next: () => {
          nexts = update(nexts)
          const isDone = c(all(equals(true)), map(prop('done')))(nexts)

          return isDone ? { done: true }
                        : c(set, slice)(nexts, accumulator)
        }
      })
    }
