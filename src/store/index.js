import { createStore } from 'redux'
import reducer         from './reducer'
import {
  bpm,
  grid,
  timelines,
  state,
  masks,

  src,
  tunings,
  palettes,
  scales,
  clips,
} from './data'
import {
  // itWorks,
} from './itworks'
import it from '../lib/grid'

// const { bpm, grid, timelines, state, masks } = itWorks()
const iterator = it(grid, timelines)
window.it = iterator

const initial = {
  bpm,
  src,
  iterator,
  next: iterator.next(),
  grid,
  state,
  initialState: state,
  index: null,
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
