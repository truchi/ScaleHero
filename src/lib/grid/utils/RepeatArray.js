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

const iterator = ({ count, groups }) => {
  let   index   = 0
  let   repeats = 1
  const length  = groups.length

  const goto = (i = 0, r = 1) => ((
    index   = i,
    repeats = r,
    { next, goto, index, repeats }
  ))

  const forward = () => ++index
  const repeat  = () => ((index = 0, ++repeats))
  const get     = () => groups[index]

  const next = () => {
    let value

    if (index < length) {
      value = get()
      forward()
    } else if (repeats < count) {
      repeat()
      value = get()
      forward()
    } else {
      return { done: true }
    }

    return { value, done: false }
  }

  return { next, goto, index, repeats }
}

export const recursiveIterator = ({ count, groups }) => {
  let its = [iterator({ count, groups })]

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
            current: current.groups[index]
          }),
        { its: [], current: { count, groups } }
      )
    )(cursor),
    { next, goto, cursor: getCursor() }
  ))

  const next = () => {
    let it = last(its)
    if (!it) return { done: true }

    let { value, done } = it.next()
    const recursive     = value && value.count && value.groups

    if (done     ) return ((its.pop()                , next()))
    if (recursive) return ((its.push(iterator(value)), next()))

    return { value, done }
  }

  return { next, goto, cursor: getCursor() }
}

export default iterator
