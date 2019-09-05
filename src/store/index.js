import { createStore } from 'redux'
import reducer         from './reducer'
import {
  bpm,
  grid,
  timelines,
  instruments,
  palettes,
  scales,
  clipPaths,
  masks,
} from './data'
import reduce from '../lib/grid'
import src    from '../assets/backtrack.ogg'

const states = reduce(bpm, grid, timelines, instruments)

const initial = {
  src,
  index: 0,
  grid,
  states,
  clipPaths,
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
