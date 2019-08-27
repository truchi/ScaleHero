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
          last => evolve({ repeat: c(append, merge(last))({ count }) }),
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
        repeat: flip(concat)( map(merge({ count: 1 }), items || []) )
      })
    )

const pushGroup =
  item =>
    append(
      merge(
        omit(['repeat', 'items'], item),
        { count: 1, repeat: [] }
      )
    )

const groupRepeats =
  c(
    path([0, 'repeat']),
    reduce(
      (tree, item) =>
        (({ count, repeat }) =>
          c(
            when(_ => count, popGroup(item)),
            pushItems(item),
            when(_ => repeat, pushGroup(item))
          )(tree)
        )(item),
      [{ repeat: [] }]
    )
  )

export default groupRepeats
