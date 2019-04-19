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
    intervals.map(
      (i, ind) =>
        [i, {
          fill: {
            type: ['lines', 'circles', 'paths'][ind % 3],
            d: 'crosses',
            stroke: `hsl(${ 360 * (ind + intervals.length / 2) / intervals.length }, 100%, 50%)`,
            fill  : `hsl(${ 360 * (ind + intervals.length / 2) / intervals.length }, 100%, 50%)`,
            lighter: true,
            thicker: true,
            background: `hsl(${ 360 * ind / intervals.length }, 50%, 50%)`,
          },
          radius: ind % 3 === 0 ? .5 : 0,
        }]
    )
  ),
  Object.fromEntries(
    intervals.map(i => [i, { color: 'red', radius: 0 }])
  ),
]

const scales = [
  ['1', '2', '3', '4', '5', '6', '7']
]

const boxMasks = [
  new Mask({ size: 1, type: 'rect', subtype: 'diamond' }),
  new Mask({ size: .25, type: 'triangle', subtype: 'topleft', transition: 'southeast' }),
  new Mask({ size: .25, type: 'triangle', subtype: 'topright', transition: 'southwest' }),
  new Mask({ size: .25, type: 'triangle', subtype: 'bottomleft', transition: 'northeast' }),
  new Mask({ size: .25, type: 'triangle', subtype: 'bottomright', transition: 'northwest' }),
]

const layerMasks = [
  [
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
    [[-Infinity, 8], [8, Infinity]],
  ]
]
/* SHIT end */

const initial = {
  tuning  : ['E', 'A', 'D', 'G', 'B', 'E'],
  from    : 0,
  to      : 12,
  duration: 500,
  layers: [
    {
      MAX: 3,
      boxMask: 0,
      layerMasks: [0],
      palette: 0,
      root: 'C',
      scale: 0,
    },
    {
      MAX: 3,
      boxMask: 1,
      layerMasks: [0],
      palette: 0,
      root: 'D',
      scale: 0,
    },
    {
      MAX: 3,
      boxMask: 2,
      layerMasks: [0],
      palette: 0,
      root: 'E',
      scale: 0,
    },
    {
      MAX: 3,
      boxMask: 3,
      layerMasks: [0],
      palette: 0,
      root: 'F',
      scale: 0,
    },
    {
      MAX: 3,
      boxMask: 4,
      layerMasks: [0],
      palette: 0,
      root: 'G',
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
  (roots, palettes) =>
    store.dispatch({
      type: 'next',
      payload:
      roots
        .map((root, i) => ({
          path: ['layers', i, 'root'],
          value: root
        }))
        .concat(
          palettes
            ? palettes.map((palette, i) => ({
                path: ['layers', i, 'palette'],
                value: palette
              }))
            : []
        )
    })

window.dispatch = dispatch
const cycle = arr => {
  arr = arr.concat([arr.shift()])
  arr = arr.concat([arr.shift()])
  return arr
}
let roots = ['C', 'D', 'E', 'F', 'G']

const disp = () => dispatch(roots = cycle(roots))
const go   = () => {
  disp()
  roots.map((v, i) => {
    window.intervalID = setTimeout(disp, i * 2000)
  })
}
const stop = () => clearInterval(window.intervalID)

false && setTimeout(go, 500)

window.go    = go
window.stop  = stop
window.store = store

export default store
