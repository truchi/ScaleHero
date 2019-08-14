import { createStore } from 'redux'
import reducer         from './reducer'
import Clip            from '../lib/clip'
import Textures        from '../lib/textures'
import Timeline        from '../lib/timeline'
import { doStuff }    from '../lib/grid/index3'
// import * as R from 'ramda'

/* SHIT start */
const bpm = 60
const grid = {
  count: 2,
  sections: [
    {
      count: 2,
      lines: [
        {
          bars: [
            { repeat: true          , items: [{ duration: 1, chord: 'A' }, { duration: 1, chord: 'B' }] },
            { repeat: true, count: 2, items: [{ duration: 1, chord: 'C' }] },
            {               count: 2, items: [{ duration: 1, chord: 'D' }] },
            {                         items: [{ duration: 1, chord: 'E' }] },
            {                         items: [{ duration: 1, chord: 'E' }] },
          ]
        },
      ]
    },
  ]
}

const a = doStuff(grid)
console.log(JSON.stringify(a, null, 4))

const instruments = [
  {
    instrument: 'piano',
    tuning: ['C'],//['E', 'A', 'D', 'G', 'B', 'E'],
    from  : 0,
    to    : 24,
    layers: [
      {
        palette: 1,
        root: 'C',
        scale: 2,
      },
      {
        clipPaths: [0, 1, 2, 3],
        masks: [0],
        palette: 0,
        root: 'C',
        scale: 1,
      },
      {
        clipPaths: [4],
        masks: [0],
        palette: 0,
        root: 'C',
        scale: 0,
      },
    ],
  },
]
const t1 = [
  [4, [{ path: ['lol'], value: 1 }]],
]
const t2 = [
  [1, []],
  [2, [{ path: ['lol'], value: 2 }]],
]
const t3 = [
  [2, []],
  [2, [{ path: ['lol'], value: 3 }]],
]
const timeline = Timeline.make((60 * 1000) / bpm, instruments, [t1, t2, t3])
// console.log(timeline)

const intervals = [
  '1', 'b2', '2', '#2', 'b3', '3', 'b4', '4',
  '#4', 'b5', '5', '#5', 'b6', '6', 'bb7', 'b7', '7'
]

const palettes = [
  Object.fromEntries(
    intervals.map(
      (i, ind) =>
        [i, {
          backgroundImage: Textures({
            type: ['lines', 'circles', 'paths'][ind % 3],
            d: 'crosses',
            stroke: `hsl(${ 360 * (ind + intervals.length / 2) / intervals.length }, 100%, 50%)`,
            fill  : `hsl(${ 360 * (ind + intervals.length / 2) / intervals.length }, 100%, 50%)`,
            lighter: true,
            thicker: true,
            opacity: .6,
          }),
          backgroundColor: `hsl(${ 360 * ind / intervals.length }, 50%, 50%)`,
          borderRadius: ind % 3 === 0 ? '25%' : 0,
          borderColor: '#EEE',
          borderStyle: 'solid',
          borderWidth: '1px',
        }]
    )
  ),
  Object.fromEntries(
    intervals.map(i => [i, { backgroundColor: '#111', borderRadius: '25%' }])
  ),
]

const scales = [
  ['1', '2', '3', '4', '5', '6', '7'],
  ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
  ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'],
]

const clipPaths = [
  Clip.topLeft    (.5),
  Clip.topRight   (.5),
  Clip.bottomLeft (.5),
  Clip.bottomRight(.5),
  Clip.diamond    (.5),
]

const masks = [
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
  index: 0,
  grid,
  timeline,
  instruments,
  clipPaths,
  masks,
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

let roots   = ['C', 'C', 'D', 'E', 'F', 'G']
const cycle = arr => arr = arr.concat([arr.shift()])
const disp  = () => dispatch(roots = (cycle(roots)))
const go    = () => roots.map((v, i) => setTimeout(disp, i * 1000))
// const go    = () => window.intervalID = setInterval(disp, 500)

0 && setTimeout(go, 500)

window.go    = go
window.store = store
window.disp = disp
window.dispatch = dispatch

export default store
