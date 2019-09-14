import {
  compose as c,
  map,
} from 'ramda'
import group    from './utils/group'
import iterator from './utils/GroupsIterator'

const getItem = (item, index) => item[['sections', 'lines', 'bars', 'items'][index.length]]
const isItem  = (item, index) => index.length === 4

export default
  (grid, timelines) =>
    c(
      iterator,
      map(group(getItem, isItem))
    )([grid, ...timelines])
