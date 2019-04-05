import { createStore } from 'redux'
import {
  Note,
  Interval,
  Scale,
} from './lib/music'
import * as R from 'ramda'

export const getLayerRange  = ({ layers   }) => R.range(0, layers.length)
export const getStringRange = ({ tuning   }) => R.range(0, tuning.length)
export const getBoxRange    = ({ from, to }) => R.range(from, to)

export const getNote = ({ tuning }, { stringIndex, boxIndex }) =>
  Note.add(boxIndex)(tuning[stringIndex])

export const getLayer = ({ layers, masks, palettes, scales }, { layerIndex }) =>
  R.evolve({
    masks  : R.map(R.nth(R.__, masks)),
    palette: R.nth(R.__, palettes),
    scale  : R.nth(R.__, scales  ),
  },
    layers[layerIndex]
  )

/* SHIT start */
window.Note = Note
window.Interval = Interval
window.Scale = Scale
window.R = R

const intervals = [
  '1', 'b2', '2', '#2', 'b3', '3', 'b4', '4', '#4', 'b5', '5', '#5', 'b6', '6', 'bb7', 'b7', '7'
]

const palettes = [
  Object.fromEntries(
    intervals.map(i => [i, { color: 'red' }])
  )
]

const scales = [
  ['1', '2', '3', '4', '5', '6', '7']
]

const masks = [
  [
    [[-Infinity, 5], [8, Infinity]],
    [[-Infinity, 5], [8, Infinity]],
    [[-Infinity, 5], [8, Infinity]],
    [[-Infinity, 5], [8, Infinity]],
    [[-Infinity, 5], [8, Infinity]],
    [[-Infinity, 5], [8, Infinity]],
  ]
]
/* SHIT end */

const initialState = {
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
  from  : 0,
  to    : 12,
  layers: [
    {
      masks: [0],
      palette: 0,
      scale: 0,
      root: 'C'
    },
    {
      masks: [0],
      palette: 0,
      scale: 0,
      root: 'C'
    },
  ],
  masks,
  palettes,
  scales
}

export default createStore(
  state => state,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
