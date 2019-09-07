import flatten    from './utils/flatten'
import time       from './utils/time'
import merge      from './utils/merge'
import {
  assocPath,
  compose as c,
  map,
  prop,
  reduce,
  scan,
  unnest,
} from 'ramda'

export default
  (bpm, grid, timelines, state) =>
    scan(
      ({ state }, { time, duration, merged: [{ index }, ...events] }) => ({
        index,
        time    : 60 * time     / (bpm),
        duration: 60 * duration / (bpm),
        state   : reduce(
          (state, { path, value }) => assocPath(path, value, state),
          state,
          c(unnest, map(prop('events')))(events)
        )
      }),
      { time: 0, duration: 0, state },
      c(merge, map(c(time, flatten)))([grid, ...timelines])
    )
