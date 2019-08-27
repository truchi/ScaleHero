// @flow
import type { Tree        } from '../Tree.types'
import type { RepeatArray } from './RepeatArray.types'
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

const popGroup =
  (count) =>
    converge(
      adjust(-1),
      [
        c(
          last => evolve({ repeat: c(append, merge(last))({ count }) }),
          last
        ),
        init
      ]
    )

const pushItem =
  (item) =>
    adjust(
      -1,
      evolve({ repeat: append(item) })
    )

const pushGroup =
  (index) =>
    append({ index, count: 1, repeat: [] })

const index =
  ([section, line, bar, item]) =>
    ({ section, line, bar, item })

const cleanItem =
  omit(['repeat', 'count', 'sections', 'lines', 'bars', 'items'])

/**
 * Transforms a tree marked with repeat and count
 * to a multidimensionnal array as recursive repeat sections
 * @kind Tree tree => RepeatArray grouped
 */
export default
  (
    tree: Tree, // Tree to group by repeat sections
  ): RepeatArray =>
    c(
      path([0, 'repeat']),
      reduce(
        // Before
        //
        (grouped, item, indexes) =>
          ((item, { repeat }, index) =>
            c(
              when(_ => !isEmpty(item), pushItem(merge({ index }, item))),
              when(_ => repeat        , pushGroup(index)),
            )(grouped)
          )(cleanItem(item), item, index(indexes)),

        // After
        (grouped, { count }, indexes) =>
          when(_ => count, popGroup(count))(grouped),

        // Get
        (item, indexes) =>
          item[
            ['sections', 'lines', 'bars', 'items'][indexes.length]
          ]
      )
    )(
      [{ repeat: [] }],
      tree
    )
