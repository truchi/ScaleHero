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

const iterator = ({ count, repeat }) => {
  let   index   = 0
  let   repeats = 1
  const length  = repeat.length

  const goto = (i = 0, r = 1) => ((
    index   = i,
    repeats = r,
    { next, goto, index, repeats }
  ))

  const forward = () => ++index
  const repeatt = () => ((index = 0, ++repeats))
  const get     = () => repeat[index]

  const next = () => {
    let value

    if (index < length) {
      value = get()
      forward()
    } else if (repeats < count) {
      repeatt()
      value = get()
      forward()
    } else {
      return { done: true }
    }

    return { value, done: false }
  }

  return { next, goto, index, repeats }
}

export const recursiveIterator = ({ count, repeat }) => {
  let its = [iterator({ count, repeat })]

  const getCursor = () => map(pick(['index', 'repeats']), its)

  const goto = (cursor = [{}])=> ((
    its = c(
      prop('its'),
      reduce(
        ({ its, current }, { index = 0, repeats = 1 } = {}) =>
          ({
            its: c(
              append(iterator(current).goto(index, repeats)),
              adjust(-1, tap(c(call, prop('next')))),
            )(its),
            current: current.repeat[index]
          }),
        { its: [], current: { count, repeat } }
      )
    )(cursor),
    { next, goto, cursor: getCursor() }
  ))

  const next = () => {
    let it = last(its)
    if (!it) return { done: true }

    let { value, done } = it.next()
    const recursive     = value && value.count && value.repeat

    if (done     ) return ((its.pop()                , next()))
    if (recursive) return ((its.push(iterator(value)), next()))

    return { value, done }
  }

  return { next, goto, cursor: getCursor() }
}

export default iterator
