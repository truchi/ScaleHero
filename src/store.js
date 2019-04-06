import { createStore } from 'redux'
import {
  Interval,
  Note,
  Scale,
} from './lib/music'
import {
  Mask,
} from './lib/instrument'
import {
  __,
  evolve,
  map,
  nth,
  range,
} from 'ramda'

export const getLayerRange  = ({ layers   }) => range(0, layers.length)
export const getStringRange = ({ tuning   }) => range(0, tuning.length)
export const getBoxRange    = ({ from, to }) => range(from, to)

export const getFrom = ({ from }) => from

export const getNote = ({ tuning }, { string, box }) =>
  Note.add(box)(tuning[string])

export const getLayer = ({ layers, masks, palettes, scales }, { layer }) =>
  evolve({
    masks  : map(nth(__, masks)),
    palette: nth(__, palettes),
    scale  : nth(__, scales  ),
  },
    layers[layer]
  )

/* SHIT start */
window.Note     = Note
window.Interval = Interval
window.Scale    = Scale
window.Mask     = Mask

const intervals = [
  '1', 'b2', '2', '#2', 'b3', '3', 'b4', '4',
  '#4', 'b5', '5', '#5', 'b6', '6', 'bb7', 'b7', '7'
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

const store = createStore(
  state => console.log('haha') || state,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

window.store = store

export default store
