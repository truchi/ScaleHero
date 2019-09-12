// RepeatableArray = { count: Number, repeat: Array }

/**
 * Iterates over repeat, count times
 * @kind RepeatableArray ra -> Iterator iterator
 */
export default ({ count = 1, repeat = [] }) => {
  /**
   * Cursor
   * @kind { index: Number, count: Number }
   */
  const cursor = {
    index: 0,
    count: 1,
  }

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
   * Iterator
   * @kind Object
   */
  return ({
    /**
     * Returns current value in array,
     * and move cursor to next value
     * @kind () -> Object { value, done }
     */
    next: () => {
      const canForward = cursor.index < bounds.index
      const canRepeat  = cursor.count < bounds.count
      const isDone     = !canForward && !canRepeat

      return isDone     ? { done: true }
           : canForward ? moveForward()
                        : moveStart()
    },
  })
}
