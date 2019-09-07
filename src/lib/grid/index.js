import flatten    from './utils/flatten'
import time       from './utils/time'
import merge      from './utils/merge'
import reduce     from './utils/reduce'
import {
  compose as c,
  map,
} from 'ramda'

export default
  (bpm, grid, timelines, state) =>
    c(
      reduce(bpm, state),
      merge,
      map(c(time, flatten))
    )([grid, ...timelines])
