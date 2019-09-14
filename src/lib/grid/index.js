import _group         from './utils/group'
import groupIterator  from './utils/GroupIterator'
import groupsIterator from './utils/GroupsIterator'
import {
  append,
  compose as c,
  reduce,
} from 'ramda'

export const group = _group(
  (item, index) => item[['sections', 'lines', 'bars', 'items'][index.length]],
  (item, index) => index.length === 4
)

export const getIndex =
  (grid, current = group(grid)) =>
    c(
      ({ current: { index }, repeats }) => ({ index, repeats }),
      reduce(
        ({ current: { startIndex, endIndex, repeat }, repeats }, { index, count }) => ({
          current: repeat[index],
          repeats: append({ startIndex, endIndex, count }, repeats),
        }),
        { current, repeats: [] },
      )
    )

export {
  groupIterator,
  groupsIterator,
}
