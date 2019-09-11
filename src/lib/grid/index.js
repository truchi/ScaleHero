import {
  compose as c,
  map,
} from 'ramda'
import group    from './utils/group'
import iterator from './utils/GroupsIterator'

export default
  (grid, timelines) =>
    c(
      iterator,
      map(group)
    )([grid, ...timelines])
