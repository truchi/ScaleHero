import { createStore } from 'redux'
import reducer         from './reducer'
import { Mask }        from '../lib/polygon'

/* SHIT start */
const intervals = [
  '1', 'b2', '2', '#2', 'b3', '3', 'b4', '4',
  '#4', 'b5', '5', '#5', 'b6', '6', 'bb7', 'b7', '7'
]

const palettes = [
  Object.fromEntries(
    intervals.map(i => [i, { color: 'blue', radius: 0 }])
  )
]

const scales = [
  ['1', '2', '3', '4', '5', '6', '7']
]

const boxMasks = [
  new Mask()
]

const layerMasks = [
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

const initial = {
  tuning  : ['E', 'A', 'D', 'G', 'B', 'E'],
  from    : 0,
  to      : 12,
  duration: 1000,
  layers: [
    {
      boxMask: 0,
      layerMasks: [0],
      palette: 0,
      units: [{ scale: 0, root: 'C', animate: 'enter' }]
    },
    // {
    //   boxMask: 0,
    //   layerMasks: [0],
    //   palette: 0,
    //   units: [{ scale: 0, root: 'C', animate: 'enter' }]
    // },
  ],
  boxMasks,
  layerMasks,
  palettes,
  scales
}

const store = createStore(
  reducer,
  initial,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

true && setTimeout(
  () =>
    store.dispatch({
      type: 'next',
      payload: [
        // { path: ['from'], value: 3 },
        // { path: ['tuning', 2], value: null },
        { path: ['layers', 1], value: null },
        { path: ['layers', 0, 'masks', 0], value: null },
        { path: ['layers', 0, 'masks', 1], value: 1 },
        {
          path: ['layers', 0, 'units', 0],
          value: { scale: 0, root: 'C', animate: 'leave' }
        },
        {
          path: ['layers', 0, 'units', 1],
          value: { scale: 0, root: 'F', animate: 'enter' }
        },
      ]
    }),
  5000
)

window.store = store
export default store
