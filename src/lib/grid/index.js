import _group         from './utils/group'
import groupIterator  from './utils/GroupIterator'
import groupsIterator from './utils/GroupsIterator'

const getItem = (item, index) => item[['sections', 'lines', 'bars', 'items'][index.length]]
const isItem  = (item, index) => index.length === 4

export const group = _group(getItem, isItem)

export {
  groupIterator,
  groupsIterator,
}
