import { update } from './Tree'
import {
  append,
  compose as c,
  defaultTo,
  evolve,
  map,
  merge,
  prop,
  reduce,
  sum,
} from 'ramda'

/**
 * Get duration of item
 * @kind Object item -> Number duration
 */
const duration =
  c(
    sum,
    map(prop('total')),
    defaultTo([]),
    prop('repeat'),
  )

/**
 * Returns items with at
 * @kind Array items -> Array items
 */
const at =
  c(
    prop('items'),
    reduce(
      ({ at, items }, item) => ({
        items: append(merge({ at }, item), items), // merge item with accumulated sum
        at   : at + item.total                     // add total
      }),
      { at: 0, items: [] }, // starts at 0
    ),
  )

/**
 * Times a group
 * Marks duration, count & at (elapsed from begin of group)
 * @kind Object group -> Object group
 */
export default
  c(
    merge({ at: 0 }), // top most (grid) at (very beginning)
    update(
      // Before
      _ => _,

      // After
      // Attach duration, count, total & at
      (item) =>
        ((duration, count) =>
          c(
            merge({ count, duration, total: count * duration }), // Add count, duration & total to element
            evolve({ repeat: at })                               // Set at of children
          )(item)
        )(
          item.duration || duration(item), // Get duration
          item.count    || 1               // Get count
        ),

      // Get
      c(defaultTo([]), prop('repeat')),

      // Set
      (item, repeat) => merge(item, { repeat })
    ),
  )
