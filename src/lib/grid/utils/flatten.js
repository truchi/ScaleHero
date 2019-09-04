import { reduce } from './Tree'
import {
  adjust,
  append,
  compose as c,
  concat,
  evolve,
  flip,
  head,
  identity as id,
  init,
  last,
  map,
  merge as m,
  times,
  unnest,
} from 'ramda'

const depths  = ['grid', 'section', 'line', 'bar', 'item']
const is      = x => i => depths[i.length] === x
const fconcat = flip(concat)
const fmerge  = flip(m)

const index2obj = ([section, line, bar, item]) =>
  c(
    item    !== undefined ? fmerge({ item   : { i: item    } }) : id,
    bar     !== undefined ? fmerge({ bar    : { i: bar     } }) : id,
    line    !== undefined ? fmerge({ line   : { i: line    } }) : id,
    section !== undefined ? fmerge({ section: { i: section } }) : id,
  )({ grid: { i: 1 } })
const setIndex      = index => fmerge({ index: index2obj(index) })
const repeatSection =
  (arr, count, key) =>
    c(
      unnest,
      times(
        n =>
          ((repeat = n + 1) =>
            map(evolve({ index: { [key]: m({ repeat, count }) } }))(arr)
          )()
      )
    )(count)

export default
  (grid) =>
    c(
      head,
      reduce(
        // Before
        (acc, item, i) =>
          c(
            is('item')(i) ? adjust(-1, append(setIndex(i)(item))) : id,
            item.repeat   ? append([])                            : id,
          )(acc),
        // After
        (acc, { count }, i) => (
          count
            ? ((items = repeatSection(last(acc), count, depths[i.length])) =>
                c(adjust(-1, fconcat(items)), init)
              )()
            : id
        )(acc),
        // Get
        i =>
          i.items || i.bars || i.lines || i.sections
      )
    )([[]], grid)
