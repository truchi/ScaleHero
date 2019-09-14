import { createStore } from 'redux'
import reducer         from './reducer'
import {
  // bpm,
  // grid,
  // timelines,
  // instruments,
  // masks,

  src,
  tunings,
  palettes,
  scales,
  clips,
} from './data'
import {
  itWorks,
} from './itworks'
import { group, groupsIterator } from '../lib/grid'

const { bpm, grid, timelines, instruments, masks } = itWorks()
const groups   = [grid, ...timelines].map(group)
const iterator = groupsIterator(groups)
window.it = iterator

const initial = {
  bpm,
  src,
  grid,
  iterator,
  next: iterator.next(),
  index: null,
  initialInstruments: instruments,
  instruments,
  tunings,
  clips,
  masks,
  palettes,
  scales,
}

const store = createStore(
  reducer,
  initial,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

window.store   = store
window.initial = initial
export default store
