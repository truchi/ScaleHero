import { reduce, update } from './utils/Tree'
import groupRepeats    from './utils/groupRepeats'
import {
  append,
  compose as c,
  concat,
  cond,
  defaultTo,
  either,
  map,
  merge,
  prop,
  reduce as r,
  sum,
  when,
} from 'ramda'

const condDefault  = pairs => cond(concat(pairs, [[_ => true, _ => _]]))
const isGrid       = idxs => idxs.length === 0
const isSection    = idxs => idxs.length === 1
const isBar        = idxs => idxs.length === 3
const appendRepeat = ({ repeat }) => when(_=> repeat, append({ repeat }))
const appendCount  = ({ count  }) => when(_=> count , append({ count  }))
const appendIndex  = (item, indexes) =>
  (index =>
    append(merge({ index }, item))
  )(
    {
      section: indexes[0],
      line   : indexes[1],
      bar    : indexes[2],
    }
  )

export const doStuff =
  grid => {
    grid = groupRepeats(
      reduce(
        // Before
        (flat, item, indexes) =>
          condDefault([
            [_ => either(isGrid, isSection)(indexes), appendRepeat(item)         ],
            [_ => isBar                    (indexes), appendIndex (item, indexes)],
          ])(flat),
        // After
        (flat, item, indexes) =>
          when(
            _ => either(isGrid, isSection)(indexes),
            appendCount(item)
          )(flat),
        // Get
        (item, indexes) => item[['sections', 'lines', 'bars', 'items'][indexes.length]]
      )([], merge({ repeat: true, count: 1 }, grid))
    )[0]

    // console.log(grid)
    // console.log(JSON.stringify(grid, null, 4))

    const before = (item, idxs) => merge({ before: 'before' }, item)
    const after  = (item, idxs) => merge({ after : 'after'  }, item)
    const get = c(defaultTo([]), prop('groups'))
    const set = (item, groups) => merge(item, { groups })

    console.log(JSON.stringify(grid, null, 4))
    const test = update(before, after, get, set)(grid)
    console.log(JSON.stringify(test, null, 4))
    console.log('===========')
    console.log('===========')
    console.log('===========')
    console.log('===========')

    // const after = (item) => {
    //   let items = item.groups || []

    //   if (!item.duration)
    //     item.duration = sum(map(prop('total'), items))

    //   item.count = item.count || 1
    //   item.total = item.duration * item.count

    //   if (item.groups)
    //     item.groups =
    //       c(
    //         prop('items'),
    //         r(
    //           ({ at, items }, item) => ({
    //               at   : at + item.total,
    //               items: append(merge({ at }, item), items)
    //           }),
    //           { at: 0, items: [] },
    //         )
    //       )(items)


    //   return item
    // }

    // const get = c(defaultTo([]), prop('groups'))

    // grid = reduce(() => null, (_, i) => after(i), get)(null, grid)
    // grid = merge({ at: 0 }, grid)

    return grid
  }

window.elapsed = grid => cursor => {
  const { elapsed, item: { at } } = r(
    ({ elapsed, item: { at, duration, groups } }, { index = 0, repeats = 1 }) =>
      ({
        elapsed: elapsed + (repeats - 1) * duration + at,
        item   : groups[index]
      }),
    { elapsed: 0, item: grid },
    cursor
  )

  return elapsed + at
}
