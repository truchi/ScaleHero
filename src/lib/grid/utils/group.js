import { reduce } from './Tree'
import {
  adjust,
  append,
  compose as c,
  converge,
  evolve,
  init,
  isEmpty,
  last,
  merge,
  omit,
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
 * Removes non-data keys on item
 * @kind Item item -> Item item
 */
const cleanItem =
  omit(['repeat', 'count', 'sections', 'lines', 'bars', 'items'])

/**
 * Transforms a tree marked with repeat and count
 * to a multidimensionnal array as recursive repeat sections
 * @kind Tree tree -> GroupedArray grouped
 */
export default
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
          ((item, { repeat }) =>
            c(
              when(_ => !isEmpty(item), pushItem(merge({ index }, item))),
              when(_ => repeat        , pushGroup(index)),
            )(grouped)
          )(cleanItem(item), item),

        // After
        // Close repeating
        (grouped, { count }, index) =>
          when(_ => count, popGroup(index, count))(grouped),

        // Get
        (item, index) =>
          item[
            ['sections', 'lines', 'bars', 'items'][index.length]
          ]
      )
    )(
      [{ repeat: [] }],                        // Accumulator: stack of children
      merge({ repeat: true, count: 1 }, tree), // Tree to group
                                               // (making sure there is a top level repeat)
    )
