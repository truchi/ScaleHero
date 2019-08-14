import flatten from './utils/flatten'
import {
  compose as c,
  filter,
  is,
  map,
  min,
  prop,
  reduce,
} from 'ramda'

const find = (flat, time) => {
  let   i       = -1
  let   repeats = {}
  let   breakAt = flat.length
  let   index

  while(true) {
    i += 1

    // FIXME do not return an index without data...
    if (i >= breakAt) break

    // FIXME this changed
    const { repeat, duration, count, from, to, at } = flat[i]

    if (from) continue

    const begin = at(repeats)
    const end   = begin + (count || 1) * duration
    const here  = begin <= time && time < end

    if (repeat) {
      if (here) {
        repeats[i] = Math.floor((time - begin) / (duration || 1)) + 1
        breakAt    = to
      } else {
        i = to
      }
    } else {
      if (here) {
        index = i
        break
      }
    }
  }

  return { index, repeats }
}

const it = (grid) => {
  const flat    = flatten(grid)
  const length  = flat.length
  let   index   = 0
  let   repeats = {}

  window.flat = flat
  console.log(flat)

  const forward  = () => ++index
  const stack    = () => repeats[index] = (repeats[index] || 0) + 1
  const redirect = (from, count) =>
    repeats[from] < count
      ? (index = from)
      : ((repeats[from] = 0, forward()))

  const goto = (time = 0) => {
    const { index: i, repeats: r } = find(time)
    index   = i
    repeats = r

    return { goto, next }
  }

  const next = () => {
    if (index >= length) return { done: true }

    const { repeat, data, duration, from, at } = flat[index]
    const count = is(Number, from) && flat[from].repeat.count

    // debugger
    if (repeat) stack()
    if (count ) redirect(from, count)
    else        forward()

    return data ? { value: { data, duration, elapsed: at(repeats) }, done: false } : next()
  }

  return { next, goto }
}

export const iterator = (grids = []) => {
  let duration = 0
  let elapsed  = 0
  let arr      = map(
    grid => {
      const iterator = it(grid)
      const next     = iterator.next()

      return { iterator, next }
    },
    grids
  )

  const goto = time => {
    arr = map(
      ({ iterator, next }) => ((next = iterator.goto(time).next(), { iterator, next })),
      arr
    )

    duration = 0
    elapsed  = time
  }

  const next = () => {
    const nexts = c(filter(({ done }) => !done), map(prop('next')))(arr)

    if (!nexts.length) return { done: true }

    elapsed += duration
    duration = reduce(min, Infinity,
      map(({ value }) => value.elapsed + value.duration, nexts)
    ) - elapsed

    const data = map(({ value: { data } }) => data, nexts)

    arr = map(
      ({ iterator, next: { value, done } }) =>
        (forward => ({
          iterator,
          next: (forward ? iterator.next() : { value, done })
        }))(!done && value.elapsed + value.duration === elapsed + duration),
      arr
    )

    return { value: { data, duration, elapsed }, done: false }
  }

  return { next, goto }
}
