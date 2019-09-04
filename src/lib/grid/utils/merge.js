import {
  adjust,
  all,
  append,
  applySpec,
  compose as c,
  concat,
  converge,
  evolve,
  head,
  isEmpty,
  map,
  merge,
  min,
  prop,
  reduce,
  tail,
  until,
} from 'ramda'

const splitItem =
  (at) =>
    (item) =>
      (({ duration, time } = item) =>
        at < duration
          ? [
            merge(item, { duration: at }),
            merge(item, { duration: duration - at, time: time + at })
          ]
          : [item]
      )()

const getMin     = c(reduce(min, Infinity), map(c(prop('duration'), head)))
const splitTimed = min => converge(concat, [c(splitItem(min), head), tail])

export default
  c(
    prop('merged'),
    until(
      c(all(isEmpty), prop('timeds')),
      ({ merged, timeds }) =>
        ((min = getMin(timeds)) =>
          reduce(
            (acc, timed) =>
              timed.length
                ? (([{ duration, time, ...data }, ...t] = splitTimed(min)(timed)) =>
                    evolve({
                      merged: adjust(-1, c(evolve({ merged: append(data) }), merge({ time, duration }))),
                      timeds: append(t)
                    })(acc)
                  )()
                : acc,
            { merged: append({ merged: [] }, merged), timeds: [] },
            timeds
          )
        )(),
    ),
    applySpec({
      merged: _ => [],
      timeds: _ => _,
    })
  )
