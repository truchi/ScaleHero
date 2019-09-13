// RepeatableArray = { count: Number, repeat: Array }
import {
  clamp,
  clone,
} from 'ramda'

/**
 * Iterates over repeat, count times
 * @kind RepeatableArray ra -> Iterator iterator
 */
export default ({ count = 1, repeat = [] }) => {
  let   iterator
  const bounds = {
    min: {
      index: -1,
      count:  1
    },
    max: {
      index: repeat.length - 1,
      count
    }
  }

  const forward = () => ++cursor.index                        // Increments index
  const start   = () => ((cursor.index = -1, ++cursor.count)) // Increments count and resets index
  const get     = () => repeat[cursor.index]                  // Returns current value

  const moveForward = () => ((forward(), { value: get() }))   // Retuns current value and forwards
  const moveStart   = () => ((start(), moveForward()))        // Loops, return current value and forwards

  /**
   * Cursor
   * @kind { index: Number, count: Number }
   */
  const cursor = clone(bounds.min)

  /**
   * Iterator
   * @kind Object
   */
  return (iterator = {
    /**
     * Returns cursor
     * @kind () => Cursor cursor
     */
    cursor: () => clone(cursor),
    /**
     * Moves cursor to ith item, cth repeat
     * @kind Number i, Number c -> Iterator iterator
     */
    goto: ({ index = bounds.min.index, count = bounds.min.count } = {}) => ((
      cursor.index = clamp(bounds.min.index, bounds.max.index, index),
      cursor.count = clamp(bounds.min.count, bounds.max.count, count),
      iterator
    )),
    /**
     * Returns current value in array,
     * and move cursor to next value
     * @kind () -> Object { value, done }
     */
    next: () => {
      const canForward = cursor.index < bounds.max.index
      const canRepeat  = cursor.count < bounds.max.count
      const isDone     = !canForward && !canRepeat

      return isDone     ? { done: true }
           : canForward ? moveForward()
                        : moveStart()
    },
  })
}
