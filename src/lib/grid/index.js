import group from './utils/group'
import time  from './utils/time'
import {
  compose as c,
  merge,
  nth,
  reduce,
} from 'ramda'

export const init =
  c(
    time,                             // attach time related data
    nth(0),                           // single top most of
    group,                            // grouped by repeats
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
