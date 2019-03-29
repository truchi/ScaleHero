import { createStore } from 'redux'
import * as Note from './lib/music/Note'
import * as R from 'ramda'

export const getBoxNote = ({ tuning }, { i: { stringIndex, boxIndex } }) =>
export const getLayerRange  = ({ layers   }) => R.range(   0, layers.length)
export const getStringRange = ({ tuning   }) => R.range(   0, tuning.length)
export const getBoxRange    = ({ from, to }) => R.range(from, to)

  Note.add(
    boxIndex,
    R.nth(stringIndex, tuning)
  )

export default createStore(
  state => state,
  {
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    from  : 0,
    to    : 12,
    layers: [
      {},
      {},
    ]
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
