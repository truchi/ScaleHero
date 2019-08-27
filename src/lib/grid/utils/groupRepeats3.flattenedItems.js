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

const pushItem =
  (item) =>
    adjust(
      -1,
      evolve({ repeat: append(item) })
    )

const pushGroup =
  (item) =>
    append(
      merge(item, { count: 1, repeat: [] })
    )

const groupRepeats =
  c(
    path([0, 'repeat']),
    reduce(
      (tree, item) =>
        (({ count, repeat }) =>
          c(
            when(_ =>  count           , popGroup (item)),
            when(_ => !repeat && !count, pushItem (item)),
            when(_ =>  repeat          , pushGroup(item)),
          )(tree)
        )(item),
      [{ repeat: [] }]
    )
  )

export default groupRepeats
