import {
  reduce,
} from 'ramda'

export const recursiveReduce =
  (before, after, get) =>
    (acc, item) =>
      ((items, acc, reducer) =>
        (acc =>
          after(acc, item)
        )(items ? reduce(reducer, acc, items) : acc)
      )(
        get(item),
        before(acc, item),
        (acc, item) =>
          recursiveReduce(before, after, get)(acc, item)
      )
