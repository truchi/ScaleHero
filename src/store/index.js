import { createStore } from 'redux'
import reducer         from './reducer'
import {
  // bpm,
  // grid,
  // timelines,
  // state,
  tunings,
  palettes,
  scales,
  clips,
  // masks,
} from './data'
import {
  itWorks,
} from './itworks'
import getStates from '../lib/grid'
import src       from '../assets/backtrack.ogg'

const { bpm, grid, timelines, state, masks } = itWorks()
const states = getStates(bpm, grid, timelines, state)

const initial = {
  src,
  grid,
  states,
  state: states[0].state,
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
