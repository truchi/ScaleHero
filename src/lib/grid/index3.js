import {
  adjust,
  append,
  assoc,
  compose as c,
  concat,
  converge,
  evolve,
  flip,
  init,
  last,
  map,
  merge,
  nth,
  omit,
  prop,
  reduce,
  when,
} from 'ramda'

const moveToParent =
  count =>
    tree =>
      adjust(
        -1,
        evolve({ groups: append(merge(last(tree), { count })) }),
        init(tree)
      )

const groupRepeating =
  c(
    prop('groups'),
    nth(0),
    reduce(
      (tree, { repeat, count, items }) =>
        c(
          // Push last group as before last's children
          when(
            _ => count,
            moveToParent(count)
          ),
          // Add current bar's items to last group
          adjust(
            -1,
            evolve({ groups: flip(concat)( map(merge({ count: 1 }), items) ) })
          ),
          // Append a new group for each repeat
          when(
            _ => repeat,
            append({ count: 1, groups: [] })
          )
        )(tree),
      [{ groups: [] }]
    )
  )

const mergeLines =
  c(
    reduce(concat, []),
    map(prop('bars')),
    prop('lines')
  )

const getGroups =
  converge(
    assoc('groups'),
    [
      c(
        groupRepeating,
        mergeLines,
      ),
      omit(['lines'])
    ]
  )

export const doStuff =
  converge(
    assoc('groups'),
    [
      c(map(getGroups), prop('sections')),
      omit(['sections'])
    ]
  )
