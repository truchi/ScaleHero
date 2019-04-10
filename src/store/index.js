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
    intervals.map(i => [i, { color: 'blue', radius: .5 }])
  ),
  Object.fromEntries(
    intervals.map(i => [i, { color: 'red', radius: 0 }])
  ),
]

const scales = [
  ['1', '2', '3', '4', '5', '6', '7']
]

const boxMasks = [
  new Mask({ transition: 'southeast' }),
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
      MAX: 2,
      boxMask: 0,
      layerMasks: [0],
      palette: 0,
      root: 'C',
      scale: 0,
    },
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

const dispatch =
  (root, palette) =>
    () =>
      store.dispatch({
        type: 'next',
        payload: [
          { path: ['layers', 0, 'root'], value: root },
          { path: ['layers', 0, 'palette'], value: palette },
        ]
      })

window.dispatch = dispatch
setTimeout(dispatch('C#', 1), 2000)
setTimeout(dispatch('D', 0), 4000)
setTimeout(dispatch('E', 1), 6000)
setTimeout(dispatch('F', 0), 8000)
setTimeout(dispatch('G', 1), 10000)

window.store = store
export default store
