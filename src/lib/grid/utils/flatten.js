// @flow
import { type Grid } from '../types'
import recursiveReduce from './recursiveReduce'
import {
  always,
  append,
  concat,
  evolve,
  init,
  last,
  map,
  merge,
  omit,
  splitAt,
} from 'ramda'

/** Item type */
type Item = Object

/** Accumulator type */
type Accumulator = {|
  flat   : Array<Object>,
  elapsed: number,
  repeats: number[],
|}

/** HasDuration type */
type HasDuration = {|
  duration: number,
  at      : Function,
|}

/** Repeat type */
type Repeat = {|
  to   : number,
  count: number,
|}

/** FlatGridRepeat type */
type FlatGridRepeat = {|
  ...HasDuration,
  ...{|
    repeat: Repeat,
  |}
|}

/** FlatGridData type */
type FlatGridData = {|
  ...HasDuration,
  ...{|
    data: Object,
  |}
|}

/** FlatGridRedirect type */
type FlatGridRedirect = {|
  from: number,
|}

/** FlatGrid type */
type FlatGrid =
  | FlatGridRepeat
  | FlatGridData
  | FlatGridRedirect

/**
 * Handles opening repeats & data
 * @kind Accumulator acc, Item item -> Accumulator acc
 */
const before =
  (
    { flat, elapsed, repeats }: Accumulator,
    item: Item,
  ): Accumulator => {
    const data     = item.data
    const duration = data && data.duration
    const repeat   = item.repeat

    // Will hold, when applicable:
    // data, duration, repeat, at
    let elem = {}

    // Add data, duration and at when applicable
    if (data)
      elem = merge(elem, { data: omit(['duration'], data), duration })
    if (data || repeat)
      flat = append(merge(elem, { at: always(elapsed) }), flat)

    // Remember opening repeating sections (as index in flat)
    // and elapsed time
    if (repeat  ) repeats  = append(flat.length - 1, repeats)
    if (duration) elapsed += duration

    return { flat, elapsed, repeats }
  }

/**
 * Handles closing repeats
 * @kind Accumulator acc, Item item -> Accumulator acc
 */
const after =
  (
    { flat, elapsed, repeats }: Accumulator,
    item: Item,
  ): Accumulator => {
    const count = item.count

    // When the grid node has count
    // we end the current repeating section
    if (Number.isInteger(count) && count > 1) {
      const from = last(repeats)

      // Abort if no start of repeating section
      if (from == null) return { flat, elapsed, repeats }

      let   elem     = flat[from]
      const duration = elapsed - elem.at()
      const to       = flat.length

      // Add to, count & duration fields to the opening element
      flat[from] = merge(elem, { repeat: { to, count }, duration })

      // Update at function of all items
      // of the repeating section
      let [before, after] = splitAt(from, flat)
      after = map(
        evolve({ at:
          at =>
            // Here, repeats is the iterator's repeats cursor
            // {[from]: count }
            (repeats = {}) =>
              // Return the enclosing (current) duration
              // plus the previous value
              ((repeats[from] || 1) - 1) * duration + at(repeats)
        }),
        after
      )

      elapsed += duration * (count - 1)
      flat     = append({ from }, concat(before, after))
      repeats  = init(repeats)
    }

    return { flat, elapsed, repeats }
  }

/**
 * Returns item's children
 * @kind Item item -> Array Item children
 */
const get =
  (item: Item): Item[] =>
    item.elems || item.bars || item.lines || item.sections

/**
 * Returns the flattened representation of the grid
 * @kind Object grid -> Array flat
 */
const flatten =
  (grid: Grid): FlatGrid =>
    recursiveReduce(
      before,
      after,
      get,
    )(
      {
        flat   : [],
        elapsed: 0,
        repeats: []
      },
      grid,
    ).flat

export default flatten
