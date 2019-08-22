import {
  adjust,
  append,
  compose as c,
  concat,
  converge,
  evolve,
  flip,
  init,
  last,
  map,
  merge,
  omit,
  path,
  reduce,
  when,
} from 'ramda'

const popGroup =
  ({ count }) =>
    converge(
      adjust(-1),
      [
        c(
          last => evolve({ groups: append(merge(last, { count })) }),
          last
        ),
        init
      ]
    )

const pushItems =
  ({ items }) =>
    adjust(
      -1,
      evolve({
        groups: flip(concat)( map(merge({ count: 1 }), items || []) )
      })
    )

const pushGroup =
  item =>
    append(
      merge(
        omit(['repeat', 'items'], item),
        { count: 1, groups: [] }
      )
    )

const groupRepeats =
  c(
    path([0, 'groups']),
    reduce(
      (tree, item) =>
        (({ count, repeat }) =>
          c(
            when(_ => count, popGroup(item)),
            pushItems(item),
            when(_ => repeat, pushGroup(item))
          )(tree)
        )(item),
      [{ groups: [] }]
    )
  )

export default groupRepeats
