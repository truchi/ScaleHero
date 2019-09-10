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
  count =>
    converge(
      adjust(-1), // adjust last
      [
        c(        // with push last(arr) into repeat
          last => evolve({ repeat: c(append, merge(last))({ count }) }),
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
  index =>
    append({ index, count: 1, repeat: [] })

/**
 * Make an index object provided an tree item's indexes
 * @kind Number[] indexes -> Object index
 */
const index =
  ([section, line, bar, item]) =>
    ({ section, line, bar, item })

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
        (grouped, item, indexes) =>
          ((item, { repeat }, index) =>
            c(
              when(_ => !isEmpty(item), pushItem(merge({ index }, item))),
              when(_ => repeat        , pushGroup(index)),
            )(grouped)
          )(cleanItem(item), item, index(indexes)),

        // After
        // Close repeating
        (grouped, { count }, indexes) =>
          when(_ => count, popGroup(count))(grouped),

        // Get
        (item, indexes) =>
          item[
            ['sections', 'lines', 'bars', 'items'][indexes.length]
          ]
      )
    )(
      [{ repeat: [] }],                        // Accumulator: stack of children
      merge(tree, { repeat: true, count: 1 }), // Tree to group
                                               // (making sure there is a top level repeat)
    )
