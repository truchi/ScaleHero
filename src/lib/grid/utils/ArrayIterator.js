// RepeatableArray = { count: Number, repeat: Array }

/**
 * Iterates over repeat, count times
 * @kind RepeatableArray ra -> Iterator iterator
 */
export default ({ count = 1, repeat = [] }) => {
  let   iterator
  const bounds = {
    index: repeat.length,
    count
  }

  const forward = () => ++cursor.index                       // Increments index
  const start   = () => ((cursor.index = 0, ++cursor.count)) // Increments count and resets index
  const get     = () => repeat[cursor.index]                 // Returns current value

  const moveForward = () => (value => ((value = get(), forward(), { value })))() // Retuns current value and forwards
  const moveStart   = () => ((start(), moveForward()))                           // Loops, return current value and forwards

  /**
   * Cursor
   * @kind { index: Number, count: Number }
   */
  const cursor = {
    index: 0,
    count: 1,
  }

  /**
   * Iterator
   * @kind Object
   */
  return (iterator = {
    /**
     * Returns cursor
     * @kind () => Cursor cursor
     */
    cursor: () => Object.assign({}, cursor),
    /**
     * Moves cursor to ith item, cth repeat
     * @kind Number i, Number c -> Iterator iterator
     */
    goto: ({ index = cursor.index, count = cursor.count } = {}) => ((
      cursor.index = Math.min(index, bounds.index),
      cursor.count = Math.min(count, bounds.count),
      iterator
    )),
    /**
     * Returns current value in array,
     * and move cursor to next value
     * @kind () -> Object { value, done }
     */
    next: () => {
      const canForward = cursor.index < bounds.index
      const canRepeat  = cursor.count < bounds.count
      const isDone     = !canForward && !canRepeat

      return isDone
        ? { done: true }
        : canForward
          ? moveForward()
          : moveStart()
    },
  })
}
