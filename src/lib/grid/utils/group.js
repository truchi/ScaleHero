import { reduce } from './Tree'
import {
  adjust,
  append,
  compose as c,
  converge,
  evolve,
  init,
  last,
  merge,
  path,
  when,
} from 'ramda'

/**
 * Pops last arr element into before last's last repeat key,
 * merged with count
 * @kind Number count -> Array arr -> Array arr
 */
const popGroup =
  (endIndex, count) =>
    converge(
      adjust(-1), // adjust last
      [
        c(        // with push last(arr) into repeat
          last => evolve({ repeat: c(append, merge(last))({ endIndex, count }) }),
          last
        ),
        init      // of init(arr) with
      ]
    )

/**
 * Push an item into the arr's last element's repeat key
 * @kind Item item -> Array arr -> Array arr
 */
const pushItem =
  item =>
    adjust(
      -1,
      evolve({ repeat: append(item) })
    )

/**
 * Append a group with index
 * @kind Object index -> Array arr -> Array arr
 */
const pushGroup =
  startIndex =>
    append({ startIndex, count: 1, repeat: [] })

/**
 * Transforms a tree marked with repeat and count
 * to a multidimensionnal array as recursive repeat sections
 * @kind Tree tree -> GroupedArray grouped
 */
export default
  (
    get, // (item, index) -> [items]: returns item's children
    is,  // (item, index) -> Boolean: returns true if item has to be pushed in group
  ) =>
    (
      tree, // Tree to group by repeat sections
    ) =>
      c(
        path([0, 'repeat', 0]),
        reduce(
          // Before
          // Make new level when repeating,
          // add item if it has data
          (grouped, item, index) =>
            c(
              when(_ => is(item, index), pushItem(merge({ index }, item))),
              when(_ => item.repeat    , pushGroup(index)),
            )(grouped),

          // After
          // Close repeating
          (grouped, { count }, index) =>
            when(_ => count, popGroup(index, count))(grouped),

          // Get
          get,
        )
      )(
        [{ repeat: [] }],                        // Accumulator: stack of children
        merge({ repeat: true, count: 1 }, tree), // Tree to group
                                                // (making sure there is a top level repeat)
      )
