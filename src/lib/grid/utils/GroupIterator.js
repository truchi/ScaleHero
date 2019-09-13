import ArrayIterator from './ArrayIterator'
import {
  append,
  call,
  clone,
  compose as c,
  last,
  map,
  prop,
  reduce,
  reduced,
} from 'ramda'

// Group = RecursiveRepeatableArray = { count: Number, repeat: Group[] }

// Cursor = { index, repeat }[]
// A path to the position of the element
// to be returned by the next call to next
// @example
//   const group = { repeat: [1, { repeat: [2, 3] }] }
//   const value = iterator(group).goto([{ index: 1 }, { index: 0 }]).next()
//   // value === 2

/**
 * Iterates over a group
 * @kind Group group -> Iterator iterator
 */
export default ({ count = 1, repeat = [] }) => {
  let iterator
  let stack  = [ArrayIterator({ count, repeat })]
  let cursor = []

  const getCursor = () => cursor = map(c(call, prop('cursor')))(stack)

  const pop  = ()    => ((stack.pop()                     , iterator.next()))
  const push = value => ((stack.push(ArrayIterator(value)), iterator.next()))

  return (iterator = {
    /**
     * Returns cursor
     * @kind () => Cursor cursor
     */
    cursor: () => clone(cursor),
    /**
     * Moves cursor
     * @kind Cursor cursor -> Iterator iterator
     */
    goto: (cursor = [])=> ((
      stack = c(
        prop('stack'),
        reduce(
          (
            { stack, current },
            cursor,
            iterator = ArrayIterator(current).goto(cursor),
            index    = iterator.cursor().index
          ) =>
            current.repeat
              ? ({
                stack: append(iterator)(stack), // append array iterator moved to the given index & repeat
                current: current.repeat[index], // new current is indexth child of old current
              })
              : reduced({ stack, current }),    // cannot go further
          { stack: [], current: { count, repeat } }
        )
      )(cursor.length ? cursor : [{}]),
      getCursor(),
      iterator
    )),
    /**
     * Returns current value in group,
     * and move cursor to next value
     * @kind () -> Object { value, done }
     */
    next: () => {
      const it = last(stack)
      if (!it) return { done: true }

      let { value, done } = it.next()
      const recursive     = value && value.count && value.repeat

      return done      ? pop()
           : recursive ? push(value)
                       : ((getCursor(), { value }))
    },
  })
}
