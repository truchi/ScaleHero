import { update } from './utils/Tree'
import groupRepeats    from './utils/groupRepeats'
import {
  append,
  compose as c,
  defaultTo,
  evolve,
  map,
  merge,
  nth,
  prop,
  reduce,
  sum,
} from 'ramda'

const duration =
  c(
    sum,
    map(prop('total')),
    defaultTo([]),
    prop('repeat'),
  )

const at =
  c(
    prop('items'),
    reduce(
      ({ at, items }, item) => ({
        at   : at + item.total,
        items: append(merge({ at }, item), items)
      }),
      { at: 0, items: [] },
    ),
  )

const time =
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
            merge({ count, duration, total: count * duration }),
            evolve({ repeat: at })
          )(item)
        )(
          item.duration || duration(item),
          item.count    || 1
        ),

      // Get
      c(defaultTo([]), prop('repeat')),

      // Set
      (item, repeat) => merge(item, { repeat })
    ),
  )

export const init =
  c(
    time,                             // attach time related data
    nth(0),                           // single top most of
    groupRepeats,                     // grouped by repeats
    merge({ repeat: true, count: 1 }) // make sure there is a top most repeat on grid
  )

window.elapsed = grid => cursor => {
  const { elapsed, item: { at } } = reduce(
    ({ elapsed, item: { at, duration, repeat } }, { index = 0, repeats = 1 }) =>
      ({
        elapsed: elapsed + (repeats - 1) * duration + at,
        item   : repeat[index]
      }),
    { elapsed: 0, item: grid },
    cursor
  )

  return elapsed + at
}
