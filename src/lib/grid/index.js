import recursiveReduce from './utils/recursiveReduce'
import {
  always,
  append,
  compose as c,
  concat,
  evolve,
  filter,
  init,
  is,
  isEmpty,
  last,
  map,
  merge,
  min,
  prop,
  reduce,
  splitAt,
} from 'ramda'

//** Provides iterator for a single grid
//** Provides iterator for multiple grids
export default class Grid {
  //** Contructor
  //:: Object Object grid -> grid
  constructor({ grid }) {
    this._grid = grid
    this._flat = this._flatten(grid)
  }

  //** Returns the flattened representation of the grid
  //:: Object grid -> Array flat
  _flatten(grid) {
    //** Accumulator
    //:: Object Array flat, Number elapsed, Array repeats
    const acc = { flat: [], elapsed: 0, repeats: [] }

    //** Handles opening repeats & data
    //:: Accumulator acc, Object item -> Accumulator acc
    const before =
      ({ flat, elapsed, repeats }, item) => {
        const data     = item.data
        const duration = data && data.duration
        const repeat   = item.repeat

        // Will hold, when applicable:
        // data, duration, repeat, at
        let elem = {}

        if (data  ) elem = merge(elem, { data, duration })
        if (repeat) elem = merge(elem, { repeat })

        if (!isEmpty(elem)) flat = append(merge(elem, { at: always(elapsed) }), flat)

        // Remember opening repeating sections (as index in flat)
        // and elapsed time
        if (repeat  ) repeats  = append(flat.length - 1, repeats)
        if (duration) elapsed += duration

        return { flat, elapsed, repeats }
      }

    //** Handles closing repeats
    //:: Accumulator acc, Object item -> Accumulator acc
    const after =
      ({ flat, elapsed, repeats }, item) => {
        const count = item.count

        if (Number.isInteger(count) && count > 1) {
          const from     = last(repeats)
          let   elem     = flat[from]
          const duration = elapsed - elem.at()
          const to       = flat.length

          // Add to, count & duration fields to the opening element
          flat[from] = merge(elem, { to, count, duration })

          let [before, after] = splitAt(from, flat)
          after = map(
            evolve({ at: at => (repeats = {}) => ((repeats[from] || 1) - 1) * duration + at(repeats) }),
            after
          )

          elapsed += duration * (count - 1)
          flat     = append({ from }, concat(before, after))
          repeats  = init(repeats)
        }

        return { flat, elapsed, repeats }
      }

    const get = item => item.elems || item.bars || item.lines || item.sections

    return recursiveReduce(before, after, get)(acc, grid).flat
  }

  iterator() {
    const flat    = this._flat
    const length  = flat.length
    let   index   = 0
    let   repeats = {}

    const forward  = () => ++index
    const stack    = () => repeats[index] = (repeats[index] || 0) + 1
    const redirect = (from, count) =>
      repeats[from] < count
        ? (index = from)
        : ((repeats[from] = 0, forward()))

    const goto = (time = 0) => {
      const { index: i, repeats: r } = this._find(time)
      index   = i
      repeats = r

      return { goto, next }
    }

    const next = () => {
      if (index >= length) return { done: true }

      const { repeat, data, from, at } = flat[index]
      const count = is(Number, from) && flat[from].count

      if (repeat) stack()
      if (count ) redirect(from, count)
      else        forward()

      return data ? { value: { data, elapsed: at(repeats) }, done: false } : next()
    }

    return { next, goto }
  }

  _find(time) {
    const flat    = this._flat
    let   i       = -1
    let   repeats = {}
    let   breakAt = flat.length
    let   index

    while(true) {
      i += 1

      // FIXME do not return an index without data...
      if (i >= breakAt) break

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

  static iterator(grids = []) {
    let duration = 0
    let elapsed  = 0
    let arr      = map(
      grid => {
        const iterator = new Grid({ grid }).iterator()
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
        map(({ value }) => value.elapsed + value.data.duration, nexts)
      ) - elapsed

      const changes = reduce(concat, [],
        map(({ value: { data: { changes } } }) => changes, nexts)
      )

      // forward
      arr = map(
        ({ iterator, next: { value, done } }) =>
          (forward => ((
            forward && ({ value, done } = iterator.next()),
            { iterator, next: { value, done } }
          )))(!done && value.elapsed + value.data.duration === elapsed + duration),
        arr
      )

      return { value: { data: { duration, changes }, elapsed }, done: false }
    }

    return { next, goto }
  }
}
