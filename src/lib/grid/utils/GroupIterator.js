import ArrayIterator from './ArrayIterator'
import {
  adjust,
  append,
  call,
  compose as c,
  last,
  map,
  pick,
  prop,
  reduce,
  tap,
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
export default ({ count, repeat }) => {
  let iterator
  let stack = [ArrayIterator({ count, repeat })] // Iterator stack

  const pop  = ()    => ((stack.pop()                     , iterator.next()))
  const push = value => ((stack.push(ArrayIterator(value)), iterator.next()))

  return (iterator = {
    /**
     * Returns cursor
     * @kind () => Cursor cursor
     */
    cursor: () => map(pick(['index', 'repeat']), stack),
    /**
     * Moves cursor
     * @kind Cursor cursor -> Iterator iterator
     */
    goto: (cursor = [{}])=> ((
      stack = c(
        prop('stack'),
        // Construct iterator stack
        reduce(
          ({ stack, current }, { index, count } = {}) =>
            ({
              stack: c(
                // Append array iterator moved to the given index & repeat
                append(ArrayIterator(current).goto(index, count)),
                // Call next on previous iterator
                // (user gives a path to the current position,
                // so all array iterator --except for the last one-- have to be nexted)
                adjust(-1, tap(c(call, prop('next')))),
              )(stack),
              // new current is indexth child of old current
              current: current.repeat[index]
            }),
          // Initialize with empty stack and initial group
          { stack: [], current: { count, repeat } }
        )
      )(cursor),
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

      return done
        ? pop()
        : recursive
          ? push(value)
          : { value }
    },
  })
}
