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
  (grid, timelines, instruments) =>
    scan(
      ({ instruments }, { time, duration, merged: [{ index }, ...events] }) => ({
        index,
        time,
        duration,
        instruments: reduce(
          (instruments, { path, value }) => assocPath(path, value, instruments),
          instruments,
          events
        )
      }),
      { instruments },
      c(merge, map(c(time, flatten)))([grid, ...timelines])
    )
