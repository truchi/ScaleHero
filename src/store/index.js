import { createStore } from 'redux'
import reducer         from './reducer'
import {
  bpm,
  grid,
  timelines,
  state,
  palettes,
  scales,
  clipPaths,
  masks,
} from './data'
import reduce from '../lib/grid'
import src    from '../assets/backtrack.ogg'

const s = reduce(bpm, grid, timelines, state)

const initial = {
  src,
  grid,
  clipPaths,
  states: s,
  state: s[0],
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
