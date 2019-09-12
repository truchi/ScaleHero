import ArrayIterator from './ArrayIterator'
import {
  last,
} from 'ramda'

// Group = RecursiveRepeatableArray = { count: Number, repeat: Group[] }

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
                       : { value }
    },
  })
}
