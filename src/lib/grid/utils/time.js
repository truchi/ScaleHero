import {
  append,
  compose as c,
  merge,
  prop,
  reduce,
} from 'ramda'

export default
  c(
    prop('flat'),
    reduce(
      ({ time, flat }, item) =>
        ({
          time: time + item.duration,
          flat: append(merge({ time }, item), flat)
        }),
      { time: 0, flat: [] },
    )
  )
