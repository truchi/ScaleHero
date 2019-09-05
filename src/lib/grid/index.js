import flatten    from './utils/flatten'
import time       from './utils/time'
import merge      from './utils/merge'
import {
  assocPath,
  compose as c,
  map,
  reduce,
  scan,
} from 'ramda'

export default
  (bpm, grid, timelines, instruments) =>
    scan(
      ({ instruments }, { time, duration, merged: [{ index }, ...events] }) => ({
        index,
        time       : 60 * time     / (bpm),
        duration   : 60 * duration / (bpm),
        instruments: reduce(
          (instruments, { path, value }) => assocPath(path, value, instruments),
          instruments,
          events
        )
      }),
      { time: 0, duration: 0, instruments },
      c(merge, map(c(time, flatten)))([grid, ...timelines])
    )
